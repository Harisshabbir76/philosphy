"use client";

import store from "../Images/store.png";
import AdminEditableSection, { EditableImage, EditableText } from "./AdminEditableSection";
import { usePageComponentContent } from "../lib/pageContent";
import "../Styles/GettingStarted.css";

const steps = [
  {
    title: "CHOOSE A PACKAGE",
    text: "Select the service that best aligns with your needs, whether you're looking for a complete transformation or focused guidance. Each option is thoughtfully designed to support you with clarity and intention.",
  },
  {
    title: "SCHEDULE A CONSULT",
    text: "Book a consultation where we take the time to understand your lifestyle, preferences, and goals. This is where we align on your vision and define the direction moving forward.",
  },
  {
    title: "MAKE IT OFFICIAL",
    text: "Once everything feels right, we confirm the details and begin the process. With a clear plan in place, we move forward with a refined and seamless experience tailored to you.",
  },
];

const defaults = {
  imageUrl: "",
  kicker: "HOW TO GET STARTED",
  steps,
  title: "WANNA LEARN MORE ABOUT FASHION?",
  subtitle: "Workshops coming soon!",
  text:
    "Stay tuned for intimate styling sessions, creative fashion workshops, and inspiring experiences designed for women who appreciate timeless elegance, personal style, and the art behind fashion.",
  buttonText: "STAY UPDATED",
};

type Step = {
  title: string;
  text: string;
};

export default function GettingStarted({ editable = false }: { editable?: boolean }) {
  const { content, saveContent, isSaving, error } = usePageComponentContent("home", "gettingStarted", defaults);

  return (
    <AdminEditableSection
      content={content}
      editable={editable}
      error={error}
      isSaving={isSaving}
      title="Getting started"
      onSave={saveContent}
    >
      {({ content: editorContent, isEditing, updateContent }) => {
        const stepItems = (Array.isArray(editorContent.steps) ? editorContent.steps : steps) as Step[];
        const updateStep = (index: number, nextStep: Partial<Step>) => {
          updateContent((current) => {
            const currentSteps = (Array.isArray(current.steps) ? current.steps : steps) as Step[];
            return {
              ...current,
              steps: currentSteps.map((step, stepIndex) => (stepIndex === index ? { ...step, ...nextStep } : step)),
            };
          });
        };

        return (
    <section className="getting-started">
      <div className="getting-started__hero">
        <EditableText as="p" className="section-kicker" isEditing={isEditing} value={String(editorContent.kicker)} onChange={(kicker) => updateContent({ kicker })} />
        <div className="getting-started__cards">
          {stepItems.map((step, index) => (
            <article className="getting-started__card" key={step.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <EditableText as="h2" isEditing={isEditing} value={step.title} onChange={(title) => updateStep(index, { title })} />
              <EditableText as="p" isEditing={isEditing} value={step.text} onChange={(text) => updateStep(index, { text })} />
            </article>
          ))}
        </div>
      </div>
      <div className="getting-started__lower">
        <div className="getting-started__store">
          <EditableImage
            src={String(editorContent.imageUrl) || store}
            alt="Fashion atelier interior"
            fill
            sizes="(max-width: 760px) 100vw, 520px"
            isEditing={isEditing}
            onChange={(imageUrl) => updateContent({ imageUrl })}
          />
        </div>
        <EditableText as="h2" isEditing={isEditing} value={String(editorContent.title)} onChange={(title) => updateContent({ title })} />
        <EditableText as="h3" isEditing={isEditing} value={String(editorContent.subtitle)} onChange={(subtitle) => updateContent({ subtitle })} />
        <EditableText as="p" isEditing={isEditing} value={String(editorContent.text)} onChange={(text) => updateContent({ text })} />
        <a href="/contact-us">
          <EditableText isEditing={isEditing} value={String(editorContent.buttonText)} onChange={(buttonText) => updateContent({ buttonText })} />
        </a>
      </div>
    </section>
        );
      }}
    </AdminEditableSection>
  );
}