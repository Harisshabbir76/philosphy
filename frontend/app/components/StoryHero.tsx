"use client";

import storyHeroImage from "../Images/storyhero.png";
import AdminEditableSection, { EditableImage } from "./AdminEditableSection";
import { EditableContent } from "./CMS";
import { usePageComponentContent } from "../lib/pageContent";
import { useLanguage } from "../lib/LanguageContext";
import { translations } from "../lib/translations";
import "../Styles/StoryHero.css";

const defaults = {
  imageUrl: "",
  title: "OUR STORY",
  subtitle: "Style is more than just an appearance",
};

export default function StoryHero({ editable = false }: { editable?: boolean }) {
  const { content, saveContent, isSaving, error } = usePageComponentContent("our-story", "hero", defaults);
  const { language } = useLanguage();
  const t = translations[language].storyHero;

  return (
    <AdminEditableSection content={content} editable={editable} error={error} isSaving={isSaving} title="Story hero" onSave={saveContent}>
      {({ content: editorContent, isEditing, updateContent }) => (
    <section className="story-hero">
      <div className="story-hero__image">
        <EditableImage src={String(editorContent.imageUrl) || storyHeroImage} alt="" fill sizes="100vw" priority={true} isEditing={isEditing} onChange={(imageUrl) => updateContent({ imageUrl })} />
      </div>
      <div className="story-hero__overlay" />
      <div className="story-hero__content">
        <EditableContent as="h1" plain contentId="our-story.hero.title" fallback={String(editorContent.title)} fallbackAr={translations.ar.storyHero.title} />
        <EditableContent as="p" plain contentId="our-story.hero.subtitle" fallback={String(editorContent.subtitle)} fallbackAr={translations.ar.storyHero.subtitle} />
      </div>
    </section>
      )}
    </AdminEditableSection>
  );
}
