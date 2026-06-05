"use client";

import { FormEvent, useState } from "react";
import Modal from "./Modal";
import "../Styles/ContactForm.css";

const serviceOptions = [
  "Analysis",
  "Wardrobe",
  "Personal Shopping",
  "Bridal",
  "Not Sure Yet",
];

type SubmitState = "idle" | "sending";

export default function ContactForm() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error">("success");

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Unable to send contact request");
      }

      form.reset();
      setSubmitState("idle");
      setModalTitle("Thank You");
      setModalMessage("Your request has been sent successfully.");
      setModalType("success");
      setModalOpen(true);
    } catch {
      setSubmitState("idle");
      setModalTitle("Submission Failed");
      setModalMessage("Failed to send message. Please try again later.");
      setModalType("error");
      setModalOpen(true);
    }
  }

  return (
    <>
      <form className="contact-form" onSubmit={handleSubmit}>
        <input name="fullName" type="text" placeholder="Full Name*" required />
        <input name="email" type="email" placeholder="Email Address*" required />
        <input name="phone" type="tel" placeholder="Phone Number*" required />

        <select name="serviceInterest" required defaultValue="">
          <option value="" disabled>
            Service of Interest
          </option>
          {serviceOptions.map((service) => (
            <option value={service} key={service}>
              {service}
            </option>
          ))}
        </select>

        <textarea
          name="stylingNeeds"
          placeholder="Tell Me About Your Styling Needs*"
          required
        />

        <label className="contact-form__label">Preferred Date / Timeline (Optional)</label>
        <div className="contact-form__date-row">
          <input name="preferredDate" type="date" aria-label="Preferred date" />
          <input name="preferredTime" type="time" aria-label="Preferred time" />
        </div>

        <button type="submit" disabled={submitState === "sending"}>
          {submitState === "sending" ? "SENDING..." : "BEGIN YOUR EXPERIENCE"}
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
