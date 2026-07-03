"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AiOutlineWhatsApp } from "react-icons/ai";

import { API_BASE_URL } from "../lib/api";
import { useLanguage } from "../lib/LanguageContext";
import { translations } from "../lib/translations";

import "../Styles/WhatsAppButton.css";

const WhatsAppButton = () => {
  const [businessWhatsappNumber, setBusinessWhatsappNumber] = useState("");
  const { language } = useLanguage();
  const t = translations[language].whatsapp;

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/settings/public`);
        if (!response.ok) return;
        const data = await response.json();
        setBusinessWhatsappNumber(data.businessWhatsappNumber || "");
      } catch {
        setBusinessWhatsappNumber("");
      }
    };
    loadSettings();
  }, []);

  const whatsappHref = useMemo(() => {
    const cleanNumber = businessWhatsappNumber.replace(/[^\d]/g, "");
    return cleanNumber ? `https://wa.me/${cleanNumber}` : "https://wa.me/";
  }, [businessWhatsappNumber]);

  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label={t.chatWithUs}
    >
      <AiOutlineWhatsApp className="whatsapp-float__icon" aria-hidden="true" />
      <span className="whatsapp-float__label">{t.chatWithUs}</span>
    </a>
  );
};

export default WhatsAppButton;
