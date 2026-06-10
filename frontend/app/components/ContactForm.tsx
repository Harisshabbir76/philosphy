"use client";

import { FormEvent, useState } from "react";
import Modal from "./Modal";
import { useLanguage } from "../lib/LanguageContext";
import { translations } from "../lib/translations";
import "../Styles/ContactForm.css";

type SubmitState = "idle" | "sending";

export default function ContactForm() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const { language } = useLanguage();
  const t = translations[language].contactForm;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState("sending");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    const endpoint =
      process.env.NEXT_PUBLIC_CONTACT_API_URL || "http://127.0.0.1:5000/api/contact";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Unable to send contact request");

      form.reset();
      setSubmitState("idle");
      setModalTitle(t.successTitle);
      setModalMessage(t.successMessage);
      setModalType("success");
      setModalOpen(true);
    } catch {
      setSubmitState("idle");
      setModalTitle(t.errorTitle);
      setModalMessage(t.errorMessage);
      setModalType("error");
      setModalOpen(true);
    }
  }

  return (
    <>
      <form className="contact-form" onSubmit={handleSubmit}>
        <input name="fullName" type="text" placeholder={t.fullName} required />
        <input name="email" type="email" placeholder={t.email} required />
        <input name="phone" type="tel" placeholder={t.phone} required />

        <select name="serviceInterest" required defaultValue="">
          <option value="" disabled>{t.serviceInterest}</option>
          {t.services.map((service) => (
            <option value={service} key={service}>{service}</option>
          ))}
        </select>

        <textarea name="stylingNeeds" placeholder={t.stylingNeeds} required />

        <label className="contact-form__label">{t.preferredDate}</label>
        <div className="contact-form__date-row">
          <input name="preferredDate" type="date" aria-label="Preferred date" />
          <input name="preferredTime" type="time" aria-label="Preferred time" />
        </div>

        <button type="submit" disabled={submitState === "sending"}>
          {submitState === "sending" ? t.sending : t.submit}
        </button>
      </form>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        message={modalMessage}
        type={modalType}
      />
    </>
  );
}
