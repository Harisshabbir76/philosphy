"use client";

import brownWoman from "../Images/brown-woman.jpeg";
import AdminEditableSection, { EditableImage } from "./AdminEditableSection";
import { EditableContent } from "./CMS";
import { usePageComponentContent } from "../lib/pageContent";
import { useLanguage } from "../lib/LanguageContext";
import { translations } from "../lib/translations";
import "../Styles/StoryFounder.css";

const defaults = {
  imageUrl: "",
  kicker: "MEET THE FOUNDER",
  title: "Where style becomes a story of identity.",
  text:
    "From a young age, I was drawn to history and culture, which led me to traditional Emirati attire and the makhwar.\nTo me, they are more than garments--they embody heritage, art, and identity, and I bring this vision to life through my work and styling.",
};

export default function StoryFounder({ editable = false }: { editable?: boolean }) {
  const { content, saveContent, isSaving, error } = usePageComponentContent("our-story", "founder", defaults);
  const { language } = useLanguage();
  const t = translations[language].storyFounder;

  return (
    <AdminEditableSection content={content} editable={editable} error={error} isSaving={isSaving} title="Story founder" onSave={saveContent}>
      {({ content: editorContent, isEditing, updateContent }) => (
    <section className="story-founder">
      <div className="story-founder__copy">
        <EditableContent as="p" plain defaultClass="story-founder__kicker" contentId="our-story.founder.kicker" fallback={String(editorContent.kicker)} fallbackAr={translations.ar.storyFounder.kicker} />
        <EditableContent as="h2" plain contentId="our-story.founder.title" fallback={String(editorContent.title)} fallbackAr={translations.ar.storyFounder.title} />
        <EditableContent as="p" plain contentId="our-story.founder.text" fallback={String(editorContent.text)} fallbackAr={translations.ar.storyFounder.text} />
      </div>
      <div className="story-founder__image">
        <EditableImage src={String(editorContent.imageUrl) || brownWoman} alt="Founder seated in a brown dress" fill sizes="115px" isEditing={isEditing} onChange={(imageUrl) => updateContent({ imageUrl })} />
      </div>
    </section>
      )}
    </AdminEditableSection>
  );
}
