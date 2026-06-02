"use client";

import brownWoman from "../Images/brown-woman.jpeg";
import AdminEditableSection, { EditableImage, EditableText } from "./AdminEditableSection";
import { usePageComponentContent } from "../lib/pageContent";
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

  return (
    <AdminEditableSection
      content={content}
      editable={editable}
      error={error}
      isSaving={isSaving}
      title="Story founder"
      onSave={saveContent}
    >
      {({ content: editorContent, isEditing, updateContent }) => (
    <section className="story-founder">
      <div className="story-founder__copy">
        <EditableText as="p" className="story-founder__kicker" isEditing={isEditing} value={String(editorContent.kicker)} onChange={(kicker) => updateContent({ kicker })} />
        <EditableText as="h2" isEditing={isEditing} value={String(editorContent.title)} onChange={(title) => updateContent({ title })} />
        <EditableText as="p" isEditing={isEditing} value={String(editorContent.text)} onChange={(text) => updateContent({ text })} />
      </div>
      <div className="story-founder__image">
        <EditableImage
          src={String(editorContent.imageUrl) || brownWoman}
          alt="Founder seated in a brown dress"
          fill
          sizes="115px"
          isEditing={isEditing}
          onChange={(imageUrl) => updateContent({ imageUrl })}
        />
      </div>
    </section>
      )}
    </AdminEditableSection>
  );
}
