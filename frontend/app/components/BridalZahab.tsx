"use client";

import bridalZahabImage from "../Images/bridal3.jpeg";
import AdminEditableSection, { EditableHtml, EditableImage, EditableText } from "./AdminEditableSection";
import { usePageComponentContent } from "../lib/pageContent";
import "../Styles/BridalZahab.css";

const defaults = {
  imageUrl: "",
  title: "BRIDAL DOWRY STYLING EXPERIENCE - ZAHAB",
  html: `
    <p>Your elegance is built on structure, not guesswork.</p>
    <p>A professional personal shopping experience designed for brides who want to build their complete trousseau in a refined, intentional, and fully structured way. The service focuses on selecting every piece with purpose, ensuring the entire zahab feels cohesive, elegant, and aligned with the bride&apos;s personal style and lifestyle.</p>
    <p>Before any shopping begins, the experience is built around understanding the bride through seasonal color analysis, body shape analysis, and facial feature assessment to ensure every styling decision feels harmonious and flattering.</p>
    <a href="/contact-us" class="bridal-zahab__button">BOOK YOUR CONSULTATION NOW</a>`,
  packageItems: [
    "SERVICE PROCESS",
    "BASIC FOUNDATION PACKAGE",
    "ESSENTIAL ZAHAB PACKAGE",
    "COMPLETE BRIDAL ZAHAB PACKAGE",
  ],
  packageDescription:
    "A structured bridal shopping path tailored to the bride's preparation needs, wardrobe direction, and final styling goals.",
};

export default function BridalZahab({ editable = false }: { editable?: boolean }) {
  const { content, saveContent, isSaving, error } = usePageComponentContent("bridal", "zahab", defaults);

  return (
    <AdminEditableSection
      content={content}
      editable={editable}
      error={error}
      isSaving={isSaving}
      title="Bridal zahab"
      onSave={saveContent}
    >
      {({ content: editorContent, isEditing, updateContent }) => {
        const packageItems = (Array.isArray(editorContent.packageItems) ? editorContent.packageItems : defaults.packageItems) as string[];
        const updatePackageItem = (index: number, value: string) => {
          updateContent((current) => {
            const currentItems = (Array.isArray(current.packageItems) ? current.packageItems : defaults.packageItems) as string[];
            return {
              ...current,
              packageItems: currentItems.map((item, itemIndex) => (itemIndex === index ? value : item)),
            };
          });
        };

        return (
      <section className="bridal-zahab">
        <div className="bridal-zahab__inner">
          <div className="bridal-zahab__copy">
            <EditableText as="h2" isEditing={isEditing} value={String(editorContent.title)} onChange={(title) => updateContent({ title })} />
            <EditableHtml isEditing={isEditing} value={String(editorContent.html)} onChange={(html) => updateContent({ html })} />

            <div className="bridal-zahab__list">
              {packageItems.map((item, index) => (
                <details className="bridal-zahab__item" name="bridal-zahab" key={item}>
                  <summary>
                    <EditableText isEditing={isEditing} value={item} onChange={(value) => updatePackageItem(index, value)} />
                    <span className="bridal-zahab__mark" aria-hidden="true" />
                  </summary>
                  <div className="bridal-zahab__content">
                    <EditableText
                      as="p"
                      isEditing={isEditing}
                      value={String(editorContent.packageDescription)}
                      onChange={(packageDescription) => updateContent({ packageDescription })}
                    />
                  </div>
                </details>
              ))}
            </div>
          </div>

          <div className="bridal-zahab__image">
            <EditableImage
              src={String(editorContent.imageUrl) || bridalZahabImage}
              alt="Bride standing in a softly lit entrance"
              fill
              sizes="385px"
              isEditing={isEditing}
              onChange={(imageUrl) => updateContent({ imageUrl })}
            />
          </div>
        </div>
      </section>
        );
      }}
    </AdminEditableSection>
  );
}
