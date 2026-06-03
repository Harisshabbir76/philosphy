"use client";

import analysisWoman from "../Images/Analysis-woman.jpg";
import AdminEditableSection, { EditableHtml, EditableImage, EditableText } from "./AdminEditableSection";
import { usePageComponentContent } from "../lib/pageContent";
import "../Styles/AnalysisServices.css";

const defaults = {
  imageUrl: "",
  items: [
    {
      title: "COLOR SEASON ANALYSIS",
      html: `
        <p>
  A personalized in-home experience designed to identify the colors that naturally
  enhance your features. Through a guided session, we analyze how different tones
  interact with your skin, hair, and overall presence to define your undertone and
  color season--giving you clarity and confidence in your styling choices.
</p>

<h3>Before the session:</h3>
<ul class="analysis-service__bullet-list">
  <li>Schedule appointment (date &amp; time agreed in advance)</li>
  <li>Home visit (external location can be arranged if needed, venue cost covered by client)</li>
</ul>

<h3>During the session:</h3>
<ul class="analysis-service__bullet-list">
  <li>Full color analysis using professional tools (mirror, drape, lighting, color kit)</li>
  <li>Observation of how colors interact with your natural features</li>
  <li>Comparison of shades and their effect on your skin</li>
  <li>Exploration of suitable hair color options</li>
  <li>Identification of:</li>
</ul>

<ul class="analysis-service__dash-list">
  <li>Undertone</li>
  <li>Most harmonious color palette</li>
  <li>Your color season</li>
</ul>

<h3>After the session:</h3>
<ul class="analysis-service__bullet-list">
  <li>Personal color fan with your best shades (provided immediately)</li>
  <li>Detailed PDF report (within 10-15 working days), including:</li>
</ul>

<ul class="analysis-service__dash-list">
  <li>Understanding your color season</li>
  <li>How to dress based on your season and contrast</li>
  <li>Color coordination principles</li>
  <li>Suitable fabric colors</li>
  <li>Guidance for traditional wear (e.g. mukhawar), if relevant</li>
  <li>Jewelry selection and color pairing</li>
  <li>Recommended hair color options</li>
</ul>

<p class="analysis-service__price">PRICE: 1880 AED</p>
<Link href='/booking' class="analysis-service__button">BOOK YOUR CONSULTATION NOW</Link>
      `,
    },
    {
      title: "BODY, FACE & STYLE ANALYSIS",
      html: `<p>A thoughtful study of your proportions, features, and style direction to help you choose silhouettes, details, and outfits with ease.</p>`,
    },
    {
      title: "PERSONAL IMAGE ANALYSIS (COMBINED SERVICE)",
      html: `<p>A complete analysis experience combining color, body, face, and personal style guidance for a more refined image direction.</p>`,
    },
  ],
};

type ServiceItem = {
  title: string;
  html: string;
};

export default function AnalysisServices({ editable = false }: { editable?: boolean }) {
  const { content, saveContent, isSaving, error } = usePageComponentContent("analysis", "services", defaults);

  return (
    <AdminEditableSection
      content={content}
      editable={editable}
      error={error}
      isSaving={isSaving}
      title="Analysis services"
      onSave={saveContent}
    >
      {({ content: editorContent, isEditing, updateContent }) => {
        const items = (Array.isArray(editorContent.items) ? editorContent.items : defaults.items) as ServiceItem[];
        const updateItem = (index: number, nextItem: Partial<ServiceItem>) => {
          updateContent((current) => {
            const currentItems = (Array.isArray(current.items) ? current.items : defaults.items) as ServiceItem[];
            return {
              ...current,
              items: currentItems.map((item, itemIndex) => (itemIndex === index ? { ...item, ...nextItem } : item)),
            };
          });
        };

        return (
      <section className="analysis-services">
        <div className="analysis-services__inner">
          <div className="analysis-services__copy">
            {items.map((item, index) => (
              <details className="analysis-service" name="analysis-services" open={index === 0} key={item.title}>
                <summary>
                  <EditableText
                    isEditing={isEditing}
                    value={item.title}
                    onChange={(title) => updateItem(index, { title })}
                  />
                  <span className="analysis-service__mark" aria-hidden="true" />
                </summary>
                <EditableHtml
                  className="analysis-service__content"
                  isEditing={isEditing}
                  value={item.html}
                  onChange={(html) => updateItem(index, { html })}
                />
              </details>
            ))}
          </div>

          <div className="analysis-services__image">
            <EditableImage
              src={String(editorContent.imageUrl) || analysisWoman}
              alt="Woman wearing a white draped outfit"
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
