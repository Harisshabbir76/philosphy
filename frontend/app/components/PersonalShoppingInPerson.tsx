"use client";

import analysisOne from "../Images/ps-analysis1.png";
import analysisTwo from "../Images/ps-analysis2.png";
import AdminEditableSection, { EditableHtml, EditableImage, EditableText } from "./AdminEditableSection";
import { usePageComponentContent } from "../lib/pageContent";
import "../Styles/PersonalShoppingInPerson.css";

const defaults = {
  imageOneUrl: "",
  imageTwoUrl: "",
  title: "PERSONAL SHOPPING (IN-PERSON)",
  html: `
    <p>A personalized in-person shopping experience designed to make shopping more intentional, efficient, and aligned with your lifestyle. From selecting the right stores to curating complete outfits, every choice is guided by your body, personal style, and overall image goals-helping you build a wardrobe that truly works for you.</p>
    <h3>Before the session:</h3>
    <ul>
      <li>Appointment booked in advance</li>
      <li>Online consultation to understand:</li>
      <li>Your needs</li>
      <li>Your expectations</li>
      <li>Your shopping goals</li>
      <li>Selection of suitable shopping destinations and stores</li>
    </ul>
    <h3>On the shopping day:</h3>
    <ul>
      <li>In-person shopping session at the mall</li>
      <li>Body measurements taken (for first-time clients)</li>
    </ul>
    <h3>During the session:</h3>
    <ul>
      <li>Personalized outfit selection and styling</li>
      <li>Guidance based on:</li>
      <li>Body shape</li>
      <li>Measurements</li>
      <li>Personal style</li>
      <li>Color-focused shopping if your color season is already known</li>
      <li>Optional quick color test if needed</li>
    </ul>
    <p>(Provides a general indication, but is less detailed than a full color season analysis)</p>
    <p>The goal of the session is to simplify shopping, help you choose pieces that genuinely suit you, and create ready-to-wear looks tailored to your lifestyle.</p>
    <p class="ps-in-person__price">PRICE:<br />1200 AED per shopping day<br />(Full day session from 10:00 AM - 7:00 PM)</p>
    <a href="/contact-us" class="ps-in-person__button">BOOK YOUR CONSULTATION NOW</a>`,
};

export default function PersonalShoppingInPerson({ editable = false }: { editable?: boolean }) {
  const { content, saveContent, isSaving, error } = usePageComponentContent("personal-shopping", "inPerson", defaults);

  return (
    <AdminEditableSection
      content={content}
      editable={editable}
      error={error}
      isSaving={isSaving}
      title="In-person shopping"
      onSave={saveContent}
    >
      {({ content: editorContent, isEditing, updateContent }) => (
      <section className="ps-in-person">
        <div className="ps-in-person__inner">
          <div className="ps-in-person__copy">
            <EditableText as="h2" isEditing={isEditing} value={String(editorContent.title)} onChange={(title) => updateContent({ title })} />
            <EditableHtml isEditing={isEditing} value={String(editorContent.html)} onChange={(html) => updateContent({ html })} />
          </div>

          <div className="ps-in-person__images" aria-hidden="true">
            <div className="ps-in-person__image ps-in-person__image--large">
              <EditableImage
                src={String(editorContent.imageOneUrl) || analysisOne}
                alt=""
                fill
                sizes="400px"
                isEditing={isEditing}
                onChange={(imageOneUrl) => updateContent({ imageOneUrl })}
              />
            </div>
            <div className="ps-in-person__image ps-in-person__image--small">
              <EditableImage
                src={String(editorContent.imageTwoUrl) || analysisTwo}
                alt=""
                fill
                sizes="260px"
                isEditing={isEditing}
                onChange={(imageTwoUrl) => updateContent({ imageTwoUrl })}
              />
            </div>
          </div>
        </div>
      </section>
      )}
    </AdminEditableSection>
  );
}
