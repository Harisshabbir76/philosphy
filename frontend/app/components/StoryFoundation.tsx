"use client";

import storyRoom from "../Images/story-room.png";
import AdminEditableSection, { EditableImage } from "./AdminEditableSection";
import { EditableContent } from "./CMS";
import { usePageComponentContent } from "../lib/pageContent";
import { useLanguage } from "../lib/LanguageContext";
import { translations } from "../lib/translations";
import "../Styles/StoryFoundation.css";

const defaults = {
  imageUrl: "",
  kicker: "WHERE IT ALL STARTED",
  title: "A Thoughtful Foundation",
  text:
    "I graduated from United Arab Emirates University, where I studied molecular and cellular biology alongside communication and leadership. This taught me that every detail matters, that careful observation brings understanding, and that a methodical approach can turn insight into art.",
  text2:
    "I began exploring beauty as a makeup artist, learning the subtle details that make each woman unique. I later refined my fashion expertise through studies in Dubai and, in 2023, had the honor of writing fashion articles featured on Savoir Avenue, sharing my insights with a wider audience.",
};

export default function StoryFoundation({ editable = false }: { editable?: boolean }) {
  const { content: rawContent, saveContent, isSaving, error } = usePageComponentContent("our-story", "foundation", defaults);
  const { language } = useLanguage();
  const t = translations[language].storyFoundation;

  const content = {
    ...rawContent,
    text: rawContent.text || defaults.text,
    text2: rawContent.text2 || defaults.text2,
  };

  return (
    <AdminEditableSection content={content} editable={editable} error={error} isSaving={isSaving} title="Story foundation" onSave={saveContent}>
      {({ content: editorContent, isEditing, updateContent }) => (
    <section className="story-foundation">
      <div className="story-foundation__copy">
        <EditableContent as="p" plain defaultClass="story-foundation__kicker" contentId="our-story.foundation.kicker" fallback={String(editorContent.kicker)} fallbackAr={translations.ar.storyFoundation.kicker} />
        <EditableContent as="h2" plain contentId="our-story.foundation.title" fallback={String(editorContent.title)} fallbackAr={translations.ar.storyFoundation.title} />
        <EditableContent as="p" plain defaultClass="story-foundation__body" contentId="our-story.foundation.text" fallback={String(editorContent.text)} fallbackAr={translations.ar.storyFoundation.text} />
        <EditableContent as="p" plain defaultClass="story-foundation__body story-foundation__body--second" contentId="our-story.foundation.text2" fallback={String(editorContent.text2)} fallbackAr={translations.ar.storyFoundation.text2} />
      </div>
      <div className="story-foundation__image">
        <EditableImage src={String(editorContent.imageUrl) || storyRoom} alt="Warm styling office interior" fill sizes="100vw" isEditing={isEditing} onChange={(imageUrl) => updateContent({ imageUrl })} />
      </div>
    </section>
      )}
    </AdminEditableSection>
  );
}
