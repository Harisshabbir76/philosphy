"use client";

import wardrobeImage from "../Images/wardrobe2.png";
import AdminEditableSection, { EditableImage, type ImageStyleData } from "./AdminEditableSection";
import { EditableContent } from "./CMS";
import { usePageComponentContent } from "../lib/pageContent";
import { useLanguage } from "../lib/LanguageContext";
import { translations } from "../lib/translations";
import "../Styles/WardrobeServices.css";

const defaults = {
  imageUrl: "",
  imageStyle: {} as ImageStyleData,
  items: [
    {
      title: "CLOSET EDIT",
      html: `<p>A personalized wardrobe refinement experience.</p><p class="wardrobe-analysis__price">PRICE:<br />Abu Dhabi: 500 AED per hour<br />Other Emirates &amp; Cities: 650 AED per hour<br />Minimum booking: 3 hours</p><a href="/booking" class="wardrobe-analysis__button">BOOK YOUR CONSULTATION NOW</a>`,
    },
    {
      title: "STYLING & OUTFIT CURATION",
      html: `<p>A styling session focused on building complete outfits from your wardrobe.</p>`,
    },
  ],
};

const defaultsAr = {
  items: [
    {
      title: "تنظيم الخزانة",
      html: `<p>تجربة شخصية لتحسين خزانة ملابسك.</p><p class="wardrobe-analysis__price">السعر:<br />أبوظبي: 500 درهم في الساعة<br />الإمارات والمدن الأخرى: 650 درهم في الساعة<br />الحد الأدنى للحجز: 3 ساعات</p><a href="/booking" class="wardrobe-analysis__button">احجزي استشارتك الآن</a>`,
    },
    {
      title: "تنسيق الإطلالات",
      html: `<p>جلسة تنسيق تركّز على بناء إطلالات كاملة من خزانة ملابسك.</p>`,
    },
  ],
};

type WardrobeItem = {
  title: string;
  html: string;
};

export default function WardrobeAnalysis({ editable = false }: { editable?: boolean }) {
  const { content, saveContent, isSaving, error } = usePageComponentContent("wardrobe", "services", defaults);
  const { language } = useLanguage();
  const t = translations[language].wardrobeServices;

  return (
    <AdminEditableSection content={content} editable={editable} error={error} isSaving={isSaving} title="Wardrobe services" onSave={saveContent}>
      {({ content: editorContent, isEditing, updateContent }) => {
        const displayItems = defaults.items as WardrobeItem[];

        return (
      <section className="wardrobe-analysis">
        <div className="wardrobe-analysis__inner">
          <div className="wardrobe-analysis__copy">
            {displayItems.map((item, index) => (
              <details className="wardrobe-analysis__item" name="wardrobe-analysis" key={index}>
                <summary>
                  <EditableContent as="span" plain contentId={`wardrobe.services.item${index}.title`} fallback={item.title} fallbackAr={defaultsAr.items[index]?.title} />
                  <span className="wardrobe-analysis__mark" aria-hidden="true" />
                </summary>
                <EditableContent
                  as="div"
                  defaultClass="wardrobe-analysis__content"
                  contentId={`wardrobe.services.item${index}.html`}
                  fallback={item.html}
                  fallbackAr={defaultsAr.items[index]?.html}
                />
              </details>
            ))}
          </div>

          <div className="wardrobe-analysis__image">
            <EditableImage
              src={String(editorContent.imageUrl) || wardrobeImage}
              alt="Wardrobe styling detail with shoes and folded knitwear"
              fill
              sizes="240px"
              isEditing={isEditing}
              onChange={(imageUrl) => updateContent({ imageUrl })}
              imageStyle={editorContent.imageStyle as ImageStyleData | undefined}
            />
          </div>
        </div>
      </section>
        );
      }}
    </AdminEditableSection>
  );
}
