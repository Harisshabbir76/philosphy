"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "../Styles/ContactForm.css"; 

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      localStorage.setItem("user", JSON.stringify(data));
      
      if (data.isAdmin) {
        router.push("/philosphy/admin/panel");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError("Signup failed. Please try again.");
    }
  };

  return (
    <div className="contact-page-container">
      <div style={{ maxWidth: "500px", margin: "100px auto", padding: "40px", backgroundColor: "#fff", border: "1px solid #eadfd6" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "20px", textAlign: "center", fontFamily: "Georgia, serif" }}>Sign Up</h1>
        {error && <div style={{ color: "red", marginBottom: "15px", textAlign: "center" }}>{error}</div>}
        <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "5px" }}>Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              style={{ width: "100%", padding: "10px", border: "1px solid #ccc" }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%", padding: "10px", border: "1px solid #ccc" }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px" }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", padding: "10px", border: "1px solid #ccc" }}
            />
          </div>
          <button type="submit" style={{ padding: "12px", backgroundColor: "#2b170f", color: "#fff", border: "none", cursor: "pointer", marginTop: "10px" }}>
            Sign Up
          </button>
        </form>
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          Already have an account? <Link href="/login" style={{ textDecoration: "underline" }}>Log In</Link>
        </div>
      </div>
    </div>
  );
}
