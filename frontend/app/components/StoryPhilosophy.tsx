"use client";

import storyWardrobe from "../Images/story-wardrobe.jpg";
import AdminEditableSection, { EditableImage, EditableText } from "./AdminEditableSection";
import { usePageComponentContent } from "../lib/pageContent";
import "../Styles/StoryPhilosophy.css";

const defaults = {
  imageUrl: "",
  title: "THE PHILOSOPHY BEHIND THE WORK",
  text:
    "With over six years of experience, I've learned that true beauty comes from harmony--when colors, shapes, and style align with both features and personality, creating effortless elegance and a radiant presence.",
};

export default function StoryPhilosophy({ editable = false }: { editable?: boolean }) {
  const { content, saveContent, isSaving, error } = usePageComponentContent("our-story", "philosophy", defaults);

  return (
    <AdminEditableSection
      content={content}
      editable={editable}
      error={error}
      isSaving={isSaving}
      title="Story philosophy"
      onSave={saveContent}
    >
      {({ content: editorContent, isEditing, updateContent }) => (
    <section className="story-philosophy">
      <div className="story-philosophy__copy">
        <EditableText as="h2" isEditing={isEditing} value={String(editorContent.title)} onChange={(title) => updateContent({ title })} />
        <EditableText as="p" isEditing={isEditing} value={String(editorContent.text)} onChange={(text) => updateContent({ text })} />
      </div>
      <div className="story-philosophy__image">
        <EditableImage
          src={String(editorContent.imageUrl) || storyWardrobe}
          alt="Stylist selecting garments from a wardrobe"
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
