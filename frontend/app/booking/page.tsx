"use client";

import { useState } from "react";
import "../Styles/BookingPage.css";
import { API_BASE_URL } from "../lib/api";
import Modal from "../components/Modal";

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
      setModalTitle("Booking Failed");
      setModalMessage("Booking failed. Please try again later.");
      setModalOpen(true);
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="booking-success-wrapper">
        <div className="booking-success-card">
          <h1 className="booking-success-title">Thank You</h1>
          <p className="booking-success-subtitle">Booking Confirmed</p>
          <div className="booking-success-details">
            <div className="booking-detail-row">
              <span className="booking-detail-label">Client</span>
              <span className="booking-detail-value">{bookingDetails?.fullName || fullName}</span>
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
              <span className="booking-detail-value">{bookingDetails?.service || service}</span>
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
    <div className="booking-page">
      <div className="booking-container">
        <div className="booking-header">
          <h1>Book an Appointment</h1>
          <p>Select a service, date, and time.</p>
        </div>
        
        <form onSubmit={handleBooking} className="booking-form">
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="+1234567890"
            />
          </div>

          <div className="form-group">
            <label htmlFor="service">Service</label>
            <select
              id="service"
              value={service}
              onChange={(e) => setService(e.target.value)}
              required
            >
              {servicesList.map((srv) => (
                <option key={srv} value={srv}>{srv}</option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Date</label>
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
              <label htmlFor="time">Time</label>
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
            {loading ? "Processing..." : "Book Now"}
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