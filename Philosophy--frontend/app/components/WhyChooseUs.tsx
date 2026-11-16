"use client";

import Image from "next/image";
import chooseUs from "../Images/choose-us.svg";
import bannerSmall from "../Images/banner small.webp";
import AdminEditableSection, { EditableImage } from "./AdminEditableSection";
import { EditableContent } from "./CMS";
import { usePageComponentContent } from "../lib/pageContent";
import { translations } from "../lib/translations";
import "../Styles/WhyChooseUs.css";

const defaults = {
  imageUrl: "",
  title: "THE SMALLEST DETAILS MAKE THE STRONGEST IMPRESSION.",
  subtitle: "This is where your style takes shape. This is where you stand out.",
  heading: "WHY CHOOSE US?",
  text:
    "We believe true style is not about following trends, but about understanding what genuinely works for you, with a refined and thoughtful approach, we focus on creating results that feel natural, effortless, and lasting, combining a deep sense of aesthetics with careful attention to detail to ensure every choice is intentional, personal, and aligned with who you are.",
};

export default function WhyChooseUs({ editable = false }: { editable?: boolean }) {
  const { content, saveContent, isSaving, error } = usePageComponentContent("home", "whyChooseUs", defaults);

  return (
    <AdminEditableSection
      content={content}
      editable={editable}
      error={error}
      isSaving={isSaving}
      title="Why choose us"
      onSave={saveContent}
    >
      {({ content: editorContent, isEditing, updateContent }) => (
    <section className="why-choose">
      <div className="why-choose__text">
        <EditableContent as="h2" plain contentId="home.whyChooseUs.title" fallback={String(editorContent.title)} fallbackAr={translations.ar.whyChooseUs.title} />
        <EditableContent as="p" plain contentId="home.whyChooseUs.subtitle" fallback={String(editorContent.subtitle)} fallbackAr={translations.ar.whyChooseUs.subtitle} />
        <Image src={chooseUs} alt="" className="why-choose__mark" />
        <EditableContent as="h3" plain contentId="home.whyChooseUs.heading" fallback={String(editorContent.heading)} fallbackAr={translations.ar.whyChooseUs.heading} />
        <EditableContent as="h4" plain contentId="home.whyChooseUs.text" fallback={String(editorContent.text)} fallbackAr={translations.ar.whyChooseUs.text} />
        <div className="why-choose__divider"></div>
      </div>

      <div className="why-choose__image">
        <EditableImage
          src={String(editorContent.imageUrl) || bannerSmall}
          alt="Elegant interior with seated woman"
          fill
          sizes="(max-width: 480px) 90vw, (max-width: 768px) 85vw, (max-width: 1024px) 80vw, 70vw"
          isEditing={isEditing}
          onChange={(imageUrl) => updateContent({ imageUrl })}
        />
      </div>
    </section>
      )}
    </AdminEditableSection>
  );
}
