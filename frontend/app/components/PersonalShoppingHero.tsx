"use client";

import AdminEditableSection from "./AdminEditableSection";
import { EditableImage } from "./AdminEditableSection";
import { EditableContent } from "./CMS";
import { usePageComponentContent } from "../lib/pageContent";
import { useLanguage } from "../lib/LanguageContext";
import { translations } from "../lib/translations";
import personalShoppingHero from "../Images/ps-hero.png";
import "../Styles/PersonalShoppingHero.css";

const defaults = {
  imageUrl: "",
  title: "PERSONAL SHOPPING SERVICES",
};

export default function PersonalShoppingHero({ editable = false }: { editable?: boolean }) {
  const { content, saveContent, isSaving, error } = usePageComponentContent("personal-shopping", "hero", defaults);
  const { language } = useLanguage();
  const t = translations[language].personalShoppingHero;

  return (
    <AdminEditableSection content={content} editable={editable} error={error} isSaving={isSaving} title="Personal shopping hero" onSave={saveContent}>
      {({ content: editorContent, isEditing, updateContent }) => (
      <section className="personal-shopping-hero" aria-label="Personal shopping services">
        <EditableImage src={String(editorContent.imageUrl) || personalShoppingHero} alt="" fill sizes="100vw" priority={true} isEditing={isEditing} onChange={(imageUrl) => updateContent({ imageUrl })} />
        <div className="personal-shopping-hero__shade" />
        <EditableContent as="h1" plain contentId="personal-shopping.hero.title" fallback={defaults.title} fallbackAr="خدمات التسوّق الشخصي" />
      </section>
      )}
    </AdminEditableSection>
  );
}
