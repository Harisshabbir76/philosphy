"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_BASE_URL } from "../lib/api";
import "../Styles/ContactForm.css"; // Reuse styling for simplicity, or we can use global

type Mode = "login" | "forgot-email" | "forgot-otp" | "forgot-reset";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  border: "1px solid #ccc",
};

const buttonStyle: React.CSSProperties = {
  padding: "12px",
  backgroundColor: "#2b170f",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  marginTop: "10px",
};

const linkButtonStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "#2b170f",
  textDecoration: "underline",
  cursor: "pointer",
  padding: 0,
  fontSize: "inherit",
};

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("login");

  // login fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // forgot-password fields
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const goToMode = (next: Mode) => {
    setMode(next);
    setError(null);
    setInfo(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      localStorage.setItem("user", JSON.stringify(data));

      if (data.isAdmin) {
        router.push("/philosphy/admin/panel");
      } else {
        router.push("/");
      }
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 1: send the OTP to the email if an account exists
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to send code");

      setOtp("");
      goToMode("forgot-otp");
      setInfo(`We sent a 6-digit code to ${email}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: verify the OTP and receive a short-lived reset token
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid code");

      setResetToken(data.resetToken);
      setNewPassword("");
      setConfirmPassword("");
      goToMode("forgot-reset");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: set the new password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken, password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to reset password");

      setPassword("");
      setOtp("");
      setResetToken("");
      goToMode("login");
      setInfo("Password updated. Please log in with your new password.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const heading =
    mode === "login"
      ? "Log In"
      : mode === "forgot-email"
        ? "Forgot Password"
        : mode === "forgot-otp"
          ? "Enter Code"
          : "Reset Password";

  return (
    <div className="contact-page-container">
      <div
        style={{
          maxWidth: "500px",
          margin: "100px auto",
          padding: "40px",
          backgroundColor: "#fff",
          border: "1px solid #eadfd6",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            marginBottom: "20px",
            textAlign: "center",
            fontFamily: "Georgia, serif",
          }}
        >
          {heading}
        </h1>

        {error && (
          <div style={{ color: "red", marginBottom: "15px", textAlign: "center" }}>{error}</div>
        )}
        {info && (
          <div style={{ color: "#1f7a3d", marginBottom: "15px", textAlign: "center" }}>{info}</div>
        )}

        {mode === "login" && (
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "5px" }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "5px" }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={inputStyle}
              />
            </div>
            <div style={{ textAlign: "right" }}>
              <button type="button" style={linkButtonStyle} onClick={() => goToMode("forgot-email")}>
                Forgot Password?
              </button>
            </div>
            <button type="submit" disabled={loading} style={buttonStyle}>
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>
        )}

        {mode === "forgot-email" && (
          <form onSubmit={handleSendOtp} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <p style={{ textAlign: "center", color: "#5a4a40", margin: 0 }}>
              Enter your account email and we&apos;ll send you a verification code.
            </p>
            <div>
              <label style={{ display: "block", marginBottom: "5px" }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={inputStyle}
              />
            </div>
            <button type="submit" disabled={loading} style={buttonStyle}>
              {loading ? "Sending..." : "Verify"}
            </button>
            <div style={{ textAlign: "center" }}>
              <button type="button" style={linkButtonStyle} onClick={() => goToMode("login")}>
                Back to Log In
              </button>
            </div>
          </form>
        )}

        {mode === "forgot-otp" && (
          <form onSubmit={handleVerifyOtp} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "5px" }}>6-Digit Code</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                required
                style={{ ...inputStyle, letterSpacing: "8px", textAlign: "center", fontSize: "1.3rem" }}
              />
            </div>
            <button type="submit" disabled={loading} style={buttonStyle}>
              {loading ? "Verifying..." : "Verify Code"}
            </button>
            <div style={{ textAlign: "center" }}>
              <button type="button" style={linkButtonStyle} onClick={() => goToMode("forgot-email")}>
                Resend / change email
              </button>
            </div>
          </form>
        )}

        {mode === "forgot-reset" && (
          <form onSubmit={handleResetPassword} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "5px" }}>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "5px" }}>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={inputStyle}
              />
            </div>
            <button type="submit" disabled={loading} style={buttonStyle}>
              {loading ? "Updating..." : "Change Password"}
            </button>
          </form>
        )}

        {mode === "login" && (
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            Don&apos;t have an account?{" "}
            <Link href="/signup" style={{ textDecoration: "underline" }}>
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
