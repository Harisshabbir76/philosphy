"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";

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

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-cta">
          <Image src={footerImg} alt="" className="footer-cta__icon" />

          <h2>READY TO WORK WITH US?</h2>

          <p>
            If you're ready to refine your style with intention and ease, we're
            here to guide you. Let's create something that feels effortless,
            elevated, and truly aligned with you.
          </p>

          <Link href="/booking" className="footer-consultation-link">
            BOOK YOUR CONSULTATION NOW
          </Link>
        </div>
      </div>

      <button
        className="back-to-top"
        onClick={scrollToTop}
        type="button"
      >
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
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram className="social-icon" />
            </a>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              <FaWhatsapp className="social-icon" />
            </a>
          </div>

          {/*
          <div className="lang-selector">
            ENG <span className="lang-arrow" aria-hidden="true">⌵</span>
          </div>
          */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;