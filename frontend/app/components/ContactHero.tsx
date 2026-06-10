"use client";

import Image from "next/image";
import contactBanner from "../Images/contact-banner.png";
import ContactForm from "./ContactForm";
import { useLanguage } from "../lib/LanguageContext";
import { translations } from "../lib/translations";
import "../Styles/ContactHero.css";

export default function ContactHero() {
  const { language } = useLanguage();
  const t = translations[language].contactHero;

  return (
    <section className="contact-hero">
      <div className="contact-hero__banner" style={{ position: "relative" }}>
        <Image src={contactBanner} alt="Contact us background banner" fill priority={true} sizes="100vw" className="object-cover" />
        <div className="contact-hero__shade" />
        <h1>{t.title}</h1>
      </div>

      <div className="contact-card">
        <h2>{t.heading}</h2>
        <p>{t.text}</p>
        <ContactForm />
      </div>
    </section>
  );
}
