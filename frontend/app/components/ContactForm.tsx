"use client";

import { FormEvent, useState } from "react";
import "../Styles/ContactForm.css";

const serviceOptions = [
  "Analysis",
  "Wardrobe",
  "Personal Shopping",
  "Bridal",
  "Not Sure Yet",
];

type SubmitState = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState("sending");
    setMessage("");

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
      setSubmitState("success");
      setMessage("Your request has been sent.");
    } catch {
      setSubmitState("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
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
        <input name="preferredTime" type="text" placeholder="Time" aria-label="Preferred time" />
      </div>

      <button type="submit" disabled={submitState === "sending"}>
        {submitState === "sending" ? "SENDING..." : "BEGIN YOUR EXPERIENCE"}
      </button>

      {message ? (
        <p className={`contact-form__status contact-form__status--${submitState}`}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
