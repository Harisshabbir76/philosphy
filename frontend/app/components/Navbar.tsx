"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import logo from "../Images/logo.png";
import "../Styles/Navbar.css";

export default function Navbar() {
  usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
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

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/our-story", label: "Our Story" },
    { href: "/analysis", label: "Analysis" },
    { href: "/wardrobe", label: "Wardrobe" },
    { href: "/personal-shopping", label: "Personal Shopping" },
    { href: "/bridal", label: "Bridal" },
  ];

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          {/* Left Side - Logo */}
          <div className="nav-left">
            <Link href="/" className="logo-link">
              <Image
                src={logo}
                alt="Philosophy"
                className="nav-logo-img"
                priority
              />
            </Link>
          </div>

          {/* Right Side - Nav Links (desktop) or Hamburger (mobile) */}
          <div className="nav-right">
            {isMobile ? (
              <button
                className="hamburger-btn"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            ) : (
              <div className="nav-links-right">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="nav-tab">
                    {link.label}
                  </Link>
                ))}
                <Link href="/booking" className="nav-tab nav-tab--book">
                  Book Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div
        className={`mobile-sidebar ${isMobileMenuOpen ? "mobile-sidebar--open" : ""}`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div
          className="mobile-sidebar__content"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="mobile-sidebar__close"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div className="mobile-sidebar__nav">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="mobile-sidebar__link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/booking"
              className="mobile-sidebar__link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
