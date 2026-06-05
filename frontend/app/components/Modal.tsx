"use client";

import React from "react";
import { FaTimes } from "react-icons/fa";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: "success" | "error";
}

export default function Modal({ isOpen, onClose, title, message, type }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #eadfd6",
          borderRadius: "4px",
          width: "100%",
          maxWidth: "450px",
          padding: "36px 32px 32px 32px",
          position: "relative",
          boxShadow: "0 10px 30px rgba(43, 23, 15, 0.1)",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#8c7a6b",
            fontSize: "18px",
            padding: "4px",
            transition: "color 0.2s ease",
          }}
          aria-label="Close modal"
        >
          <FaTimes />
        </button>

        <div style={{ marginBottom: "24px" }}>
          {type === "success" ? (
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                backgroundColor: "#fffdf7",
                border: "1px solid #eadfd6",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#b8975a",
                fontSize: "24px",
                fontWeight: "300",
              }}
            >
              ✓
            </div>
          ) : (
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                backgroundColor: "#fffdf7",
                border: "1px solid #eadfd6",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#350008",
                fontSize: "24px",
                fontWeight: "300",
              }}
            >
              ✕
            </div>
          )}
        </div>

        <h2
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "24px",
            color: "#350008",
            marginBottom: "12px",
            fontWeight: "normal",
            lineHeight: "1.2",
          }}
        >
          {title}
        </h2>
        
        <p
          style={{
            fontFamily: "var(--font-sf-pro), sans-serif",
            fontSize: "14px",
            color: "#666666",
            lineHeight: "1.6",
            marginBottom: "28px",
          }}
        >
          {message}
        </p>

        <button
          onClick={onClose}
          style={{
            width: "100%",
            padding: "14px",
            backgroundColor: "#2b170f",
            color: "#ffffff",
            border: "none",
            borderRadius: "4px",
            fontFamily: "var(--font-sf-pro), sans-serif",
            fontSize: "12px",
            fontWeight: "500",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#1f120c";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#2b170f";
          }}
        >
          Okay
        </button>
      </div>
    </div>
  );
}
