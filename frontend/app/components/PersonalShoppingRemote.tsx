"use client";

import remoteImage from "../Images/ps3.jpeg";
import AdminEditableSection, { EditableHtml, EditableImage, EditableText } from "./AdminEditableSection";
import { usePageComponentContent } from "../lib/pageContent";
import "../Styles/PersonalShoppingRemote.css";

const defaults = {
  imageUrl: "",
  title: "I SHOP 4 U - REMOTE PERSONAL SHOPPING SERVICE",
  tab: "Relax.. I'll curate your style",
  intro:
    "A fully personalized remote shopping experience where all pieces are carefully selected and purchased on your behalf based on your personal style, body shape, and seasonal color profile. Designed for clients who already have a clear understanding of their image foundations, this service offers a refined and effortless way to build cohesive everyday looks without the stress of shopping yourself.",
  html: `
    <p>The experience begins with an online consultation to understand your lifestyle, needs, priorities, and budget before curating pieces tailored specifically to you.</p>
    <p>The service focuses on everyday lifestyle wardrobes, including:</p>
    <ul class="ps-remote__bullet-list">
      <li>Workwear</li>
      <li>Travel outfits</li>
      <li>Home elegance &amp; loungewear</li>
      <li>Everyday casual looks</li>
    </ul>
    <p>All selected pieces are curated to feel cohesive, practical, and aligned with your personal style identity. Purchases may include clothing, abayas, modest fashion pieces, and selected beauty products when needed.</p>
    <p>From sourcing and purchasing to arranging home delivery, the entire process is handled for you. At the end of the service, you receive a curated styling file showing all selected pieces styled into complete looks for effortless daily dressing.</p>
    <div class="ps-remote__pricing">
      <p>Pricing</p>
      <ul class="ps-remote__bullet-list">
        <li>1-2 Looks: 1000 AED</li>
        <li>3-5 Looks: 2000 AED</li>
        <li>6-10 Looks: 3850 AED</li>
      </ul>
    </div>
    <a href="/contact-us" class="ps-remote__button">BOOK YOUR CONSULTATION NOW</a>`,
};

export default function PersonalShoppingRemote({ editable = false }: { editable?: boolean }) {
  const { content, saveContent, isSaving, error } = usePageComponentContent("personal-shopping", "remote", defaults);

  return (
    <AdminEditableSection
      content={content}
      editable={editable}
      error={error}
      isSaving={isSaving}
      title="Remote shopping"
      onSave={saveContent}
    >
      {({ content: editorContent, isEditing, updateContent }) => (
      <section className="ps-remote">
        <div className="ps-remote__inner">
          <div className="ps-remote__intro">
            <EditableText as="h2" isEditing={isEditing} value={String(editorContent.title)} onChange={(title) => updateContent({ title })} />
            <div className="ps-remote__tabs" aria-label="Remote shopping steps">
              <EditableText isEditing={isEditing} value={String(editorContent.tab)} onChange={(tab) => updateContent({ tab })} />
            </div>
            <EditableText as="p" isEditing={isEditing} value={String(editorContent.intro)} onChange={(intro) => updateContent({ intro })} />
          </div>

          <div className="ps-remote__image">
            <EditableImage
              src={String(editorContent.imageUrl) || remoteImage}
              alt="Cream skirt and heels styling inspiration"
              fill
              sizes="104px"
              isEditing={isEditing}
              onChange={(imageUrl) => updateContent({ imageUrl })}
            />
          </div>

          <EditableHtml
            className="ps-remote__details"
            isEditing={isEditing}
            value={String(editorContent.html)}
            onChange={(html) => updateContent({ html })}
          />
        </div>
      </section>
      )}
    </AdminEditableSection>
  );
}
