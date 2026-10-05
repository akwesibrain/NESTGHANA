"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type AdminNavigationProps = {
  canManageSettings: boolean;
};

const navigationItems = [
  { label: "Dashboard", href: "#overview", active: true },
  { label: "Listings", href: "#listings", active: false },
];

export function AdminNavigation({ canManageSettings }: AdminNavigationProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousFocus = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const drawer = drawerRef.current;
    const focusable = () => drawer?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    focusable()?.[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;

      const items = focusable();
      if (!items?.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [open]);

  const items = canManageSettings
    ? [...navigationItems, { label: "Settings", href: "#website-settings", active: false }]
    : navigationItems;

  return (
    <>
      <nav className="admin-desktop-nav" aria-label="Admin workspace">
        <div className="admin-nav-pill">
          {items.map((item) => (
            <a
              className={item.active ? "admin-nav-link active" : "admin-nav-link"}
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              key={item.label}
            >
              {item.label}
            </a>
          ))}
          <details className="admin-nav-more">
            <summary>More</summary>
            <div className="admin-nav-menu">
              {canManageSettings ? <a href="#website-settings">Website settings</a> : null}
              <a href="#listings">Listing management</a>
            </div>
          </details>
        </div>
      </nav>
      <button
        aria-controls="admin-mobile-drawer"
        aria-expanded={open}
        aria-label={open ? "Close admin navigation" : "Open admin navigation"}
        className="admin-menu-button"
        onClick={() => setOpen(true)}
        ref={triggerRef}
        type="button"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {open ? (
        <div className="admin-drawer-layer">
          <button
            aria-label="Close navigation"
            className="admin-drawer-backdrop"
            onClick={() => setOpen(false)}
            tabIndex={-1}
            type="button"
          />
          <aside
            aria-label="Admin navigation"
            aria-modal="true"
            className="admin-mobile-drawer"
            id="admin-mobile-drawer"
            ref={drawerRef}
            role="dialog"
          >
            <div className="admin-drawer-heading">
              <span>Navigation</span>
              <button
                aria-label="Close navigation"
                className="admin-drawer-close"
                onClick={() => setOpen(false)}
                type="button"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="m6 6 12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
            <nav aria-label="Admin workspace">
              {items.map((item) => (
                <Link
                  aria-current={item.active ? "page" : undefined}
                  className={item.active ? "admin-drawer-link active" : "admin-drawer-link"}
                  href={item.href}
                  key={item.label}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link className="admin-drawer-link" href="#listings" onClick={() => setOpen(false)}>
                Listing management
              </Link>
            </nav>
          </aside>
        </div>
      ) : null}
    </>
  );
}
