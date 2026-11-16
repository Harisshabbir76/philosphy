"use client";

import { useEffect, useMemo, useState } from "react";
import "../Styles/BookingPage.css";
import { API_BASE_URL } from "../lib/api";
import Modal from "../components/Modal";
import { useLanguage } from "../lib/LanguageContext";
import { translations } from "../lib/translations";

// Generate 30-minute slots from 05:30 to 18:00
const TIME_SLOTS = (() => {
  const slots: { value: string; label: string }[] = [];
  for (let totalMin = 5 * 60 + 30; totalMin <= 18 * 60; totalMin += 30) {
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    const value = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    const label = `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
    slots.push({ value, label });
  }
  return slots;
})();

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
  date: string;
  fullDay: boolean;
  startTime: string;
  endTime: string;
};

type ServiceBlock = {
  _id: string;
  date: string;
  services: string[];
  fullDay: boolean;
  startTime: string;
  endTime: string;
};

const servicesList = [
  "Color Analysis",
  "Body and Face Analysis",
  "Personal Image Analysis (Combined Services)",
  "Closet Edit Abu Dhabi",
  "Closet Edit UAE & Other Cities",
  "Coordinating Outfits and Looks from Your Wardrobe Abu Dhabi",
  "Coordinating Outfits and Looks from Your Wardrobe UAE & Other Cities",
  "Personal Shopping (In-Person) Abu Dhabi / Al Ain",
  "Personal Shopping (In-Person) Dubai / Sharjah",
  "Style & Shop Experience (Basic Package)",
  "Style & Shop Experience (4 Sessions)",
  "Style & Shop Experience (6 Sessions)",
  "I Shop 4 U – Remote Personal Shopping 1–2 Looks",
  "I Shop 4 U – Remote Personal Shopping 3–5 Looks",
  "I Shop 4 U – Remote Personal Shopping 6–10 Looks",
  "Bridal Styling Education Experience",
  "The Complete Bridal Wedding Look",
  "Bridal Dowry Styling Experience – Zhab",
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
  const [offDays, setOffDays] = useState<OffDay[]>([]);
  const [serviceBlocks, setServiceBlocks] = useState<ServiceBlock[]>([]);

  useEffect(() => {
    const loadAvailability = async () => {
      try {
        const [offRes, svcRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/off-days/public`),
          fetch(`${API_BASE_URL}/api/service-blocks/public`),
        ]);
        if (offRes.ok) {
          const data = await offRes.json();
          if (Array.isArray(data)) setOffDays(data);
        }
        if (svcRes.ok) {
          const data = await svcRes.json();
          if (Array.isArray(data)) setServiceBlocks(data);
        }
      } catch {
        // Non-critical: the form still works without availability data.
      }
    };
    loadAvailability();
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

  // Returns a localized message if the chosen date/time/service is unavailable, else null.
  const getUnavailableMessage = () => {
    if (!date) return null;

    // 1. Full off-day (all services blocked)
    const off = offDays.find((d) => d.date === date);
    if (off) {
      const dateLabel = formatOffDayDate(off.date);
      if (off.fullDay) {
        return (t.unavailableFullDay || "We are closed on {date}.").replace("{date}", dateLabel);
      }
      if (time) {
        const reqStart = timeToMinutes(time);
        const reqEnd = timeToMinutes(time);
        const offStart = timeToMinutes(off.startTime);
        const offEnd = timeToMinutes(off.endTime);
        if (reqStart < offEnd && offStart < reqEnd) {
          return (t.unavailableTime || "We are unavailable on {date} from {start} to {end}.")
            .replace("{date}", dateLabel)
            .replace("{start}", formatTime(off.startTime))
            .replace("{end}", formatTime(off.endTime));
        }
      }
    }

    // 2. Service-specific blocks
    for (const block of serviceBlocks) {
      if (block.date === date && block.services.includes(service)) {
        const dateLabel = formatOffDayDate(block.date);
        if (block.fullDay) {
          return `"${service}" is not available on ${dateLabel}. Please select a different date or service.`;
        }
        if (time) {
          const reqMin = timeToMinutes(time);
          const blockStart = timeToMinutes(block.startTime);
          const blockEnd = timeToMinutes(block.endTime);
          if (reqMin < blockEnd && blockStart < reqMin) {
            return `"${service}" is not available from ${formatTime(block.startTime)} to ${formatTime(block.endTime)} on ${dateLabel}. Please select a different time or service.`;
          }
        }
      }
    }

    return null;
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    // Block admin-defined off days.
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
        body: JSON.stringify({ fullName, email, phone, service, date, startTime: time, endTime: time }),
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
        if (data.code === "SERVICE_BLOCKED_DAY" || data.code === "SERVICE_BLOCKED_TIME") {
          const dateLabel = date ? formatOffDayDate(date) : "";
          const msg = data.code === "SERVICE_BLOCKED_TIME"
            ? `"${data.service}" is not available on ${dateLabel} from ${formatTime(data.offStart)} to ${formatTime(data.offEnd)}.`
            : `"${data.service}" is not available on ${dateLabel}.`;
          setModalTitle(t.unavailableTitle || "Service Unavailable");
          setModalMessage(msg);
          setModalOpen(true);
          setLoading(false);
          return;
        }
        if (data.code === "DAY_BOOKED" || data.code === "OVERLAP") {
          const dateLabel = date ? formatOffDayDate(date) : "";
          setModalTitle((t as any).dayBookedTitle || "Date Unavailable");
          setModalMessage(
            ((t as any).dayBookedMessage || "We are unavailable on {date}. This date is already fully booked. Please choose another date.")
              .replace("{date}", dateLabel)
          );
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
              <span className="booking-detail-value">{bookingDetails?.date ? new Intl.DateTimeFormat("en", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(bookingDetails.date)) : date}</span>
            </div>
            <div className="booking-detail-row">
              <span className="booking-detail-label">{t.time}</span>
              <span className="booking-detail-value">
                {formatTime(bookingDetails?.startTime || bookingDetails?.time || time)}
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
            {date && getUnavailableMessage() && (
              <p style={{ color: "#c0392b", fontSize: "0.85rem", marginTop: "6px" }}>
                {getUnavailableMessage()}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="time">{t.time || "Time"}</label>
            <select
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            >
              <option value="" disabled>{t.startTimePlaceholder || "Select time"}</option>
              {TIME_SLOTS.map((slot) => (
                <option key={slot.value} value={slot.value}>{slot.label}</option>
              ))}
            </select>
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