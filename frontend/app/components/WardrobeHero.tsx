"use client";

import AdminEditableSection, { EditableText } from "./AdminEditableSection";
import { EditableImage } from "./AdminEditableSection";
import { usePageComponentContent } from "../lib/pageContent";
import wardrobeHero from "../Images/wardrobe-hero.png";
import "../Styles/WardrobeHero.css";

const defaults = {
  imageUrl: "",
  title: "WARDROBE",
};

export default function WardrobeHero({ editable = false }: { editable?: boolean }) {
  const { content, saveContent, isSaving, error } = usePageComponentContent("wardrobe", "hero", defaults);

  return (
    <AdminEditableSection
      content={content}
      editable={editable}
      error={error}
      isSaving={isSaving}
      title="Wardrobe hero"
      onSave={saveContent}
    >
      {({ content: editorContent, isEditing, updateContent }) => (
      <section className="wardrobe-hero" aria-label="Wardrobe">
        <EditableImage
          src={String(editorContent.imageUrl) || wardrobeHero}
          alt=""
          fill
          sizes="100vw"
          isEditing={isEditing}
          onChange={(imageUrl) => updateContent({ imageUrl })}
        />
        <div className="wardrobe-hero__shade" />
        <EditableText
          as="h1"
          isEditing={isEditing}
          value={String(editorContent.title)}
          onChange={(title) => updateContent({ title })}
        />
      </section>
      )}
    </AdminEditableSection>
  );
}
