"use client";

import bridalCompleteImage from "../Images/bridal2.png";
import AdminEditableSection, { EditableHtml, EditableImage, EditableText } from "./AdminEditableSection";
import { usePageComponentContent } from "../lib/pageContent";
import "../Styles/BridalCompleteLook.css";

const defaults = {
  imageUrl: "",
  eyebrow: "THE COMPLETE BRIDAL WEDDING LOOK",
  title: "Your wedding look, styled with complete professional precision.",
  introHtml: `
    <p>A private, high-end bridal styling experience designed to curate the bride&apos;s complete wedding look with elegance, precision, and personal direction. Every detail is thoughtfully considered to create a cohesive bridal aesthetic that reflects the bride&apos;s personality, lifestyle, and unique vision.</p>
    <p>The experience begins with a dedicated home consultation to understand the bride&apos;s aesthetic direction, followed by an in-depth seasonal color analysis to identify the most harmonious and flattering color palette. Detailed body shape and facial feature analysis are also conducted to define the most suitable silhouettes, cuts, and styling details.</p>
    <p>A personalized shopping and styling direction plan is then created to guide all bridal wardrobe and styling decisions throughout the journey.</p>`,
  leftHtml: `
    <h3>Inclusions:</h3>
    <ul>
      <li>Dedicated home consultation</li>
      <li>Seasonal color analysis</li>
      <li>Body shape and facial feature analysis</li>
      <li>Organization and scheduling of bridal shopping and wedding dress fitting sessions</li>
      <li>Accompanied wedding dress shopping sessions with expert styling guidance</li>
    </ul>
    <h3>Full bridal look curation includes:</h3>
    <ul>
      <li>Wedding dress</li>
      <li>Veil</li>
      <li>Shoes/accessories</li>
      <li>Jewelry</li>
      <li>Bouquet styling</li>
      <li>Makeup direction aligned with the bride&apos;s color season</li>
      <li>Hairstyle recommendations tailored to facial structure and overall aesthetic</li>
    </ul>
    <h3>Additional inclusions:</h3>
    <ul>
      <li>Support in selecting and coordinating hair and makeup artists</li>
      <li>Creation of an elegant Mood Board to visually communicate the bridal vision</li>
      <li>Final curated bridal presentation summarizing the complete head-to-toe wedding look</li>
    </ul>`,
  rightHtml: `
    <h3>Service Structure</h3>
    <p>Includes up to 7 styling and shopping sessions distributed throughout the preparation journey. Additional days beyond the 15-day structure are charged at 300 AED per day. Continuous stylist support from the first consultation until the wedding day.</p>
    <p>Final pre-wedding virtual consultation to review all details and finalize styling decisions.</p>
    <h3>Optional Wedding Day Service</h3>
    <p>Available upon request and may include:</p>
    <ul>
      <li>Walking coaching</li>
      <li>Entrance styling</li>
      <li>Outfit assistance</li>
      <li>Jewelry dressing</li>
      <li>Final look coordination before the bride&apos;s appearance</li>
    </ul>
    <p>Additional styling services are also available for post-wedding events, after-party looks, or up to 3 additional curated outfits if completed ahead of schedule.</p>
    <p class="bridal-complete__price">Price<br />4000 AED</p>
    <a href="/booking" class="bridal-complete__button">BOOK YOUR CONSULTATION NOW</a>`,
};

export default function BridalCompleteLook({ editable = false }: { editable?: boolean }) {
  const { content, saveContent, isSaving, error } = usePageComponentContent("bridal", "completeLook", defaults);

  return (
    <AdminEditableSection
      content={content}
      editable={editable}
      error={error}
      isSaving={isSaving}
      title="Complete bridal look"
      onSave={saveContent}
    >
      {({ content: editorContent, isEditing, updateContent }) => (
      <section className="bridal-complete">
        <div className="bridal-complete__inner">
          <div className="bridal-complete__intro">
            <EditableText
              as="p"
              className="bridal-complete__eyebrow"
              isEditing={isEditing}
              value={String(editorContent.eyebrow)}
              onChange={(eyebrow) => updateContent({ eyebrow })}
            />
            <EditableText as="h2" isEditing={isEditing} value={String(editorContent.title)} onChange={(title) => updateContent({ title })} />
            <EditableHtml isEditing={isEditing} value={String(editorContent.introHtml)} onChange={(introHtml) => updateContent({ introHtml })} />
          </div>

          <div className="bridal-complete__image">
            <EditableImage
              src={String(editorContent.imageUrl) || bridalCompleteImage}
              alt="Bride standing before a wedding stage"
              fill
              sizes="(max-width: 900px) 100vw, 1300px"
              isEditing={isEditing}
              onChange={(imageUrl) => updateContent({ imageUrl })}
            />
          </div>

          <div className="bridal-complete__details">
            <EditableHtml
              className="bridal-complete__column bridal-complete__column--right"
              isEditing={isEditing}
              value={String(editorContent.leftHtml)}
              onChange={(leftHtml) => updateContent({ leftHtml })}
            />
            <div className="bridal-complete__divider" aria-hidden="true" />
            <EditableHtml
              className="bridal-complete__column"
              isEditing={isEditing}
              value={String(editorContent.rightHtml)}
              onChange={(rightHtml) => updateContent({ rightHtml })}
            />
          </div>
        </div>
      </section>
      )}
    </AdminEditableSection>
  );
}
