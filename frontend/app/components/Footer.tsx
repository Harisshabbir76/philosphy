"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import footerImg from "../Images/footerimg.png";
import { API_BASE_URL } from "../lib/api";
import "../Styles/Footer.css";

const Footer = () => {
  const [businessWhatsappNumber, setBusinessWhatsappNumber] = useState("");

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/settings/public`);
        if (!response.ok) return;
        const data = await response.json();
        setBusinessWhatsappNumber(data.businessWhatsappNumber || "");
      } catch {
        setBusinessWhatsappNumber("");
      }
    };

    loadSettings();
  }, []);

  const whatsappHref = useMemo(() => {
    const cleanNumber = businessWhatsappNumber.replace(/[^\d]/g, "");
    return cleanNumber ? `https://wa.me/${cleanNumber}` : "https://wa.me/";
  }, [businessWhatsappNumber]);

  const scrollToTop = () => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-cta">
          <Image src={footerImg} alt="" className="footer-cta__icon" />
          <h2>READY TO WORK WITH US?</h2>
          <p>
            If you&apos;re ready to refine your style with intention and ease, we&apos;re here to
            guide you. Let&apos;s create something that feels effortless, elevated, and truly aligned
            with you.
          </p>
          <Link href="/contact-us" className="footer-consultation-link">
            BOOK YOUR CONSULTATION NOW
          </Link>
        </div>
      </div>

      <button className="back-to-top" onClick={scrollToTop} type="button">
        <span className="up-arrow" aria-hidden="true"></span>
        <span>BACK TO TOP</span>
      </button>

      <div className="footer-bottom">
        <div className="footer-links">
          <Link href="/">HOME</Link>
          <Link href="/our-story">OUR STORY</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/contact-us">CONTACT US</Link>
          <Link href="/legal">LEGAL</Link>
        </div>

        <div className="footer-info">
          <span>© 2026 PHILOSOPHY</span>
          <div className="social-links">
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5A4.5 4.5 0 1 1 12 16a4.5 4.5 0 0 1 0-9Zm0 2A2.5 2.5 0 1 0 12 14a2.5 2.5 0 0 0 0-5Zm5.1-2.35a1.05 1.05 0 1 1-1.05 1.05 1.05 1.05 0 0 1 1.05-1.05Z" />
              </svg>
            </a>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.04 2a9.84 9.84 0 0 0-8.36 15.04L2.55 22l5.08-1.09A9.84 9.84 0 1 0 12.04 2Zm0 1.9a7.94 7.94 0 0 1 6.73 12.18 7.9 7.9 0 0 1-9.88 2.83l-.32-.16-3.58.77.78-3.44-.19-.34A7.94 7.94 0 0 1 12.04 3.9Zm-3.1 3.76c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.07 3.31 5.12 4.51 2.53 1 3.05.8 3.6.75.55-.05 1.78-.73 2.03-1.43.25-.7.25-1.31.18-1.43-.08-.13-.28-.2-.58-.35-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.95 1.18-.18.2-.35.23-.65.08-.3-.15-1.28-.47-2.43-1.5-.9-.8-1.5-1.78-1.68-2.08-.18-.3-.02-.47.13-.62.13-.13.3-.35.45-.53.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.68-1.64-.93-2.25-.24-.58-.49-.5-.68-.51h-.58Z" />
              </svg>
            </a>
          </div>
          {/* <div className="lang-selector">
            ENG <span className="lang-arrow" aria-hidden="true">⌵</span>
          </div> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
