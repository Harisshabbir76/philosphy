"use client";

import Image from "next/image";
import store from "../Images/store.png";
import { useLanguage } from "../lib/LanguageContext";
import { translations } from "../lib/translations";
import "../Styles/ContactGettingStarted.css";

export default function ContactGettingStarted() {
  const { language } = useLanguage();
  const t = translations[language].contactGettingStarted;

  return (
    <section className="contact-started">
      <div className="contact-started__intro">
        <div className="contact-started__store">
          <Image src={store} alt="Fashion atelier interior" fill sizes="440px" />
        </div>
        <h2 className="wanna-learn">{t.workshopTitle}</h2>
        <h2>{t.workshopSubtitle}</h2>
        <p>{t.workshopText}</p>
        <a href="/contact-us">{t.workshopButton}</a>
      </div>

      <div className="contact-started__steps">
        <p className="contact-started__kicker">{t.kicker}</p>
        <div className="contact-started__cards">
          {t.steps.map((step, index) => (
            <article className="contact-started__card" key={index}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
