"use client";

import Image from "next/image";
import Link from "next/link";
import faqImage from "../Images/faq2.jpg";
import { useLanguage } from "../lib/LanguageContext";
import { translations } from "../lib/translations";
import "../Styles/FaqQuestions.css";

export default function FaqQuestions() {
  const { language } = useLanguage();
  const t = translations[language].faqQuestions;

  return (
    <section className="faq-questions">
      <div className="faq-questions__wrap">
        <h2>
          {t.heading.split("\n").map((line, i) => (
            <span key={i}>{line}{i < t.heading.split("\n").length - 1 && <br />}</span>
          ))}
        </h2>
        <div className="faq-questions__image">
          <Image src={faqImage} alt="Woman reading a magazine" fill sizes="118px" />
        </div>
        <Link href="/contact-us" className="faq-questions__link">
          {t.link}
        </Link>
      </div>
    </section>
  );
}
