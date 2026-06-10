"use client";

import AdminEditableSection from "./AdminEditableSection";
import { EditableImage } from "./AdminEditableSection";
import { EditableContent } from "./CMS";
import { usePageComponentContent } from "../lib/pageContent";
import { useLanguage } from "../lib/LanguageContext";
import { translations } from "../lib/translations";
import analysisHero from "../Images/Analysis-hero.png";
import "../Styles/AnalysisHero.css";

const defaults = {
  imageUrl: "",
  title: "ANALYSIS",
};

export default function AnalysisHero({ editable = false }: { editable?: boolean }) {
  const { content, saveContent, isSaving, error } = usePageComponentContent("analysis", "hero", defaults);
  const { language } = useLanguage();
  const t = translations[language].analysisHero;

  return (
    <AdminEditableSection content={content} editable={editable} error={error} isSaving={isSaving} title="Analysis hero" onSave={saveContent}>
      {({ content: editorContent, isEditing, updateContent }) => (
      <section className="analysis-hero" aria-label="Analysis">
        <EditableImage src={String(editorContent.imageUrl) || analysisHero} alt="" fill sizes="100vw" priority={true} isEditing={isEditing} onChange={(imageUrl) => updateContent({ imageUrl })} />
        <div className="analysis-hero__shade" />
        <EditableContent as="h1" plain contentId="analysis.hero.title" fallback={defaults.title} fallbackAr="التحليل" />
      </section>
      )}
    </AdminEditableSection>
  );
}
