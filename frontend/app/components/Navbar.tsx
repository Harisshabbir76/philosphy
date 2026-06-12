"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import logo from "../Images/logo.png";
import { useLanguage } from "../lib/LanguageContext";
import { translations } from "../lib/translations";
import { getStoredUser } from "../lib/api";
import "../Styles/Navbar.css";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { language } = useLanguage();
  const t = translations[language].navbar;

  // Reflect auth state from localStorage; re-check on route changes and across tabs.
  useEffect(() => {
    const syncAuth = () => setIsLoggedIn(Boolean(getStoredUser()?.token));
    syncAuth();
    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setIsMobileMenuOpen(false);
    router.push("/");
  };

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
    { href: "/", label: t.home },
    { href: "/our-story", label: t.ourStory },
    { href: "/analysis", label: t.analysis },
    { href: "/wardrobe", label: t.wardrobe },
    { href: "/personal-shopping", label: t.personalShopping },
    { href: "/bridal", label: t.bridal },
  ];

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="nav-left">
            <Link href="/" className="logo-link">
              <Image src={logo} alt="Philosophy" className="nav-logo-img" priority />
            </Link>
          </div>

          {!isMobile && (
            <div className="nav-right">
              <div className="nav-links-right">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="nav-tab">
                    {link.label}
                  </Link>
                ))}
                <Link href="/booking" className="nav-tab nav-tab--book">
                  {t.bookNow}
                </Link>
                {isLoggedIn && (
                  <button type="button" className="nav-tab nav-tab--logout" onClick={handleLogout}>
                    {t.logout}
                  </button>
                )}
              </div>
            </div>
          )}

          {isMobile && (
            <div className="mobile-actions">
              <Link href="/booking" className="mobile-book-btn">
                {t.bookNow}
              </Link>
              <button
                className="hamburger-btn"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className={`mobile-sidebar ${isMobileMenuOpen ? "mobile-sidebar--open" : ""}`} onClick={() => setIsMobileMenuOpen(false)}>
        <div className="mobile-sidebar__content" onClick={(e) => e.stopPropagation()}>
          <button className="mobile-sidebar__close" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div className="mobile-sidebar__nav">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="mobile-sidebar__link" onClick={() => setIsMobileMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            {isLoggedIn && (
              <button type="button" className="mobile-sidebar__link mobile-sidebar__logout" onClick={handleLogout}>
                {t.logout}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
