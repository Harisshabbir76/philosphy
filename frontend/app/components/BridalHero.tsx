"use client";

import AdminEditableSection from "./AdminEditableSection";
import { EditableImage } from "./AdminEditableSection";
import { EditableContent } from "./CMS";
import { usePageComponentContent } from "../lib/pageContent";
import { useLanguage } from "../lib/LanguageContext";
import { translations } from "../lib/translations";
import bridalHero from "../Images/Bridal-hero.png";
import "../Styles/BridalHero.css";

const defaults = {
  imageUrl: "",
  title: "BRIDAL SERVICES",
};

const defaultsAr = {
  title: "خدمات العرائس",
};

export default function BridalHero({ editable = false }: { editable?: boolean }) {
  const { content, saveContent, isSaving, error } = usePageComponentContent("bridal", "hero", defaults);
  const { language } = useLanguage();
  const t = translations[language].bridalHero;

  return (
    <AdminEditableSection content={content} editable={editable} error={error} isSaving={isSaving} title="Bridal hero" onSave={saveContent}>
      {({ content: editorContent, isEditing, updateContent }) => (
        <section className="bridal-hero" aria-label="Bridal services" style={{ position: "relative" }}>
          <EditableImage src={String(editorContent.imageUrl) || bridalHero} alt="Premium artisanal bridal styling session layout overview" fill priority={true} sizes="100vw" isEditing={isEditing} onChange={(imageUrl) => updateContent({ imageUrl })} className="object-cover" />
          <div className="bridal-hero__shade" />
          <EditableContent as="h1" plain contentId="bridal.hero.title" fallback={defaults.title} fallbackAr={defaultsAr.title} />
        </section>
      )}
    </AdminEditableSection>
  );
}
