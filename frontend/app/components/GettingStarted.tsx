"use client";

import store from "../Images/store.png";
import AdminEditableSection, { EditableImage } from "./AdminEditableSection";
import { EditableContent } from "./CMS";
import { usePageComponentContent } from "../lib/pageContent";
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
        const arGs = translations.ar.gettingStarted;
        const arSteps = arGs.steps as Step[];

        return (
    <section className="getting-started">
      <div className="getting-started__hero">
        <EditableContent as="p" plain defaultClass="section-kicker" contentId="home.gettingStarted.kicker" fallback={String(editorContent.kicker)} fallbackAr={arGs.kicker} />
        <div className="getting-started__cards">
          {stepItems.map((step, index) => (
            <article className="getting-started__card" key={index}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <EditableContent as="h2" plain contentId={`home.gettingStarted.step${index}.title`} fallback={step.title} fallbackAr={arSteps[index]?.title} />
              <EditableContent as="p" plain contentId={`home.gettingStarted.step${index}.text`} fallback={step.text} fallbackAr={arSteps[index]?.text} />
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
        <EditableContent as="h2" plain contentId="home.gettingStarted.title" fallback={String(editorContent.title)} fallbackAr={arGs.title} />
        <EditableContent as="h3" plain contentId="home.gettingStarted.subtitle" fallback={String(editorContent.subtitle)} fallbackAr={arGs.subtitle} />
        <EditableContent as="p" plain contentId="home.gettingStarted.text" fallback={String(editorContent.text)} fallbackAr={arGs.text} />
        <a href="/contact-us">
          <EditableContent as="span" plain contentId="home.gettingStarted.buttonText" fallback={String(editorContent.buttonText)} fallbackAr={arGs.buttonText} />
        </a>
      </div>
    </section>
        );
      }}
    </AdminEditableSection>
  );
}
