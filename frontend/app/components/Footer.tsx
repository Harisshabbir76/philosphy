"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineInstagram, AiOutlineWhatsApp } from "react-icons/ai";

import footerImg from "../Images/footerimg.png";
import { API_BASE_URL } from "../lib/api";
import { useLanguage } from "../lib/LanguageContext";
import { translations } from "../lib/translations";

import "../Styles/Footer.css";

const Footer = () => {
  const [businessWhatsappNumber, setBusinessWhatsappNumber] = useState("");
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const { language, setLanguage, isArabic } = useLanguage();
  const t = translations[language].footer;

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
          <h2>{t.ctaHeading}</h2>
          <p>{t.ctaText}</p>
          <Link href="/booking" className="footer-consultation-link">
            {t.ctaButton}
          </Link>
        </div>
      </div>

      <button className="back-to-top" onClick={scrollToTop} type="button">
        <span className="up-arrow" aria-hidden="true"></span>
        <span>{t.backToTop}</span>
      </button>

      <div className="footer-bottom">
        <div className="footer-links">
          <Link href="/">{t.home}</Link>
          <Link href="/our-story">{t.ourStory}</Link>
          <Link href="/faq">{t.faq}</Link>
          <Link href="/contact-us">{t.contactUs}</Link>
          <Link href="/legal">{t.legal}</Link>
        </div>

        <div className="footer-info">
          <span>{t.copyright}</span>

          <div className="social-links">
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <AiOutlineInstagram className="social-icon" />
            </a>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <AiOutlineWhatsApp className="social-icon" />
            </a>
          </div>

          <div className="lang-selector" ref={langRef}>
            <button
              className="lang-selector__trigger"
              onClick={() => setLangOpen((o) => !o)}
              aria-haspopup="listbox"
              aria-expanded={langOpen}
              type="button"
            >
              {isArabic ? "عربي" : "ENG"}
              <span className="lang-arrow" aria-hidden="true">⌵</span>
            </button>
            {langOpen && (
              <ul className="lang-selector__dropdown" role="listbox">
                <li
                  role="option"
                  aria-selected={!isArabic}
                  className={`lang-selector__option${!isArabic ? " lang-selector__option--active" : ""}`}
                  onClick={() => { setLanguage("en"); setLangOpen(false); }}
                >
                  ENG
                </li>
                <li
                  role="option"
                  aria-selected={isArabic}
                  className={`lang-selector__option${isArabic ? " lang-selector__option--active" : ""}`}
                  onClick={() => { setLanguage("ar"); setLangOpen(false); }}
                >
                  عربي
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
