"use client";

import { useLanguage } from "../lib/LanguageContext";
import { translations } from "../lib/translations";
import "../Styles/FaqQuestionsAnswers.css";

export default function FaqQuestionsAnswers() {
  const { language } = useLanguage();
  const faqs = translations[language].faqAnswers;

  return (
    <section className="faq-answers" aria-label="FAQ answers">
      <div className="faq-answers__list">
        {faqs.map((item, index) => (
          <details className="faq-answer" name="faq-answers" key={index}>
            <summary className="faq-answer__trigger">
              <span>
                {index + 1}. {item.question}
              </span>
              <span className="faq-answer__icon" aria-hidden="true" />
            </summary>
            <div className="faq-answer__panel">
              <p>{item.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
