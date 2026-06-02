"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import "./admin-panel.css";

const links = [
  { href: "/philosphy/admin/panel", label: "Booking" },
  { href: "/philosphy/admin/panel/home", label: "Home" },
  { href: "/philosphy/admin/panel/our-story", label: "Our Story" },
  { href: "/philosphy/admin/panel/analysis", label: "Analysis" },
  { href: "/philosphy/admin/panel/wardrobe", label: "Wardrobe" },
  { href: "/philosphy/admin/panel/personal-shopping", label: "Personal Shopping" },
  { href: "/philosphy/admin/panel/bridal", label: "Bridal" },
];

export default function AdminPanelShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="admin-panel-shell">
      <aside className="admin-panel-sidebar">
        <div className="admin-panel-sidebar__brand">
          <p>Philosophy</p>
          <span>Admin Dashboard</span>
        </div>
        <nav className="admin-panel-sidebar__nav" aria-label="Admin navigation">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link className={isActive ? "is-active" : ""} href={link.href} key={link.href}>
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="admin-panel-content">{children}</div>
    </div>
  );
}
