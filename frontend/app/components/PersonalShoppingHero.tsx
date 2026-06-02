"use client";

import AdminEditableSection, { EditableText } from "./AdminEditableSection";
import { EditableImage } from "./AdminEditableSection";
import { usePageComponentContent } from "../lib/pageContent";
import personalShoppingHero from "../Images/ps-hero.png";
import "../Styles/PersonalShoppingHero.css";

const defaults = {
  imageUrl: "",
  title: "PERSONAL SHOPPING SERVICES",
};

export default function PersonalShoppingHero({ editable = false }: { editable?: boolean }) {
  const { content, saveContent, isSaving, error } = usePageComponentContent("personal-shopping", "hero", defaults);

  return (
    <AdminEditableSection
      content={content}
      editable={editable}
      error={error}
      isSaving={isSaving}
      title="Personal shopping hero"
      onSave={saveContent}
    >
      {({ content: editorContent, isEditing, updateContent }) => (
      <section className="personal-shopping-hero" aria-label="Personal shopping services">
        <EditableImage
          src={String(editorContent.imageUrl) || personalShoppingHero}
          alt=""
          fill
          sizes="100vw"
          isEditing={isEditing}
          onChange={(imageUrl) => updateContent({ imageUrl })}
        />
        <div className="personal-shopping-hero__shade" />
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
