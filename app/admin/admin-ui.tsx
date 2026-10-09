import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { ListingStatus } from "@/generated/prisma/client";
import { signOutAdmin } from "@/app/admin/actions";
import type { AdminContext } from "@/lib/server/admin-auth";
import "./admin.css";
import "./dashboard.css";

// Shared admin chrome (top bar + tabs) and small presentational pieces used by every admin page.

const TABS = [
  { href: "/admin", label: "Dashboard", icon: "home" },
  { href: "/admin/listings", label: "Listings", icon: "list" },
  { href: "/admin/payments", label: "Payments", icon: "card" },
  { href: "/admin/reports", label: "Reports", icon: "flag" },
  { href: "/admin/messages", label: "Messages", icon: "chat" },
  { href: "/admin/settings", label: "Settings", icon: "settings" },
] as const;

const ICONS: Record<string, ReactNode> = {
  home: <><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /><path d="M10 21v-6h4v6" /></>,
  list: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
  card: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18M7 15h3" /></>,
  flag: <><path d="M5 21V4" /><path d="M5 4h11l-2 4 2 4H5" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  bell: <><path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8" /><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0" /></>,
  building: <><rect x="5" y="3" width="14" height="18" rx="1.5" /><path d="M9 7h1.5M13.5 7H15M9 11h1.5M13.5 11H15M9 15h1.5M13.5 15H15M10.5 21v-3h3v3" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14a6.5 6.5 0 0 1 3.5 6" /></>,
  cedi: <><circle cx="12" cy="12" r="9" /><path d="M15 8.5a4 4 0 1 0 0 7M12 5v14" /></>,
  check: <><circle cx="12" cy="12" r="9" /><path d="m8 12.5 2.8 2.8L16 10" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  x: <><circle cx="12" cy="12" r="9" /><path d="m9 9 6 6M15 9l-6 6" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  shield: <><path d="M12 3 4 6v6c0 5 3.4 8 8 9 4.6-1 8-4 8-9V6Z" /><path d="M12 8v5M12 16h.01" /></>,
  alert: <><path d="M10.3 4 2.6 18a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 4a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></>,
  lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
  key: <><circle cx="7.5" cy="15.5" r="4" /><path d="m10.4 12.6 8.6-8.6M16 7l2.5 2.5M14 9l1.5 1.5" /></>,
  bed: <><path d="M3 18V7M3 13h18v5M21 13a3 3 0 0 0-3-3h-7v3" /><circle cx="7" cy="10.5" r="1.5" /></>,
  hostel: <><path d="M3 21V8l9-5 9 5v13" /><path d="M8 21v-5h8v5M8 11h2M14 11h2" /></>,
  shop: <><path d="M4 9 5.5 4h13L20 9" /><path d="M4 9a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0" /><path d="M5 11v10h14V11M10 21v-5h4v5" /></>,
  office: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18" /></>,
  warehouse: <><path d="M3 21V9l9-5 9 5v12" /><path d="M7 21v-8h10v8M7 17h10" /></>,
  grid: <><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></>,
  pin: <><path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12Z" /><circle cx="12" cy="9" r="2.5" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
  activity: <path d="M3 12h4l3-8 4 16 3-8h4" />,
  external: <><path d="M14 4h6v6M20 4l-9 9" /><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></>,
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  chat: <><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.9A8 8 0 1 1 21 12Z" /><path d="M8.5 11h7M8.5 14h4" /></>,
};

export function Icon({ name, size = 18 }: { name: keyof typeof ICONS | string; size?: number }) {
  return (
    <svg className="ngd-icon" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      {ICONS[name] ?? ICONS.grid}
    </svg>
  );
}

export const cedis = (pesewas: number, digits = 0) =>
  new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS", maximumFractionDigits: digits, minimumFractionDigits: digits }).format(pesewas / 100);
export const count = (n: number) => new Intl.NumberFormat("en-GH").format(n);
export const ghanaDate = (value: Date, withTime = false) =>
  value.toLocaleString("en-GH", {
    timeZone: "Africa/Accra",
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });

