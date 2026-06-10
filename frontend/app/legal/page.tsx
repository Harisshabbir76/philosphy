"use client";

import "../Styles/LegalPage.css";
import GettingStartedBottom from "../components/GettingStartedbottom";
import { useLanguage } from "../lib/LanguageContext";
import { translations } from "../lib/translations";

type PolicySection = {
  heading: string | null;
  text?: string;
  list?: string[];
  note?: string;
};

function PolicyContent({ sections }: { sections: PolicySection[] }) {
  return (
    <>
      {sections.map((section, i) => (
        <div key={i}>
          {section.heading && <h3>{section.heading}</h3>}
          {section.text && <p>{section.text}</p>}
          {section.list && (
            <ul>
              {section.list.map((item, j) => <li key={j}>{item}</li>)}
            </ul>
          )}
          {section.note && <p>{section.note}</p>}
        </div>
      ))}
    </>
  );
}

export default function LegalPage() {
  const { language } = useLanguage();
  const t = translations[language].legal;

  return (
    <main className="legal-page">
      <div className="legal-page__inner">
        <h1 className="legal-page__title">{t.title}</h1>
        <div className="legal-page__content">
          {t.policies.map((policy) => (
            <details className="legal-accordion" name="legal-policies" key={policy.title}>
              <summary>
                <span>{policy.title}</span>
                <span className="legal-accordion__mark" aria-hidden="true" />
              </summary>
              <div className="legal-accordion__content">
                <PolicyContent sections={policy.sections as PolicySection[]} />
              </div>
            </details>
          ))}
        </div>
      </div>
      <GettingStartedBottom />
    </main>
  );
}
