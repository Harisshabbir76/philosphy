"use client";

import storyHeroImage from "../Images/storyhero.png";
import AdminEditableSection, { EditableImage, EditableText } from "./AdminEditableSection";
import { usePageComponentContent } from "../lib/pageContent";
import "../Styles/StoryHero.css";

const defaults = {
  imageUrl: "",
  title: "OUR STORY",
  subtitle: "Style is more than just an appearance",
};

export default function StoryHero({ editable = false }: { editable?: boolean }) {
  const { content, saveContent, isSaving, error } = usePageComponentContent("our-story", "hero", defaults);

  return (
    <AdminEditableSection
      content={content}
      editable={editable}
      error={error}
      isSaving={isSaving}
      title="Story hero"
      onSave={saveContent}
    >
      {({ content: editorContent, isEditing, updateContent }) => (
    <section className="story-hero">
      <div className="story-hero__image">
        <EditableImage
          src={String(editorContent.imageUrl) || storyHeroImage}
          alt=""
          fill
          sizes="100vw"
          priority={true}
          isEditing={isEditing}
          onChange={(imageUrl) => updateContent({ imageUrl })}
        />
      </div>
      <div className="story-hero__overlay" />
      <div className="story-hero__content">
        <EditableText as="h1" isEditing={isEditing} value={String(editorContent.title)} onChange={(title) => updateContent({ title })} />
        <EditableText as="p" isEditing={isEditing} value={String(editorContent.subtitle)} onChange={(subtitle) => updateContent({ subtitle })} />
      </div>
    </section>
      )}
    </AdminEditableSection>
  );
}
