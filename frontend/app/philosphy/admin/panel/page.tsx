"use client";

import { useEffect, useMemo, useState } from "react";
import { FaEye, FaWhatsapp, FaTimes, FaTrash } from "react-icons/fa";

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

export default function AdminPanelPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Booking | null>(null);

  const handleDelete = async (booking: Booking) => {
    setDeletingId(booking._id);
    try {
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? (JSON.parse(storedUser) as StoredUser) : null;

      const response = await fetch(`http://localhost:5000/api/booking/${booking._id}`, {
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

        const response = await fetch("http://localhost:5000/api/booking/admin", {
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
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Stat label="Total" value={bookings.length} />
          </div>
        </header>

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
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: "28px", textAlign: "center" }}>
                      No bookings yet.
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
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

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ minWidth: "112px", border: "1px solid #eadfd6", background: "#ffffff", padding: "14px 18px" }}>
      <p style={{ fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase" }}>{label}</p>
      <p style={{ marginTop: "6px", fontSize: "1.7rem", fontWeight: 600 }}>{value}</p>
    </div>
  );
}
