"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

// The parts of the admin frame that depend on the current URL. They are client components so the
// frame (rendered once by the portal layout) can stay mounted while pages change underneath it.

export type NavItem = { href: string; label: string; icon: ReactNode; badge?: ReactNode };
export type NavGroup = { title: string; items: NavItem[] };

/** "/admin" matches only itself; other sections also match their sub-pages. */
const isActive = (pathname: string, href: string) => (href === "/admin" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`));

export function SidebarNav({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname();
  return (
    <nav className="ngd-tabs" aria-label="Admin sections">
      {groups.map(group => (
        <div className="ngd-nav-group" key={group.title}>
          <p className="ngd-nav-title">{group.title}</p>
          {group.items.map(item => {
            const active = isActive(pathname, item.href);
            return (
              <Link key={item.href} href={item.href} className={active ? "is-active" : undefined} aria-current={active ? "page" : undefined}>
                {item.icon}
                <span>{item.label}</span>
                {item.badge}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

/** Breadcrumb in the top bar: Admin / current section. */
export function SectionTrail({ sections }: { sections: { href: string; label: string }[] }) {
  const pathname = usePathname();
  const current = sections.find(section => isActive(pathname, section.href));
  const deeper = current && pathname !== current.href;
  return (
    <nav className="ngd-trail" aria-label="Breadcrumb">
      <Link href="/admin">Admin</Link>
      <span aria-hidden="true">/</span>
      {current ? (
        deeper ? <Link href={current.href}>{current.label}</Link> : <strong aria-current="page">{current.label}</strong>
      ) : <strong>Portal</strong>}
      {deeper ? <><span aria-hidden="true">/</span><strong aria-current="page">Details</strong></> : null}
    </nav>
  );
}
