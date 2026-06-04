"use client";

import { useState } from "react";
import "../contact-us/contact-us.css"; // Reuse styling for simplicity
import { API_BASE_URL } from "../lib/api";




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
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState(servicesList[0]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Get the logged in user token if any (optional for booking if guest allowed)
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
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create booking";
      setError(message);
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="contact-page-container booking-success-wrapper">
        <div className="booking-success-card">
          <h1 className="booking-success-title">Thank You</h1>
          <p className="booking-success-subtitle">Booking Confirmed</p>
          <div className="booking-success-details">
            <div className="booking-detail-row">
              <span className="booking-detail-label">Client</span>
              <span className="booking-detail-value">{bookingDetails?.fullName}</span>
            </div>
            <div className="booking-detail-row">
              <span className="booking-detail-label">Email</span>
              <span className="booking-detail-value">{bookingDetails?.email || email}</span>
            </div>
            <div className="booking-detail-row">
              <span className="booking-detail-label">Phone</span>
              <span className="booking-detail-value">{bookingDetails?.phone || phone}</span>
            </div>
            <div className="booking-detail-row">
              <span className="booking-detail-label">Service</span>
              <span className="booking-detail-value">{bookingDetails?.service}</span>
            </div>
            <div className="booking-detail-row">
              <span className="booking-detail-label">Date</span>
              <span className="booking-detail-value">{bookingDetails?.date ? new Date(bookingDetails.date).toLocaleDateString() : date}</span>
            </div>
            <div className="booking-detail-row">
              <span className="booking-detail-label">Time</span>
              <span className="booking-detail-value">{formatTime(bookingDetails?.time || time)}</span>
            </div>
          </div>
          <button onClick={() => window.location.href = "/"} className="booking-success-btn">
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-page-container">
      <div style={{ maxWidth: "600px", margin: "100px auto", padding: "40px", backgroundColor: "#fff", border: "1px solid #eadfd6" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "10px", textAlign: "center", fontFamily: "Georgia, serif" }}>Book an Appointment</h1>
        <p style={{ textAlign: "center", marginBottom: "30px", fontSize: "14px", color: "#666" }}>
          Select a service, date, and time.
        </p>

        {error && <div style={{ color: "red", marginBottom: "15px", textAlign: "center" }}>{error}</div>}
        
        <form onSubmit={handleBooking} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "5px" }}>Full Name</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required style={{ width: "100%", padding: "10px", border: "1px solid #ccc" }} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px" }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: "100%", padding: "10px", border: "1px solid #ccc" }} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px" }}>Phone Number</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required style={{ width: "100%", padding: "10px", border: "1px solid #ccc" }} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px" }}>Service</label>
            <select value={service} onChange={(e) => setService(e.target.value)} required style={{ width: "100%", padding: "10px", border: "1px solid #ccc", background: "#fff" }}>
              {servicesList.map((srv) => (
                <option key={srv} value={srv}>{srv}</option>
              ))}
            </select>
          </div>
          <div style={{ display: "flex", gap: "15px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required min={new Date().toISOString().split('T')[0]} style={{ width: "100%", padding: "10px", border: "1px solid #ccc" }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Time</label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required style={{ width: "100%", padding: "10px", border: "1px solid #ccc" }} />
            </div>
          </div>
          <button type="submit" disabled={loading} style={{ padding: "14px", backgroundColor: "#2b170f", color: "#fff", border: "none", cursor: loading ? "not-allowed" : "pointer", marginTop: "10px", fontSize: "16px" }}>
            {loading ? "Processing..." : "Book Now"}
          </button>
        </form>
      </div>
    </div>
  );
}
