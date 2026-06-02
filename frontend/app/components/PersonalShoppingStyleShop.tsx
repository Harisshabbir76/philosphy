"use client";

import womensImage from "../Images/ps-womens.png";
import AdminEditableSection, { EditableHtml, EditableImage, EditableText } from "./AdminEditableSection";
import { usePageComponentContent } from "../lib/pageContent";
import "../Styles/PersonalShoppingStyleShop.css";

const defaults = {
  imageUrl: "",
  title: "STYLE & SHOP EXPERIENCE",
  html: `
    <p>Your elegance is built on structure, not guesswork.</p>
    <p>A professional personal shopping experience designed for brides who want to build their trousseau in a refined, intentional, and fully structured way. The service begins with a complete understanding of the bride&apos;s personal image through seasonal color analysis, body shape analysis, and facial feature assessment before any shopping takes place.</p>
    <p>The goal is to carefully curate every piece in a cohesive way that reflects the bride&apos;s personal style, lifestyle, and overall aesthetic direction.</p>
    <a href="/contact-us" class="ps-style-shop__button">BOOK YOUR CONSULTATION NOW</a>`,
  packageItems: [
    "SERVICE PROCESS",
    "BASIC FOUNDATION PACKAGE",
    "ESSENTIAL STYLE & SHOP PACKAGE",
    "COMPLETE STYLE & SHOP PACKAGE",
  ],
  packageDescription: "A refined consultation path created around your wardrobe needs, occasion plans, and styling direction.",
};

export default function PersonalShoppingStyleShop({ editable = false }: { editable?: boolean }) {
  const { content, saveContent, isSaving, error } = usePageComponentContent("personal-shopping", "styleShop", defaults);

  return (
    <AdminEditableSection
      content={content}
      editable={editable}
      error={error}
      isSaving={isSaving}
      title="Style and shop"
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
      <section className="ps-style-shop">
        <div className="ps-style-shop__inner">
          <div className="ps-style-shop__copy">
            <EditableText as="h2" isEditing={isEditing} value={String(editorContent.title)} onChange={(title) => updateContent({ title })} />
            <EditableHtml isEditing={isEditing} value={String(editorContent.html)} onChange={(html) => updateContent({ html })} />

            <div className="ps-style-shop__list">
              {packageItems.map((item, index) => (
                <details className="ps-style-shop__item" name="ps-style-shop" key={item}>
                  <summary>
                    <EditableText isEditing={isEditing} value={item} onChange={(value) => updatePackageItem(index, value)} />
                    <span className="ps-style-shop__mark" aria-hidden="true" />
                  </summary>
                  <div className="ps-style-shop__content">
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

          <div className="ps-style-shop__image">
            <EditableImage
              src={String(editorContent.imageUrl) || womensImage}
              alt="Women browsing elegant wardrobe pieces"
              fill
              sizes="270px"
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
