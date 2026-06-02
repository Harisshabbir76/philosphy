"use client";

import AdminEditableSection, { EditableText } from "./AdminEditableSection";
import { usePageComponentContent } from "../lib/pageContent";
import "../Styles/StyleMarquee.css";

const words = [
  "Timeless",
  "Refined",
  "Intentional",
  "Elegant",
  "Minimal",
  "Sophisticated",
  "Elevated",
  "Curated",
  "Thoughtful",
  "Effortless",
  "Balanced",
  "Polished",
  "Classic",
  "Modern",
  "Understated",
  "Graceful",
  "Harmonious",
];

const defaults = {
  wordsText: words.join(", "),
};

export default function StyleMarquee({ editable = false, page = "shared" }: { editable?: boolean; page?: string }) {
  const { content, saveContent, isSaving, error } = usePageComponentContent(page, "styleMarquee", defaults);
  return (
    <AdminEditableSection
      content={content}
      editable={editable}
      error={error}
      isSaving={isSaving}
      title="Style marquee"
      onSave={saveContent}
    >
      {({ content: editorContent, isEditing, updateContent }) => {
        const editorWords = String(editorContent.wordsText || defaults.wordsText)
          .split(",")
          .map((word) => word.trim())
          .filter(Boolean);
        const editorLine = editorWords.map((word) => `${word} //`).join(" ");

        return (
    <section className="style-marquee" aria-label="Style values">
      <div className="style-marquee__track">
        <EditableText
          isEditing={isEditing}
          value={editorLine}
          onChange={(value) => updateContent({ wordsText: value.replaceAll("//", ",").replace(/,+/g, ",").replace(/^,\s*|\s*,$/g, "") })}
        />
        <span>{editorLine}</span>
      </div>
    </section>
        );
      }}
    </AdminEditableSection>
  );
}
