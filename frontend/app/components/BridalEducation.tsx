"use client";

import AdminEditableSection, { EditableHtml } from "./AdminEditableSection";
import { usePageComponentContent } from "../lib/pageContent";
import "../Styles/BridalEducation.css";

const defaults = {
  html: `
    <h2>BRIDAL STYLING EDUCATION EXPERIENCE</h2>
    <p>Learn to create every look with confidence, from your everyday life to your wedding day.</p>
    <p>A personalized educational styling experience designed to help brides understand and build their personal style with confidence, clarity, and intention. This service teaches brides how to style themselves independently while understanding what truly suits their features, lifestyle, and aesthetic direction.</p>
    <p>The experience includes a seasonal color analysis tailored specifically to the bride and applied across all her looks, along with body shape and facial feature analysis to identify the most flattering cuts, silhouettes, and styling directions.</p>
    <p>Through practical guidance and styling education, brides learn how to create cohesive everyday outfits and occasion looks with ease and confidence.</p>
    <h3>Inclusions:</h3>
    <p>Personal styling files are delivered covering all aspects of the bride&apos;s lifestyle, including:</p>
    <ul class="bridal-education__bullet-list">
      <li>Complete wedding day look</li>
      <li>Travel outfits</li>
      <li>Hijab and abaya styling</li>
      <li>Jalabiyas</li>
      <li>Everyday outfits</li>
      <li>Loungewear, sleepwear, and pajamas</li>
      <li>Formal and special occasion outfits</li>
    </ul>
    <p>Each file is thoughtfully structured to help the bride understand her personal style and apply it effortlessly in real life.</p>
    <p>The wedding styling file includes complete head-to-toe guidance, including:</p>
    <ul class="bridal-education__bullet-list">
      <li>Wedding dress</li>
      <li>Veil</li>
      <li>Shoes</li>
      <li>Jewelry</li>
      <li>Bouquet styling</li>
      <li>Hair direction</li>
      <li>Makeup direction</li>
    </ul>
    <hr />
    <h3>Wedding Dress Shopping Sessions</h3>
    <p>If the bride wishes to book wedding dress shopping sessions, she receives a special discounted rate as part of this educational experience.</p>
    <p>Wedding Dress Shopping Session: 580 AED per day</p>
    <p>During the shopping sessions, the bride is guided to apply everything she has learned in real time while selecting her wedding dress.</p>
    <p>The goal of this service is to fully empower the bride to understand her personal style and build a wardrobe that reflects her identity in every detail of her life.</p>
    <p class="bridal-education__price">Price:<br />3500 AED</p>
    <a href="/booking" class="bridal-education__button">BOOK YOUR CONSULTATION NOW</a>`,
};

export default function BridalEducation({ editable = false }: { editable?: boolean }) {
  const { content, saveContent, isSaving, error } = usePageComponentContent("bridal", "education", defaults);

  return (
    <AdminEditableSection
      content={content}
      editable={editable}
      error={error}
      isSaving={isSaving}
      title="Bridal education"
      onSave={saveContent}
    >
      {({ content: editorContent, isEditing, updateContent }) => (
      <section className="bridal-education">
        <EditableHtml
          className="bridal-education__panel"
          isEditing={isEditing}
          value={String(editorContent.html)}
          onChange={(html) => updateContent({ html })}
        />
      </section>
      )}
    </AdminEditableSection>
  );
}
