"use client";

import woman from "../Images/woman.png";
import newspaper from "../Images/newspaper.webp";
import AdminEditableSection, { EditableImage, EditableText } from "./AdminEditableSection";
import { usePageComponentContent } from "../lib/pageContent";
import "../Styles/IntroApproach.css";
import Link from "next/link";

const defaults = {
  womanImageUrl: "",
  newspaperImageUrl: "",
  title: "At Philosophy, style isn't chosen.\n\nIt's matched, expressed & owned.",
  text:
    "Welcome to Philosophy - a space where creativity is guided by purpose and every detail is considered with care. We believe in designing with clarity, creating work that feels effortless yet deeply thoughtful. From concept to execution, our approach is rooted in sophistication, balance, and quiet confidence - allowing your brand to speak with meaning, not noise.",
  buttonText: "BOOK YOUR CONSULTATION NOW",
  kicker: "OUR APPROACH",
  approachTitle: "Intentional. Refined. Effortless.",
  approachText:
    "Welcome to Philosophy - a space where creativity is guided by purpose and every detail is considered with care. We believe in designing with clarity, creating work that feels effortless yet deeply thoughtful. From concept to execution, our approach is rooted in sophistication, balance, and quiet confidence - allowing your brand to speak with meaning, not noise.",
};

export default function IntroApproach({ editable = false }: { editable?: boolean }) {
  const { content, saveContent, isSaving, error } = usePageComponentContent("home", "introApproach", defaults);

  return (
    <AdminEditableSection
      content={content}
      editable={editable}
      error={error}
      isSaving={isSaving}
      title="Home intro approach"
      onSave={saveContent}
    >
      {({ content: editorContent, isEditing, updateContent }) => (
    <section className="intro-approach">
      <div className="intro-approach__top">
        <div className="intro-approach__copy">
          <EditableText as="h2" isEditing={isEditing} value={String(editorContent.title)} onChange={(title) => updateContent({ title })} />
          <EditableText as="p" isEditing={isEditing} value={String(editorContent.text)} onChange={(text) => updateContent({ text })} />
          <Link href='/booking'><button className="button">
            <EditableText isEditing={isEditing} value={String(editorContent.buttonText)} onChange={(buttonText) => updateContent({ buttonText })} />
          </button></Link>
          
        </div>
        <div className="intro-approach__images">
          <div className="intro-approach__image intro-approach__image--woman">
            <EditableImage
              src={String(editorContent.womanImageUrl) || woman}
              alt="Woman walking through Paris"
              fill
              sizes="180px"
              isEditing={isEditing}
              onChange={(womanImageUrl) => updateContent({ womanImageUrl })}
            />
          </div>
          <div className="intro-approach__image intro-approach__image--newspaper">
            <EditableImage
              src={String(editorContent.newspaperImageUrl) || newspaper}
              alt="Fashion books on a wooden table"
              fill
              sizes="260px"
              isEditing={isEditing}
              onChange={(newspaperImageUrl) => updateContent({ newspaperImageUrl })}
            />
          </div>
        </div>
      </div>

      <div className="intro-approach__bottom">
        <EditableText as="h4" className="section-kicker" isEditing={isEditing} value={String(editorContent.kicker)} onChange={(kicker) => updateContent({ kicker })} />
        <EditableText as="h2" isEditing={isEditing} value={String(editorContent.approachTitle)} onChange={(approachTitle) => updateContent({ approachTitle })} />
        <EditableText as="p" isEditing={isEditing} value={String(editorContent.approachText)} onChange={(approachText) => updateContent({ approachText })} />
      </div>
    </section>
      )}
    </AdminEditableSection>
  );
}
