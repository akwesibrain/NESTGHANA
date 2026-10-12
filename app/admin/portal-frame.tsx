import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { signOutAdmin } from "@/app/admin/actions";
import { ghanaDate, Icon } from "@/app/admin/admin-ui";
import { SectionTrail, SidebarNav, type NavGroup } from "@/app/admin/portal-nav";
import type { AdminContext } from "@/lib/server/admin-auth";
import { getDb } from "@/lib/server/db";

// The admin portal frame: grouped sidebar navigation, account card, and a top bar with breadcrumb,
// listing search, alerts and the account menu. Rendered once by app/admin/(portal)/layout.tsx (and by
// the dashboard at /admin), so it stays in place while pages load underneath it.

const SECTIONS = [
  { group: "Overview", href: "/admin", label: "Dashboard", icon: "home" },
  { group: "Marketplace", href: "/admin/listings", label: "Listings", icon: "list" },
  { group: "Marketplace", href: "/admin/reports", label: "Reports", icon: "flag" },
  { group: "Marketplace", href: "/admin/messages", label: "Messages", icon: "chat" },
  { group: "Sales", href: "/admin/payments", label: "Payments", icon: "card" },
  { group: "Sales", href: "/admin/data", label: "Data bundles", icon: "signal" },
  { group: "System", href: "/admin/settings", label: "Settings", icon: "settings" },
] as const;

const openReports = () => getDb().report.count({ where: { status: { in: ["OPEN", "REVIEWING"] } } });
const dataToDeliver = () => getDb().dataOrder.count({ where: { status: "PAID" } });

/** Counts stream in after the frame, so a slow query never delays the page. */
async function NavCount({ load, label }: { load: () => Promise<number>; label: string }) {
  const n = await load();
  return n ? <b className="ngd-nav-count" aria-label={`${n} ${label}`}>{n}</b> : null;
}

async function AlertDot() {
  return (await openReports()) ? <span className="ngd-dot" aria-hidden="true" /> : null;
}

function navGroups(): NavGroup[] {
  const badges: Record<string, ReactNode> = {
    "/admin/reports": <Suspense fallback={null}><NavCount load={openReports} label="open reports" /></Suspense>,
    "/admin/data": <Suspense fallback={null}><NavCount load={dataToDeliver} label="orders to deliver" /></Suspense>,
  };
  const groups: NavGroup[] = [];
  for (const section of SECTIONS) {
    let group = groups.find(g => g.title === section.group);
    if (!group) groups.push((group = { title: section.group, items: [] }));
    group.items.push({ href: section.href, label: section.label, icon: <Icon name={section.icon} size={18} />, badge: badges[section.href] });
  }
  return groups;
}

export function Brand() {
  return (
    <Link className="ngd-logo" href="/admin" aria-label="NestGH admin home">
      <img src="/logo-192.png" alt="" width={40} height={40} />
      <span><strong>NestGH</strong><small>Admin portal</small></span>
    </Link>
  );
}

export function PortalFrame({ admin, children }: { admin: AdminContext; children: ReactNode }) {
  const name = admin.user.displayName || admin.user.email;
  const role = admin.roles.join(", ").replaceAll("_", " ").toLowerCase();
  const initial = name.slice(0, 1).toUpperCase();
  return (
    <div className="admin-shell ngd">
      <aside className="ngd-sidebar">
        <Brand />
        <SidebarNav groups={navGroups()} />
        <div className="ngd-sidebar-foot">
          <Link className="ngd-side-link" href="/" target="_blank"><Icon name="external" size={16} /><span>View website</span></Link>
          <div className="ngd-user">
            <span className="ngd-avatar" aria-hidden="true">{initial}</span>
            <span className="ngd-user-text"><strong>{admin.user.displayName || "Admin"}</strong><small>{role}</small></span>
            <form action={signOutAdmin}>
              <button className="ngd-user-out" type="submit" aria-label="Sign out" title="Sign out"><Icon name="logout" size={17} /></button>
            </form>
          </div>
        </div>
      </aside>
      <div className="ngd-body">
        <header className="ngd-topbar">
          <SectionTrail sections={SECTIONS.map(({ href, label }) => ({ href, label }))} />
          <form className="ngd-search" action="/admin/listings" role="search">
            <Icon name="search" size={16} />
            <input type="search" name="q" placeholder="Search listings by title, area, town or ID" aria-label="Search listings" maxLength={100} />
          </form>
          <div className="ngd-topbar-actions">
            <span className="ngd-today"><Icon name="calendar" size={15} />{ghanaDate(new Date())}</span>
            <Link className="ngd-icon-button" href="/admin/reports" aria-label="Open reports">
              <Icon name="bell" /><Suspense fallback={null}><AlertDot /></Suspense>
            </Link>
            <details className="ngd-account">
              <summary aria-label="Account menu">
                <span className="ngd-avatar" aria-hidden="true">{initial}</span>
              </summary>
              <div className="ngd-account-menu">
                <p><strong>{name}</strong><span>{role}</span></p>
                <Link href="/admin/settings">Settings <Icon name="settings" size={14} /></Link>
                <Link href="/" target="_blank">View website <Icon name="external" size={14} /></Link>
                <form action={signOutAdmin}><button type="submit">Sign out <Icon name="logout" size={14} /></button></form>
              </div>
            </details>
          </div>
        </header>
        <main className="ngd-main">{children}</main>
      </div>
    </div>
  );
}
