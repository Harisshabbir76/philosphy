"use client";

import Image from "next/image";
import chooseUs from "../Images/choose-us.svg";
import bannerSmall from "../Images/banner small.png";
import AdminEditableSection, { EditableImage, EditableText } from "./AdminEditableSection";
import { usePageComponentContent } from "../lib/pageContent";
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
        <EditableText as="h2" isEditing={isEditing} value={String(editorContent.title)} onChange={(title) => updateContent({ title })} />
        <EditableText as="p" isEditing={isEditing} value={String(editorContent.subtitle)} onChange={(subtitle) => updateContent({ subtitle })} />
        <Image src={chooseUs} alt="" className="why-choose__mark" />
        <EditableText as="h3" isEditing={isEditing} value={String(editorContent.heading)} onChange={(heading) => updateContent({ heading })} />
        <EditableText as="h4" isEditing={isEditing} value={String(editorContent.text)} onChange={(text) => updateContent({ text })} />
        <div className="why-choose__divider"></div>
      </div>
      
      <div className="why-choose__image">
        <EditableImage
          src={String(editorContent.imageUrl) || bannerSmall}
          alt="Elegant interior with seated woman"
          fill
          sizes="(max-width: 480px) 90vw, (max-width: 768px) 85vw, (max-width: 1024px) 80vw, 70vw"
          quality={85}
          isEditing={isEditing}
          onChange={(imageUrl) => updateContent({ imageUrl })}
        />
      </div>
    </section>
      )}
    </AdminEditableSection>
  );
}