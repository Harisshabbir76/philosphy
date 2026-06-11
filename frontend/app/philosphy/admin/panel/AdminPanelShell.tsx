"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { FiMenu, FiX, FiLogOut } from "react-icons/fi";
import "./admin-panel.css";
import "../../../Styles/CMSSidebar.css";
import { CMSProvider } from "../../../lib/CMSProvider";
import { RightSidebar } from "../../../components/CMS/RightSidebar";

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
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 860;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileMenuOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <CMSProvider editingEnabled>
      {/* Mobile Header with Hamburger */}
      {isMobile && (
        <div className="admin-mobile-header">
          <div className="admin-mobile-brand">
            <p>Philosophy</p>
            <span>Admin Dashboard</span>
          </div>
          <button
            className="admin-hamburger-btn"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Menu"
          >
            <FiMenu size={24} />
          </button>
        </div>
      )}

      <div className="admin-panel-shell">
        {/* Desktop Sidebar */}
        {!isMobile && (
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
              <button type="button" className="admin-panel-sidebar__logout" onClick={handleLogout}>
                <FiLogOut size={16} />
                Logout
              </button>
            </nav>
          </aside>
        )}

        {/* Mobile Sidebar (Drawer) */}
        {isMobile && (
          <>
            <div
              className={`admin-mobile-overlay ${isMobileMenuOpen ? "open" : ""}`}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <aside className={`admin-mobile-sidebar ${isMobileMenuOpen ? "open" : ""}`}>
              <div className="admin-mobile-sidebar-header">
                <div className="admin-mobile-sidebar-brand">
                  <p>Philosophy</p>
                  <span>Admin Dashboard</span>
                </div>
                <button
                  className="admin-mobile-close-btn"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <FiX size={24} />
                </button>
              </div>
              <nav className="admin-mobile-sidebar__nav" aria-label="Admin navigation">
                {links.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      className={isActive ? "is-active" : ""}
                      href={link.href}
                      key={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                <button
                  type="button"
                  className="admin-panel-sidebar__logout"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                >
                  <FiLogOut size={16} />
                  Logout
                </button>
              </nav>
            </aside>
          </>
        )}

        <div className="admin-panel-content">{children}</div>
      </div>

      {/* CMS Right Sidebar — appears when an element is being edited */}
      <RightSidebar />
    </CMSProvider>
  );
}