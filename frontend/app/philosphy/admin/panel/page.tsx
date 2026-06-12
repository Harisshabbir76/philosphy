"use client";

import { type CSSProperties, useEffect, useMemo, useState } from "react";
import { FaEye, FaWhatsapp, FaTimes, FaTrash } from "react-icons/fa";
import { API_BASE_URL } from "../../../lib/api";

type QuickFilter = "all" | "today" | "yesterday" | "last3";

type Booking = {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  paymentStatus: string;
  createdAt?: string;
};

type StoredUser = {
  token?: string;
};

const formatDate = (value?: string) => {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
};

const formatTime = (time24: string) => {
  if (!time24) return "";
  const [hourStr, minute] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${ampm}`;
};

/**
 * Local day key ("YYYY-MM-DD") for a booking's `createdAt` timestamp
 * ("2026-06-12T20:00:00.000Z"). All filters compare against the admin's local
 * calendar day, so we read the day in local time too — otherwise a booking made
 * late at night lands on the wrong day.
 */
const toLocalDayKey = (value?: string) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  return `${y}-${mo}-${da}`;
};

/** Today's day key shifted by `offset` days (e.g. -1 = yesterday). */
const dayKeyOffset = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  return `${y}-${mo}-${da}`;
};

export default function AdminPanelPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Booking | null>(null);

  // ── Date filters: all match when a booking was placed (createdAt) ────────────
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("all");
  const [specificDate, setSpecificDate] = useState("");
  const [rangeFrom, setRangeFrom] = useState("");
  const [rangeTo, setRangeTo] = useState("");

  // Selecting one kind of filter clears the others so they never conflict.
  const applyQuick = (q: QuickFilter) => {
    setQuickFilter(q);
    setSpecificDate("");
    setRangeFrom("");
    setRangeTo("");
  };
  const applySpecific = (value: string) => {
    setSpecificDate(value);
    setQuickFilter("all");
    setRangeFrom("");
    setRangeTo("");
  };
  const applyRange = (which: "from" | "to", value: string) => {
    if (which === "from") setRangeFrom(value);
    else setRangeTo(value);
    setQuickFilter("all");
    setSpecificDate("");
  };
  const clearFilters = () => {
    setQuickFilter("all");
    setSpecificDate("");
    setRangeFrom("");
    setRangeTo("");
  };

  const isFiltered =
    quickFilter !== "all" || Boolean(specificDate) || Boolean(rangeFrom) || Boolean(rangeTo);

  const handleDelete = async (booking: Booking) => {
    setDeletingId(booking._id);
    try {
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? (JSON.parse(storedUser) as StoredUser) : null;

      const response = await fetch(`${API_BASE_URL}/api/booking/${booking._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user?.token || ""}` },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Unable to delete booking");
      }

      setBookings((prev) => prev.filter((b) => b._id !== booking._id));
      setSelectedBooking((current) => (current && current._id === booking._id ? null : current));
      setConfirmDelete(null);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Unable to delete booking");
    } finally {
      setDeletingId(null);
    }
  };

  const handleWhatsApp = (booking: Booking) => {
    const message = `Hello ${booking.fullName}, this is a message from Philosophy.\n\nWe are reaching out to confirm your booking for ${booking.service} on ${formatDate(booking.date)} at ${formatTime(booking.time)}.\n\nThank you for choosing us!`;
    let cleanPhone = booking.phone.replace(/[^0-9+]/g, '');
    
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '92' + cleanPhone.substring(1);
    } else if (!cleanPhone.startsWith('+') && !cleanPhone.startsWith('92')) {
      cleanPhone = '92' + cleanPhone;
    }
    cleanPhone = cleanPhone.replace('+', '');

    const url = `https://api.whatsapp.com/send/?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const user = storedUser ? (JSON.parse(storedUser) as StoredUser) : null;

        const response = await fetch(`${API_BASE_URL}/api/booking/admin`, {
          headers: {
            Authorization: `Bearer ${user?.token || ""}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to load bookings");
        }

        setBookings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load bookings");
      } finally {
        setIsLoading(false);
      }
    };

    loadBookings();
  }, []);

  const paidBookings = useMemo(() => {
    return bookings.filter((booking) => booking.paymentStatus === "paid").length;
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    if (!isFiltered) return bookings;
    const hasRange = Boolean(rangeFrom || rangeTo);
    const todayKey = dayKeyOffset(0);
    const yesterdayKey = dayKeyOffset(-1);
    const last3Key = dayKeyOffset(-2); // today + 2 previous days
    return bookings.filter((booking) => {
      // Every filter matches when the booking was placed (createdAt): who booked
      // today / yesterday / in the last 3 days, on a specific day, or within a range.
      const placedKey = toLocalDayKey(booking.createdAt);
      if (!placedKey) return false;
      if (hasRange) {
        if (rangeFrom && placedKey < rangeFrom) return false;
        if (rangeTo && placedKey > rangeTo) return false;
        return true;
      }
      if (specificDate) return placedKey === specificDate;
      if (quickFilter === "today") return placedKey === todayKey;
      if (quickFilter === "yesterday") return placedKey === yesterdayKey;
      if (quickFilter === "last3") return placedKey >= last3Key && placedKey <= todayKey;
      return true;
    });
  }, [bookings, isFiltered, quickFilter, specificDate, rangeFrom, rangeTo]);

  return (
    <main style={{ minHeight: "100vh", background: "#fffdf7", color: "#350008", padding: "32px" }}>
      <section style={{ maxWidth: "1180px", margin: "0 auto" }}>
        <header
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "24px",
            marginBottom: "28px",
          }}
        >
          <div>
            <p style={{ fontSize: "0.78rem", letterSpacing: "0.16em", textTransform: "uppercase" }}>
              Philosophy Admin
            </p>
            <h1 style={{ marginTop: "8px", fontFamily: "Georgia, serif", fontSize: "2.6rem", lineHeight: 1 }}>
              Bookings
            </h1>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Stat label="Total" value={bookings.length} />
            {isFiltered && <Stat label="Showing" value={filteredBookings.length} />}
          </div>
        </header>

        {!isLoading && !error && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-end",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {([
                ["all", "All"],
                ["today", "Today"],
                ["yesterday", "Yesterday"],
                ["last3", "Last 3 days"],
              ] as [QuickFilter, string][]).map(([key, label]) => (
                <button key={key} onClick={() => applyQuick(key)} style={filterBtnStyle(quickFilter === key)}>
                  {label}
                </button>
              ))}
            </div>

            <label style={fieldLabelStyle}>
              On date
              <input type="date" value={specificDate} onChange={(e) => applySpecific(e.target.value)} style={dateInputStyle} />
            </label>

            <label style={fieldLabelStyle}>
              From
              <input type="date" value={rangeFrom} max={rangeTo || undefined} onChange={(e) => applyRange("from", e.target.value)} style={dateInputStyle} />
            </label>
            <label style={fieldLabelStyle}>
              To
              <input type="date" value={rangeTo} min={rangeFrom || undefined} onChange={(e) => applyRange("to", e.target.value)} style={dateInputStyle} />
            </label>

            {isFiltered && (
              <button onClick={clearFilters} style={{ ...filterBtnStyle(false), borderColor: "#9f1d1d", color: "#9f1d1d" }}>
                Clear
              </button>
            )}
          </div>
        )}

        {isLoading && <p>Loading bookings...</p>}
        {error && <p style={{ color: "#9f1d1d" }}>{error}</p>}

        {!isLoading && !error && (
          <div style={{ overflowX: "auto", border: "1px solid #eadfd6", background: "#ffffff" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "900px" }}>
              <thead>
                <tr style={{ background: "#350008", color: "#fffdf7", textAlign: "left" }}>
                  {["Client", "Email", "Phone", "Service", "Date", "Time", "Actions"].map((heading) => (
                    <th key={heading} style={{ padding: "14px", fontSize: "0.78rem", letterSpacing: "0.08em" }}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: "28px", textAlign: "center" }}>
                      {isFiltered ? "No bookings for the selected dates." : "No bookings yet."}
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr key={booking._id} style={{ borderTop: "1px solid #eadfd6" }}>
                      <td style={{ padding: "14px" }}>{booking.fullName}</td>
                      <td style={{ padding: "14px" }}>{booking.email}</td>
                      <td style={{ padding: "14px" }}>{booking.phone}</td>
                      <td style={{ padding: "14px" }}>{booking.service}</td>
                      <td style={{ padding: "14px" }}>{formatDate(booking.date)}</td>
                      <td style={{ padding: "14px" }}>{formatTime(booking.time)}</td>
                      <td style={{ padding: "14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                          <button onClick={() => setSelectedBooking(booking)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#350008" }} title="View Details">
                            <FaEye size={20} />
                          </button>
                          <button
                            onClick={() => setConfirmDelete(booking)}
                            disabled={deletingId === booking._id}
                            style={{ background: "transparent", border: "none", cursor: deletingId === booking._id ? "wait" : "pointer", color: "#9f1d1d", opacity: deletingId === booking._id ? 0.5 : 1 }}
                            title="Delete Booking"
                          >
                            <FaTrash size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {selectedBooking && (
          <div className="admin-modal-overlay">
            <div className="admin-modal-content">
              <button onClick={() => setSelectedBooking(null)} className="admin-modal-close">
                <FaTimes />
              </button>
              
              <p className="admin-modal-subtitle">Reservation Details</p>
              <h2 className="admin-modal-title">{selectedBooking.fullName}</h2>
              
              <div className="admin-modal-details">
                <div className="admin-modal-row">
                  <span className="admin-modal-label">Email</span>
                  <span className="admin-modal-value">{selectedBooking.email}</span>
                </div>
                <div className="admin-modal-row">
                  <span className="admin-modal-label">Phone</span>
                  <span className="admin-modal-value">{selectedBooking.phone}</span>
                </div>
                <div className="admin-modal-row">
                  <span className="admin-modal-label">Service</span>
                  <span className="admin-modal-value">{selectedBooking.service}</span>
                </div>
                <div className="admin-modal-row">
                  <span className="admin-modal-label">Date</span>
                  <span className="admin-modal-value">{formatDate(selectedBooking.date)}</span>
                </div>
                <div className="admin-modal-row">
                  <span className="admin-modal-label">Time</span>
                  <span className="admin-modal-value">{formatTime(selectedBooking.time)}</span>
                </div>
              </div>

              <button onClick={() => handleWhatsApp(selectedBooking)} className="admin-modal-whatsapp-btn">
                <FaWhatsapp size={20} className="admin-modal-whatsapp-icon" />
                Confirm via WhatsApp
              </button>
            </div>
          </div>
        )}

        {confirmDelete && (
          <div className="admin-modal-overlay" onClick={() => deletingId ? null : setConfirmDelete(null)}>
            <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setConfirmDelete(null)} className="admin-modal-close" disabled={!!deletingId}>
                <FaTimes />
              </button>

              <p className="admin-modal-subtitle">Delete Booking</p>
              <h2 className="admin-modal-title">{confirmDelete.fullName}</h2>

              <p style={{ margin: "12px 0 26px", fontSize: "0.9rem", lineHeight: 1.5, color: "#5b4a40" }}>
                Are you sure you want to delete this booking? This action cannot be undone.
              </p>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={() => setConfirmDelete(null)}
                  disabled={!!deletingId}
                  style={{ flex: 1, padding: "12px", background: "transparent", border: "1px solid #350008", color: "#350008", cursor: "pointer", letterSpacing: "1px", textTransform: "uppercase", fontSize: "0.8rem" }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  disabled={!!deletingId}
                  style={{ flex: 1, padding: "12px", background: "#9f1d1d", border: "1px solid #9f1d1d", color: "#ffffff", cursor: deletingId ? "wait" : "pointer", letterSpacing: "1px", textTransform: "uppercase", fontSize: "0.8rem", opacity: deletingId ? 0.7 : 1 }}
                >
                  {deletingId ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

const filterBtnStyle = (active: boolean): CSSProperties => ({
  padding: "9px 16px",
  fontSize: "0.8rem",
  letterSpacing: "0.04em",
  cursor: "pointer",
  border: "1px solid #350008",
  background: active ? "#350008" : "transparent",
  color: active ? "#fffdf7" : "#350008",
  transition: "background 0.15s ease, color 0.15s ease",
});

const fieldLabelStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  fontSize: "0.68rem",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#5b4a40",
};

const dateInputStyle: CSSProperties = {
  padding: "8px 10px",
  border: "1px solid #eadfd6",
  background: "#ffffff",
  color: "#350008",
  fontSize: "0.85rem",
};

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: "12px", border: "1px solid #eadfd6", background: "#ffffff", padding: "12px 18px" }}>
      <p style={{ margin: 0, fontSize: "16px", fontWeight: 500, letterSpacing: "2px", textTransform: "uppercase" }}>{label}</p>
      <p style={{ margin: 0, fontSize: "16px", fontWeight: 500, letterSpacing: "2px", lineHeight: 1 }}>{value}</p>
    </div>
  );
}
