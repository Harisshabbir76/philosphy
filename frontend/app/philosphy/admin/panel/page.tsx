"use client";

import { useEffect, useMemo, useState } from "react";

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

export default function AdminPanelPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
            <Stat label="Paid" value={paidBookings} />
          </div>
        </header>

        {isLoading && <p>Loading bookings...</p>}
        {error && <p style={{ color: "#9f1d1d" }}>{error}</p>}

        {!isLoading && !error && (
          <div style={{ overflowX: "auto", border: "1px solid #eadfd6", background: "#ffffff" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "900px" }}>
              <thead>
                <tr style={{ background: "#350008", color: "#fffdf7", textAlign: "left" }}>
                  {["Client", "Email", "Phone", "Service", "Date", "Time", "Payment"].map((heading) => (
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
                      <td style={{ padding: "14px" }}>{booking.time}</td>
                      <td style={{ padding: "14px", textTransform: "capitalize" }}>{booking.paymentStatus}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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
