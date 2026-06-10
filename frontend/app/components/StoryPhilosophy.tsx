"use client";

import storyWardrobe from "../Images/story-wardrobe.jpg";
import AdminEditableSection, { EditableImage } from "./AdminEditableSection";
import { EditableContent } from "./CMS";
import { usePageComponentContent } from "../lib/pageContent";
import { useLanguage } from "../lib/LanguageContext";
import { translations } from "../lib/translations";
import "../Styles/StoryPhilosophy.css";

const defaults = {
  imageUrl: "",
  title: "THE PHILOSOPHY BEHIND THE WORK",
  text:
    "With over six years of experience, I've learned that true beauty comes from harmony--when colors, shapes, and style align with both features and personality, creating effortless elegance and a radiant presence.",
};

export default function StoryPhilosophy({ editable = false }: { editable?: boolean }) {
  const { content, saveContent, isSaving, error } = usePageComponentContent("our-story", "philosophy", defaults);
  const { language } = useLanguage();
  const t = translations[language].storyPhilosophy;

  return (
    <AdminEditableSection content={content} editable={editable} error={error} isSaving={isSaving} title="Story philosophy" onSave={saveContent}>
      {({ content: editorContent, isEditing, updateContent }) => (
    <section className="story-philosophy">
      <div className="story-philosophy__copy">
        <EditableContent as="h2" plain contentId="our-story.philosophy.title" fallback={String(editorContent.title)} fallbackAr={translations.ar.storyPhilosophy.title} />
        <EditableContent as="p" plain contentId="our-story.philosophy.text" fallback={String(editorContent.text)} fallbackAr={translations.ar.storyPhilosophy.text} />
      </div>
      <div className="story-philosophy__image">
        <EditableImage src={String(editorContent.imageUrl) || storyWardrobe} alt="Stylist selecting garments from a wardrobe" fill sizes="115px" isEditing={isEditing} onChange={(imageUrl) => updateContent({ imageUrl })} />
      </div>
    </section>
      )}
    </AdminEditableSection>
  );
}
