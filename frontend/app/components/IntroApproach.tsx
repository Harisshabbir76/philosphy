"use client";

import woman from "../Images/woman.png";
import newspaper from "../Images/newspaper.webp";
import AdminEditableSection, { EditableImage } from "./AdminEditableSection";
import { EditableContent } from "./CMS";
import { usePageComponentContent } from "../lib/pageContent";
import { translations } from "../lib/translations";
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
          <EditableContent as="h2" plain contentId="home.introApproach.title" fallback={String(editorContent.title)} fallbackAr={translations.ar.introApproach.title} />
          <EditableContent as="p" plain contentId="home.introApproach.text" fallback={String(editorContent.text)} fallbackAr={translations.ar.introApproach.text} />
          <Link href='/booking'><button className="button">
            <EditableContent as="span" plain contentId="home.introApproach.buttonText" fallback={String(editorContent.buttonText)} fallbackAr={translations.ar.introApproach.buttonText} />
          </button></Link>

        </div>
        <div className="intro-approach__images">
          <div className="intro-approach__image intro-approach__image--woman">
            <EditableImage
              src={String(editorContent.womanImageUrl) || woman}
              alt="Woman walking through Paris"
              fill
              sizes="(max-width: 760px) 35vw, 180px"
              isEditing={isEditing}
              onChange={(womanImageUrl) => updateContent({ womanImageUrl })}
            />
          </div>
          <div className="intro-approach__image intro-approach__image--newspaper">
            <EditableImage
              src={String(editorContent.newspaperImageUrl) || newspaper}
              alt="Fashion books on a wooden table"
              fill
              sizes="(max-width: 760px) 44vw, 250px"
              isEditing={isEditing}
              onChange={(newspaperImageUrl) => updateContent({ newspaperImageUrl })}
            />
          </div>
        </div>
      </div>

      <div className="intro-approach__bottom">
        <EditableContent as="h4" plain defaultClass="section-kicker" contentId="home.introApproach.kicker" fallback={String(editorContent.kicker)} fallbackAr={translations.ar.introApproach.kicker} />
        <EditableContent as="h2" plain contentId="home.introApproach.approachTitle" fallback={String(editorContent.approachTitle)} fallbackAr={translations.ar.introApproach.approachTitle} />
        <EditableContent as="p" plain contentId="home.introApproach.approachText" fallback={String(editorContent.approachText)} fallbackAr={translations.ar.introApproach.approachText} />
      </div>
    </section>
      )}
    </AdminEditableSection>
  );
}
