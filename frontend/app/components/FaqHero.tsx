"use client";

import Image from "next/image";
import faqHeroBanner from "../Images/faq-hero.png";
import { useLanguage } from "../lib/LanguageContext";
import { translations } from "../lib/translations";
import "../Styles/FaqHero.css";

export default function FaqHero() {
  const { language } = useLanguage();
  const t = translations[language].faqHero;

  return (
    <section className="faq-hero" aria-label="Frequently asked questions">
      <Image src={faqHeroBanner} alt="Frequently asked questions background banner" fill priority={true} sizes="100vw" className="object-cover" />
      <div className="faq-hero__shade" />
      <h1>{t.title}</h1>
    </section>
  );
}
