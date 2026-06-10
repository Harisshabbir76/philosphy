"use client";

import { useState } from "react";
import "../Styles/BookingPage.css";
import { API_BASE_URL } from "../lib/api";
import Modal from "../components/Modal";
import { useLanguage } from "../lib/LanguageContext";
import { translations } from "../lib/translations";

const formatTime = (time24: string) => {
  if (!time24) return "";
  const [hourStr, minute] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${ampm}`;
};

const servicesList = [
  "Color Analysis",
  "Body Type Analysis",
  "Face Shape Analysis",
  "Wardrobe Audit",
  "Personal Shopping",
  "Bridal Styling",
  "Complete Makeover",
];

export default function BookingPage() {
  const { language } = useLanguage();
  const t = translations[language].booking;
  // Keep the saved value in English (the canonical service list) regardless of UI language.
  const serviceLabels = (t.services as string[]) || servicesList;
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState(servicesList[0]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      const headers: HeadersInit = { "Content-Type": "application/json" };
      
      if (user && user.token) {
        headers["Authorization"] = `Bearer ${user.token}`;
      }

      const res = await fetch(`${API_BASE_URL}/api/booking/create`, {
        method: "POST",
        headers,
        body: JSON.stringify({ fullName, email, phone, service, date, time }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create booking");

      setBookingDetails(data);
      setIsSuccess(true);
      setLoading(false);
    } catch (err) {
      setModalTitle(t.failTitle);
      setModalMessage(t.failMessage);
      setModalOpen(true);
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="booking-success-wrapper">
        <div className="booking-success-card">
          <h1 className="booking-success-title">{t.thankYou}</h1>
          <p className="booking-success-subtitle">{t.confirmed}</p>
          <div className="booking-success-details">
            <div className="booking-detail-row">
              <span className="booking-detail-label">{t.client}</span>
              <span className="booking-detail-value">{bookingDetails?.fullName || fullName}</span>
            </div>
            <div className="booking-detail-row">
              <span className="booking-detail-label">{t.email}</span>
              <span className="booking-detail-value">{bookingDetails?.email || email}</span>
            </div>
            <div className="booking-detail-row">
              <span className="booking-detail-label">{t.phone}</span>
              <span className="booking-detail-value">{bookingDetails?.phone || phone}</span>
            </div>
            <div className="booking-detail-row">
              <span className="booking-detail-label">{t.service}</span>
              <span className="booking-detail-value">{bookingDetails?.service || service}</span>
            </div>
            <div className="booking-detail-row">
              <span className="booking-detail-label">{t.date}</span>
              <span className="booking-detail-value">{bookingDetails?.date ? new Date(bookingDetails.date).toLocaleDateString() : date}</span>
            </div>
            <div className="booking-detail-row">
              <span className="booking-detail-label">{t.time}</span>
              <span className="booking-detail-value">{formatTime(bookingDetails?.time || time)}</span>
            </div>
          </div>
          <button onClick={() => window.location.href = "/"} className="booking-success-btn">
            {t.returnHome}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="booking-container">
        <div className="booking-header">
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>

        <form onSubmit={handleBooking} className="booking-form">
          <div className="form-group">
            <label htmlFor="fullName">{t.fullName}</label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder={t.fullNamePlaceholder}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">{t.email}</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={t.emailPlaceholder}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">{t.phone}</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder={t.phonePlaceholder}
            />
          </div>

          <div className="form-group">
            <label htmlFor="service">{t.service}</label>
            <select
              id="service"
              value={service}
              onChange={(e) => setService(e.target.value)}
              required
            >
              {servicesList.map((srv, i) => (
                <option key={srv} value={srv}>{serviceLabels[i] || srv}</option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">{t.date}</label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="form-group">
              <label htmlFor="time">{t.time}</label>
              <input
                type="time"
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="booking-submit-btn">
            {loading ? t.processing : t.bookNow}
          </button>
        </form>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        message={modalMessage}
        type="error"
      />
    </div>
  );
}