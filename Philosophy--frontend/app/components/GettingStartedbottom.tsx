"use client";

import AdminEditableSection from "./AdminEditableSection";
import { EditableContent } from "./CMS";
import { usePageComponentContent } from "../lib/pageContent";
import { useLanguage } from "../lib/LanguageContext";
import { translations } from "../lib/translations";
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
  const { language } = useLanguage();
  const t = translations[language].gettingStarted;

  return (
    <AdminEditableSection
      content={content}
      editable={editable}
      error={error}
      isSaving={isSaving}
      title="Getting started bottom"
      onSave={saveContent}
    >
      {({ content: editorContent }) => {
        const stepItems = (Array.isArray(editorContent.steps) ? editorContent.steps : steps) as Step[];
        const displaySteps = stepItems;
        const arGs = translations.ar.gettingStarted;
        const arSteps = arGs.steps as Step[];

        return (
    <section className="getting-started">
      <div className="getting-started__hero">
        <EditableContent as="p" plain defaultClass="section-kicker" contentId="shared.gettingStartedBottom.kicker" fallback={String(editorContent.kicker)} fallbackAr={arGs.kicker} />
        <div className="getting-started__cards">
          {displaySteps.map((step, index) => (
            <article className="getting-started__card" key={index}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <EditableContent as="h2" plain contentId={`shared.gettingStartedBottom.step${index}.title`} fallback={step.title} fallbackAr={arSteps[index]?.title} />
              <EditableContent as="p" plain contentId={`shared.gettingStartedBottom.step${index}.text`} fallback={step.text} fallbackAr={arSteps[index]?.text} />
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
