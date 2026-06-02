"use client";

import wardrobeImage from "../Images/wardrobe2.png";
import AdminEditableSection, { EditableHtml, EditableImage, EditableText } from "./AdminEditableSection";
import { usePageComponentContent } from "../lib/pageContent";
import "../Styles/WardrobeServices.css";

const defaults = {
  imageUrl: "",
  items: [
    {
      title: "CLOSET EDIT",
      html: `
        <p>
          A personalized wardrobe refinement experience designed to help you understand what you
          already own and what truly works for you. Through a guided session in your home, we
          assess your pieces, refine your choices, and transform your wardrobe into a more
          functional, organized, and wearable system tailored to your lifestyle.
        </p>

        <h3>Before the session:</h3>
        <ul><li>Scheduled home visit to your wardrobe</li></ul>

        <h3>During the session:</h3>
        <ul>
          <li>Full wardrobe review and refinement process</li>
          <li>Guidance on understanding your existing cuts and styles</li>
          <li>Identification of what suits you and what does not based on:</li>
          <li>Cuts</li>
          <li>Colors</li>
          <li>Body measurements taken</li>
          <li>Quick color test (general indication, not a full color analysis)</li>
        </ul>

        <h3>After &amp; within the session:</h3>
        <ul>
          <li>Review of suitable pieces that may need alterations</li>
          <li>Suggestions on how to repair and adjust clothing for better use</li>
          <li>Creation of new outfit combinations from existing pieces</li>
          <li>List of missing items and wardrobe needs</li>
          <li>Guidance on what to let go of</li>
          <li>Support with decluttering (using bags or boxes)</li>
          <li>Practical guidance on how to organize your wardrobe efficiently</li>
        </ul>

        <p>Every wardrobe is unique, so the system is tailored specifically to your needs.</p>

        <p class="wardrobe-analysis__price">
          PRICE:<br />
          Abu Dhabi: 500 AED per hour<br />
          Other Emirates &amp; Cities: 650 AED per hour<br />
          Minimum booking: 3 hours
        </p>
        <a href="/booking" class="wardrobe-analysis__button">BOOK YOUR CONSULTATION NOW</a>`,
    },
    {
      title: "STYLING & OUTFIT CURATION",
      html: `<p>A styling session focused on building complete outfits from your wardrobe, refining your daily dressing flow, and creating looks that feel polished, practical, and aligned with your personal image.</p>`,
    },
  ],
};

type WardrobeItem = {
  title: string;
  html: string;
};

export default function WardrobeAnalysis({ editable = false }: { editable?: boolean }) {
  const { content, saveContent, isSaving, error } = usePageComponentContent("wardrobe", "services", defaults);

  return (
    <AdminEditableSection
      content={content}
      editable={editable}
      error={error}
      isSaving={isSaving}
      title="Wardrobe services"
      onSave={saveContent}
    >
      {({ content: editorContent, isEditing, updateContent }) => {
        const items = (Array.isArray(editorContent.items) ? editorContent.items : defaults.items) as WardrobeItem[];
        const updateItem = (index: number, nextItem: Partial<WardrobeItem>) => {
          updateContent((current) => {
            const currentItems = (Array.isArray(current.items) ? current.items : defaults.items) as WardrobeItem[];
            return {
              ...current,
              items: currentItems.map((item, itemIndex) => (itemIndex === index ? { ...item, ...nextItem } : item)),
            };
          });
        };

        return (
      <section className="wardrobe-analysis">
        <div className="wardrobe-analysis__inner">
          <div className="wardrobe-analysis__copy">
            {items.map((item, index) => (
              <details className="wardrobe-analysis__item" name="wardrobe-analysis" open={index === 0} key={item.title}>
                <summary>
                  <EditableText
                    isEditing={isEditing}
                    value={item.title}
                    onChange={(title) => updateItem(index, { title })}
                  />
                  <span className="wardrobe-analysis__mark" aria-hidden="true" />
                </summary>
                <EditableHtml
                  className="wardrobe-analysis__content"
                  isEditing={isEditing}
                  value={item.html}
                  onChange={(html) => updateItem(index, { html })}
                />
              </details>
            ))}
          </div>

          <div className="wardrobe-analysis__image">
            <EditableImage
              src={String(editorContent.imageUrl) || wardrobeImage}
              alt="Wardrobe styling detail with shoes and folded knitwear"
              fill
              sizes="240px"
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
