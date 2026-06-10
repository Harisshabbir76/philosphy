"use client";

import AdminEditableSection from "./AdminEditableSection";
import { EditableImage } from "./AdminEditableSection";
import { EditableContent } from "./CMS";
import { usePageComponentContent } from "../lib/pageContent";
import { useLanguage } from "../lib/LanguageContext";
import { translations } from "../lib/translations";
import wardrobeHero from "../Images/wardrobe-hero.png";
import "../Styles/WardrobeHero.css";

const defaults = {
  imageUrl: "",
  title: "WARDROBE",
};

export default function WardrobeHero({ editable = false }: { editable?: boolean }) {
  const { content, saveContent, isSaving, error } = usePageComponentContent("wardrobe", "hero", defaults);
  const { language } = useLanguage();
  const t = translations[language].wardrobeHero;

  return (
    <AdminEditableSection content={content} editable={editable} error={error} isSaving={isSaving} title="Wardrobe hero" onSave={saveContent}>
      {({ content: editorContent, isEditing, updateContent }) => (
      <section className="wardrobe-hero" aria-label="Wardrobe">
        <EditableImage src={String(editorContent.imageUrl) || wardrobeHero} alt="" fill sizes="100vw" priority={true} isEditing={isEditing} onChange={(imageUrl) => updateContent({ imageUrl })} />
        <div className="wardrobe-hero__shade" />
        <EditableContent as="h1" plain contentId="wardrobe.hero.title" fallback={defaults.title} fallbackAr="الخزانة" />
      </section>
      )}
    </AdminEditableSection>
  );
}
