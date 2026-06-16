"use client";

import React from "react";
import Link from "next/link";
import bannerImage from "../Images/Banner.png";
import AdminEditableSection, { EditableImage } from "./AdminEditableSection";
import { EditableContent } from "./CMS";
import { usePageComponentContent } from "../lib/pageContent";
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

  return (
    <AdminEditableSection
      content={content}
      editable={editable}
      error={error}
      isSaving={isSaving}
      title="Home hero"
      onSave={saveContent}
    >
      {({ content: editorContent, isEditing, updateContent }) => (
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
            <EditableContent as="h1" plain defaultClass="hero-heading" contentId="home.hero.title" fallback={String(editorContent.title)} fallbackAr={translations.ar.hero.title} />
            <EditableContent as="h2" plain defaultClass="hero-script" contentId="home.hero.subtitle" fallback={String(editorContent.subtitle)} fallbackAr={translations.ar.hero.subtitle} />
            <EditableContent as="p" plain defaultClass="hero-paragraph" contentId="home.hero.text" fallback={String(editorContent.text)} fallbackAr={translations.ar.hero.text} />
            <Link href="/our-story" className="hero-cta">
              <EditableContent as="span" plain contentId="home.hero.buttonText" fallback={String(editorContent.buttonText)} fallbackAr={translations.ar.hero.buttonText} />
            </Link>
          </div>
        </section>
      )}
    </AdminEditableSection>
  );
};

export default HeroSection;
