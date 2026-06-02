"use client";

import storyRoom from "../Images/story-room.png";
import AdminEditableSection, { EditableImage, EditableText } from "./AdminEditableSection";
import { usePageComponentContent } from "../lib/pageContent";
import "../Styles/StoryFoundation.css";

const defaults = {
  imageUrl: "",
  kicker: "WHERE IT ALL STARTED",
  title: "A Thoughtful Foundation",
  text:
    "I graduated from United Arab Emirates University, where I studied molecular and cellular biology alongside communication and leadership.\nThis taught me that every detail matters, that careful observation brings understanding, and that a methodical approach can turn insight into art.\n\nI began exploring beauty as a makeup artist, learning the subtle details that make each woman unique. I later refined my fashion expertise through studies in Dubai and, in 2023, had the honor of writing fashion articles featured on Savoir Avenue, sharing my insights with a wider audience.",
};

export default function StoryFoundation({ editable = false }: { editable?: boolean }) {
  const { content, saveContent, isSaving, error } = usePageComponentContent("our-story", "foundation", defaults);

  return (
    <AdminEditableSection
      content={content}
      editable={editable}
      error={error}
      isSaving={isSaving}
      title="Story foundation"
      onSave={saveContent}
    >
      {({ content: editorContent, isEditing, updateContent }) => (
    <section className="story-foundation">
      <div className="story-foundation__copy">
        <EditableText as="p" className="story-foundation__kicker" isEditing={isEditing} value={String(editorContent.kicker)} onChange={(kicker) => updateContent({ kicker })} />
        <EditableText as="h2" isEditing={isEditing} value={String(editorContent.title)} onChange={(title) => updateContent({ title })} />
        <EditableText as="p" isEditing={isEditing} value={String(editorContent.text)} onChange={(text) => updateContent({ text })} />
      </div>
      <div className="story-foundation__image">
        <EditableImage
          src={String(editorContent.imageUrl) || storyRoom}
          alt="Warm styling office interior"
          fill
          sizes="100vw"
          isEditing={isEditing}
          onChange={(imageUrl) => updateContent({ imageUrl })}
        />
      </div>
    </section>
      )}
    </AdminEditableSection>
  );
}
