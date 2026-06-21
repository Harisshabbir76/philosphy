"use client";

import { useEffect, useMemo, useState } from "react";
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

const timeToMinutes = (time24: string) => {
  if (!time24) return 0;
  const [h, m] = time24.split(":").map(Number);
  return h * 60 + (m || 0);
};

type OffDay = {
  _id: string;
  date: string; // "YYYY-MM-DD"
  fullDay: boolean;
  startTime: string; // "HH:MM" 24h ("" when full day)
  endTime: string;
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
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [offDays, setOffDays] = useState<OffDay[]>([]);

  // Load the admin-defined off days so we can show them and block bookings.
  useEffect(() => {
    const loadOffDays = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/off-days/public`);
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data)) setOffDays(data);
      } catch {
        // Non-critical: the form still works without the off-days panel.
      }
    };
    loadOffDays();
  }, []);

  const locale = language === "ar" ? "ar" : "en";

  // Off days for the month of the currently selected date, ordered by date.
  const monthOffDays = useMemo(() => {
    if (!date) return [];
    const monthPrefix = date.slice(0, 7); // "YYYY-MM"
    return offDays
      .filter((d) => d.date.startsWith(monthPrefix))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [offDays, date]);

  const formatOffDayDate = (key: string) => {
    const [y, m, d] = key.split("-").map(Number);
    return new Intl.DateTimeFormat(locale, {
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(new Date(y, m - 1, d));
  };

  // Returns a localized message if the chosen date/time is unavailable, else null.
  const getUnavailableMessage = () => {
    const off = offDays.find((d) => d.date === date);
    if (!off) return null;
    const dateLabel = formatOffDayDate(off.date);
    if (off.fullDay) {
      return (t.unavailableFullDay || "We are closed on {date}.").replace("{date}", dateLabel);
    }
    // Time-window off day: block when the requested slot overlaps the closed window.
    if (startTime && endTime) {
      const reqStart = timeToMinutes(startTime);
      const reqEnd = timeToMinutes(endTime);
      const offStart = timeToMinutes(off.startTime);
      const offEnd = timeToMinutes(off.endTime);
      if (reqStart < offEnd && offStart < reqEnd) {
        return (t.unavailableTime || "We are unavailable on {date} from {start} to {end}.")
          .replace("{date}", dateLabel)
          .replace("{start}", formatTime(off.startTime))
          .replace("{end}", formatTime(off.endTime));
      }
    }
    return null;
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    // Block off days before sending anything to the server.
    const unavailableMsg = getUnavailableMessage();
    if (unavailableMsg) {
      setModalTitle(t.unavailableTitle || "Date Unavailable");
      setModalMessage(unavailableMsg);
      setModalOpen(true);
      return;
    }

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
        body: JSON.stringify({ fullName, email, phone, service, date, startTime, endTime }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        if (data.code === "OFF_DAY" || data.code === "OFF_DAY_TIME") {
          const dateLabel = date ? formatOffDayDate(date) : "";
          const msg = data.code === "OFF_DAY_TIME"
            ? (t.unavailableTime || "We are unavailable on {date} from {start} to {end}.")
                .replace("{date}", dateLabel)
                .replace("{start}", formatTime(data.offStart))
                .replace("{end}", formatTime(data.offEnd))
            : (t.unavailableFullDay || "We are closed on {date}.").replace("{date}", dateLabel);
          setModalTitle(t.unavailableTitle || "Date Unavailable");
          setModalMessage(msg);
          setModalOpen(true);
          setLoading(false);
          return;
        }
        if (data.code === "OVERLAP") {
          const formattedStart = formatTime(data.existingStart);
          const formattedEnd = formatTime(data.existingEnd);
          const localizedMsg = t.overlapMessage
            ? t.overlapMessage.replace("{start}", formattedStart).replace("{end}", formattedEnd)
            : `This time slot overlaps with an existing booking from ${formattedStart} to ${formattedEnd}.`;
          setModalTitle(t.overlapTitle || "Time Slot Already Booked");
          setModalMessage(localizedMsg);
          setModalOpen(true);
          setLoading(false);
          return;
        }
        throw new Error(data.error || "Failed to create booking");
      }

      setBookingDetails(data);
      setIsSuccess(true);
      setLoading(false);
    } catch (err: any) {
      if (err.message && err.message !== "Failed to create booking") {
        setModalTitle(t.failTitle);
        setModalMessage(err.message);
      } else {
        setModalTitle(t.failTitle);
        setModalMessage(t.failMessage);
      }
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
              <span className="booking-detail-value">
                {bookingDetails?.startTime && bookingDetails?.endTime
                  ? `${formatTime(bookingDetails.startTime)} - ${formatTime(bookingDetails.endTime)}`
                  : formatTime(bookingDetails?.time || startTime)}
              </span>
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
      <div className="booking-layout">
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

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startTime">{t.startTime || "Start Time"}</label>
              <input
                type="time"
                id="startTime"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="endTime">{t.endTime || "End Time"}</label>
              <input
                type="time"
                id="endTime"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="booking-submit-btn">
            {loading ? t.processing : t.bookNow}
          </button>
        </form>
      </div>

      {date && (
        <aside className="booking-offdays">
          <div className="booking-offdays-header">
            <h2>{t.offDaysTitle}</h2>
            <p>{t.offDaysHint}</p>
          </div>

          {monthOffDays.length === 0 ? (
            <div className="booking-offdays-empty">{t.offDaysEmpty}</div>
          ) : (
            <ul className="booking-offdays-list">
              {monthOffDays.map((d) => (
                <li key={d._id} className="booking-offday">
                  <span className="booking-offday-date">{formatOffDayDate(d.date)}</span>
                  <span className="booking-offday-time">
                    {d.fullDay
                      ? t.offDayAllDay
                      : `${t.offDayClosed} ${formatTime(d.startTime)} – ${formatTime(d.endTime)}`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </aside>
      )}
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