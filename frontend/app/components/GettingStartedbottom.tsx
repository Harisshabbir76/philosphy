"use client";

import AdminEditableSection, { EditableText } from "./AdminEditableSection";
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
  kicker: "HOW TO GET STARTED",
  steps,
};

type Step = {
  title: string;
  text: string;
};

export default function GettingStarted({ editable = false }: { editable?: boolean }) {
  const { content, saveContent, isSaving, error } = usePageComponentContent("shared", "gettingStartedBottom", defaults);

  return (
    <AdminEditableSection
      content={content}
      editable={editable}
      error={error}
      isSaving={isSaving}
      title="Getting started bottom"
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
    </section>
        );
      }}
    </AdminEditableSection>
  );
}
