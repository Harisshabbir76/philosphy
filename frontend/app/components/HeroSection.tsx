"use client";

import React from "react";
import Link from "next/link";
import bannerImage from "../Images/Banner.png";
import AdminEditableSection, { EditableImage, EditableText } from "./AdminEditableSection";
import { usePageComponentContent } from "../lib/pageContent";
import { useLanguage } from "../lib/LanguageContext";
import { translations } from "../lib/translations";
import "../Styles/HeroSection.css";

const defaults = {
  imageUrl: "",
  title: "IT'S NOT JUST WHAT YOU WEAR",
  subtitle: "It's how you match it and how you make it yours.",
  text: "Styled to reflect not just your look, but your identity and expression.",
  buttonText: "LEARN MORE",
};

const HeroSection: React.FC<{ editable?: boolean }> = ({ editable = false }) => {
  const { content, saveContent, isSaving, error } = usePageComponentContent("home", "hero", defaults);
  const { language } = useLanguage();
  const t = translations[language].hero;

  return (
    <AdminEditableSection
      content={content}
      editable={editable}
      error={error}
      isSaving={isSaving}
      title="Home hero"
      onSave={saveContent}
    >
      {({ content: editorContent, isEditing, updateContent }) => {
        const isAr = language === "ar" && !isEditing;
        return (
        <section id="hero" className="hero-section">
          <div className="hero-section__image">
            <EditableImage
              src={String(editorContent.imageUrl) || bannerImage}
              alt=""
              fill
              sizes="100vw"
              priority={true}
              isEditing={isEditing}
              onChange={(imageUrl) => updateContent({ imageUrl })}
            />
          </div>
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <EditableText
              as="h1"
              className="hero-heading"
              isEditing={isEditing}
              value={isAr ? t.title : String(editorContent.title)}
              onChange={(title) => updateContent({ title })}
            />
            <EditableText
              as="h2"
              className="hero-script"
              isEditing={isEditing}
              value={isAr ? t.subtitle : String(editorContent.subtitle)}
              onChange={(subtitle) => updateContent({ subtitle })}
            />
            <EditableText
              as="p"
              className="hero-paragraph"
              isEditing={isEditing}
              value={isAr ? t.text : String(editorContent.text)}
              onChange={(text) => updateContent({ text })}
            />
            <Link href="/our-story" className="hero-cta">
              <EditableText
                isEditing={isEditing}
                value={isAr ? t.buttonText : String(editorContent.buttonText)}
                onChange={(buttonText) => updateContent({ buttonText })}
              />
            </Link>
          </div>
        </section>
        );
      }}
    </AdminEditableSection>
  );
};

export default HeroSection;