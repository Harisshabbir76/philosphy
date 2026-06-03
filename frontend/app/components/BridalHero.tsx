"use client";

import AdminEditableSection, { EditableText } from "./AdminEditableSection";
import { EditableImage } from "./AdminEditableSection";
import { usePageComponentContent } from "../lib/pageContent";
import bridalHero from "../Images/Bridal-hero.png";
import "../Styles/BridalHero.css";

const defaults = {
  imageUrl: "",
  title: "BRIDAL SERVICES",
};

export default function BridalHero({ editable = false }: { editable?: boolean }) {
  const { content, saveContent, isSaving, error } = usePageComponentContent("bridal", "hero", defaults);

  return (
    <AdminEditableSection
      content={content}
      editable={editable}
      error={error}
      isSaving={isSaving}
      title="Bridal hero"
      onSave={saveContent}
    >
      {({ content: editorContent, isEditing, updateContent }) => (
        <section className="bridal-hero" aria-label="Bridal services" style={{ position: "relative" }}>
          <EditableImage
            src={String(editorContent.imageUrl) || bridalHero}
            alt="Premium artisanal bridal styling session layout overview"
            fill
            priority={true} // ✨ Now works perfectly because the underlying component accepts it!
            sizes="100vw"
            isEditing={isEditing}
            onChange={(imageUrl) => updateContent({ imageUrl })}
            className="object-cover"
          />
          <div className="bridal-hero__shade" />
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