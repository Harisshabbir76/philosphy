"use client";

import Link from "next/link";
import servicesWoman from "../Images/services-woman.webp";
import AdminEditableSection, { EditableImage } from "./AdminEditableSection";
import { EditableContent } from "./CMS";
import { usePageComponentContent } from "../lib/pageContent";
import { translations } from "../lib/translations";
import "../Styles/ServicesSection.css";

const services = ["ANALYSIS", "WARDROBE", "PERSONAL SHOPPING", "BRIDAL"];

const defaults = {
  imageUrl: "",
  title: "Our Services",
  text:
    "Each service is designed with intention to bring clarity, refinement, and ease into your personal style journey, whether through a complete transformation or subtle guidance, we thoughtfully consider your lifestyle, preferences, and goals to curate what truly belongs, focusing not on excess but on meaningful choices that create a wardrobe and presence that feel effortless, aligned, and timeless.",
  buttonText: "BOOK YOUR CONSULTATION NOW",
  services,
};

export default function ServicesSection({ editable = false }: { editable?: boolean }) {
  const { content, saveContent, isSaving, error } = usePageComponentContent("home", "services", defaults);

  return (
    <AdminEditableSection
      content={content}
      editable={editable}
      error={error}
      isSaving={isSaving}
      title="Home services"
      onSave={saveContent}
    >
      {({ content: editorContent, isEditing, updateContent }) => {
        const serviceItems = (Array.isArray(editorContent.services) ? editorContent.services : services) as string[];
        const arServices = (translations.ar.services.services as string[]) || services;

        return (
    <section className="services-section">
      <div className="services-section__inner">
        <div className="services-section__content">
          <EditableContent as="h2" plain contentId="home.services.title" fallback={String(editorContent.title)} fallbackAr={translations.ar.services.title} />
          <EditableContent as="p" plain contentId="home.services.text" fallback={String(editorContent.text)} fallbackAr={translations.ar.services.text} />
          <Link href="/booking" className="philosophy-button philosophy-button--light">
            <EditableContent as="span" plain contentId="home.services.buttonText" fallback={String(editorContent.buttonText)} fallbackAr={translations.ar.services.buttonText} />
          </Link>

          <div className="services-section__list">
            {serviceItems.map((service, index) => (
              <div className="services-section__row" key={index}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <EditableContent as="span" plain contentId={`home.services.item${index}`} fallback={service} fallbackAr={arServices[index]} />
              </div>
            ))}
          </div>
        </div>
        <div className="services-section__image">
          <EditableImage
            src={String(editorContent.imageUrl) || servicesWoman}
            alt="Woman overlooking a lake"
            fill
            sizes="(max-width: 760px) 100vw, (max-width: 1024px) 360px, 430px"
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
