"use client";

import AdminEditableSection, { EditableText } from "./AdminEditableSection";
import { EditableImage } from "./AdminEditableSection";
import { usePageComponentContent } from "../lib/pageContent";
import analysisHero from "../Images/Analysis-hero.png";
import "../Styles/AnalysisHero.css";

const defaults = {
  imageUrl: "",
  title: "ANALYSIS",
};

export default function AnalysisHero({ editable = false }: { editable?: boolean }) {
  const { content, saveContent, isSaving, error } = usePageComponentContent("analysis", "hero", defaults);

  return (
    <AdminEditableSection
      content={content}
      editable={editable}
      error={error}
      isSaving={isSaving}
      title="Analysis hero"
      onSave={saveContent}
    >
      {({ content: editorContent, isEditing, updateContent }) => (
      <section className="analysis-hero" aria-label="Analysis">
        <EditableImage
          src={String(editorContent.imageUrl) || analysisHero}
          alt=""
          fill
          sizes="100vw"
          priority={true}
          isEditing={isEditing}
          onChange={(imageUrl) => updateContent({ imageUrl })}
        />
        <div className="analysis-hero__shade" />
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