export function timeAgo(value: Date) {
  const minutes = Math.max(0, Math.round((Date.now() - value.getTime()) / 60_000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  return days < 30 ? `${days} day${days === 1 ? "" : "s"} ago` : ghanaDate(value);
}

/** Percentage change vs the previous period. Arrow + sign + words, never colour alone. */
export function Trend({ value, period = "vs last 30 days", inverse = false }: { value: number | null; period?: string; inverse?: boolean }) {
  if (value === null) return <span className="ngd-trend is-flat">No earlier data {period.replace("vs ", "for ")}</span>;
  const good = inverse ? value <= 0 : value >= 0;
  return (
    <span className={`ngd-trend ${value === 0 ? "is-flat" : good ? "is-up" : "is-down"}`}>
      <span aria-hidden="true">{value > 0 ? "↑" : value < 0 ? "↓" : "→"}</span> {value > 0 ? "+" : ""}{value}% <span className="ngd-muted">{period}</span>
    </span>
  );
}

const STATUS_LABEL: Record<ListingStatus, string> = {
  DRAFT: "Draft",
  PAYMENT_PENDING: "Awaiting payment",
  PENDING_APPROVAL: "Pending review",
  CHANGES_REQUESTED: "Changes requested",
  LIVE: "Live",
  NEEDS_CONFIRMATION: "Needs confirmation",
  UNAVAILABLE: "Unavailable",
  REJECTED: "Rejected",
  REMOVED: "Removed",
};
const STATUS_TONE: Record<ListingStatus, "good" | "warning" | "critical" | "neutral"> = {
  DRAFT: "neutral", PAYMENT_PENDING: "warning", PENDING_APPROVAL: "warning", CHANGES_REQUESTED: "warning",
  LIVE: "good", NEEDS_CONFIRMATION: "warning", UNAVAILABLE: "neutral", REJECTED: "critical", REMOVED: "critical",
};

export function StatusBadge({ status }: { status: ListingStatus }) {
  return <span className={`ngd-badge is-${STATUS_TONE[status]}`}>{STATUS_LABEL[status]}</span>;
}

export function Card({ title, link, children, className = "" }: { title?: string; link?: { href: string; label?: string }; children: ReactNode; className?: string }) {
  return (
    <section className={`ngd-card ${className}`} aria-label={title}>
      {title ? (
        <header className="ngd-card-head">
          <h2>{title}</h2>
          {link ? <Link href={link.href}>{link.label ?? "View all"} <Icon name="arrowRight" size={13} /></Link> : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}

/** Listing photo thumbnail (admin image route), or a placeholder when there is no photo. */
export function Thumb({ imageId, small = false }: { imageId?: string; small?: boolean }) {
  const size = small ? 44 : 56;
  return imageId ? (
    <Image className={`ngd-thumb${small ? " is-small" : ""}`} src={`/api/admin/images/${imageId}`} alt="" width={size} height={size} unoptimized />
  ) : (
    <span className={`ngd-thumb is-empty${small ? " is-small" : ""}`} aria-hidden="true"><Icon name="home" /></span>
  );
}

/** Top bar + tabs shared by every signed-in admin page. */
export function AdminFrame({ admin, active, alerts = 0, children }: { admin: AdminContext; active: string; alerts?: number; children: ReactNode }) {
  const name = admin.user.displayName || admin.user.email;
  return (
    <div className="admin-shell ngd">
      <header className="ngd-topbar">
        <Link className="ngd-logo" href="/admin" aria-label="NestGH admin home">
          <Image src="/logo-192.png" alt="" width={40} height={40} priority />
          <span><strong>NestGH</strong><small>Find. Rent. Grow.</small></span>
        </Link>
        <nav className="ngd-tabs" aria-label="Admin sections">
          {TABS.map(tab => (
            <Link key={tab.href} href={tab.href} className={tab.href === active ? "is-active" : undefined} aria-current={tab.href === active ? "page" : undefined}>
              <Icon name={tab.icon} size={16} />{tab.label}
            </Link>
          ))}
        </nav>
        <div className="ngd-topbar-actions">
          <Link className="ngd-icon-button" href="/admin/listings" aria-label="Search listings"><Icon name="search" /></Link>
          <Link className="ngd-icon-button" href="/admin/reports" aria-label={alerts ? `${alerts} open reports` : "Reports"}>
            <Icon name="bell" />{alerts ? <span className="ngd-dot" aria-hidden="true" /> : null}
          </Link>
          <details className="ngd-account">
            <summary>
              <span className="ngd-avatar" aria-hidden="true">{name.slice(0, 1).toUpperCase()}</span>
              <span className="ngd-account-name">{admin.user.displayName || "Admin"}</span>
            </summary>
            <div className="ngd-account-menu">
              <p><strong>{name}</strong><span>{admin.roles.join(", ").replaceAll("_", " ").toLowerCase()}</span></p>
              <Link href="/" target="_blank">View website <Icon name="external" size={14} /></Link>
              <form action={signOutAdmin}><button type="submit">Sign out</button></form>
            </div>
          </details>
        </div>
      </header>
      <main className="ngd-main">{children}</main>
    </div>
  );
}
