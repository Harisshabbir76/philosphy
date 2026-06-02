"use client";

import Link from "next/link";
import servicesWoman from "../Images/services-woman.jpg";
import AdminEditableSection, { EditableImage, EditableText } from "./AdminEditableSection";
import { usePageComponentContent } from "../lib/pageContent";
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
        const updateService = (index: number, value: string) => {
          updateContent((current) => {
            const currentServices = (Array.isArray(current.services) ? current.services : services) as string[];
            return { ...current, services: currentServices.map((item, itemIndex) => (itemIndex === index ? value : item)) };
          });
        };

        return (
    <section className="services-section">
      <div className="services-section__inner">
        <div className="services-section__content">
          <EditableText as="h2" isEditing={isEditing} value={String(editorContent.title)} onChange={(title) => updateContent({ title })} />
          <EditableText as="p" isEditing={isEditing} value={String(editorContent.text)} onChange={(text) => updateContent({ text })} />
          <Link href="/contact-us" className="philosophy-button philosophy-button--light">
            <EditableText isEditing={isEditing} value={String(editorContent.buttonText)} onChange={(buttonText) => updateContent({ buttonText })} />
          </Link>

          <div className="services-section__list">
            {serviceItems.map((service, index) => (
              <div className="services-section__row" key={service}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <EditableText isEditing={isEditing} value={service} onChange={(value) => updateService(index, value)} />
              </div>
            ))}
          </div>
        </div>
        <div className="services-section__image">
          <EditableImage
            src={String(editorContent.imageUrl) || servicesWoman}
            alt="Woman overlooking a lake"
            fill
            sizes="430px"
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
