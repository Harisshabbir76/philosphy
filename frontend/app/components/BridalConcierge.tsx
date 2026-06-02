"use client";

import AdminEditableSection, { EditableHtml, EditableText } from "./AdminEditableSection";
import { usePageComponentContent } from "../lib/pageContent";
import "../Styles/BridalConcierge.css";

const defaults = {
  eyebrow: "ADD-ON SERVICE",
  title: "NEED EXTRA HELP ON YOUR WEDDING DAY?",
  subtitle: "Bridal Concierge",
  html: `
    <p>Enhance your bridal experience with our Bridal Concierge Add-On, a personalized support service designed to ensure every detail comes together flawlessly on your special day.</p>
    <p>On the wedding day, we are there to oversee the final touches, ensure everything looks polished and cohesive, assist with styling adjustments, and provide seamless support throughout the occasion so you can feel confident, relaxed, and fully present in every moment.</p>
    <p class="bridal-concierge__price">Price: 1200 AED</p>
    <a href="/booking" class="bridal-concierge__button">BOOK YOUR CONSULTATION NOW</a>`,
};

export default function BridalConcierge({ editable = false }: { editable?: boolean }) {
  const { content, saveContent, isSaving, error } = usePageComponentContent("bridal", "concierge", defaults);

  return (
    <AdminEditableSection
      content={content}
      editable={editable}
      error={error}
      isSaving={isSaving}
      title="Bridal concierge"
      onSave={saveContent}
    >
      {({ content: editorContent, isEditing, updateContent }) => (
      <section className="bridal-concierge">
        <div className="bridal-concierge__inner">
          <EditableText
            as="p"
            className="bridal-concierge__eyebrow"
            isEditing={isEditing}
            value={String(editorContent.eyebrow)}
            onChange={(eyebrow) => updateContent({ eyebrow })}
          />
          <EditableText as="h2" isEditing={isEditing} value={String(editorContent.title)} onChange={(title) => updateContent({ title })} />
          <EditableText
            as="h3"
            isEditing={isEditing}
            value={String(editorContent.subtitle)}
            onChange={(subtitle) => updateContent({ subtitle })}
          />
          <EditableHtml isEditing={isEditing} value={String(editorContent.html)} onChange={(html) => updateContent({ html })} />
        </div>
      </section>
      )}
    </AdminEditableSection>
  );
}
