"use client";

import analysisWoman from "../Images/Analysis-woman.jpg";
import AdminEditableSection, { EditableImage, type ImageStyleData } from "./AdminEditableSection";
import { EditableContent } from "./CMS";
import { usePageComponentContent } from "../lib/pageContent";
import { useLanguage } from "../lib/LanguageContext";
import { translations } from "../lib/translations";
import "../Styles/AnalysisServices.css";

const defaults = {
  imageUrl: "",
  imageStyle: {} as ImageStyleData,
  items: [
    {
      title: "COLOR SEASON ANALYSIS",
      html: `<p>A personalized in-home experience designed to identify the colors that naturally enhance your features.</p><p class="analysis-service__price">PRICE: 1880 AED</p><a href='/booking' class="analysis-service__button">BOOK YOUR CONSULTATION NOW</a>`,
    },
    {
      title: "BODY, FACE & STYLE ANALYSIS",
      html: `<p>A thoughtful study of your proportions, features, and style direction to help you choose silhouettes, details, and outfits with ease.</p>`,
    },
    {
      title: "PERSONAL IMAGE ANALYSIS (COMBINED SERVICE)",
      html: `<p>A complete analysis experience combining color, body, face, and personal style guidance for a more refined image direction.</p>`,
    },
  ],
};

const defaultsAr = {
  items: [
    {
      title: "تحليل فصل الألوان",
      html: `<p>تجربة منزلية شخصية مصمّمة لتحديد الألوان التي تُبرز ملامحك بشكل طبيعي.</p><p class="analysis-service__price">السعر: 1880 درهم</p><a href='/booking' class="analysis-service__button">احجزي استشارتك الآن</a>`,
    },
    {
      title: "تحليل الجسم والوجه والأسلوب",
      html: `<p>دراسة مدروسة لتناسبات جسمك وملامحك واتجاه أسلوبك لمساعدتك على اختيار الصور الظلية والتفاصيل والإطلالات بسهولة.</p>`,
    },
    {
      title: "تحليل الصورة الشخصية (خدمة مدمجة)",
      html: `<p>تجربة تحليل كاملة تجمع بين توجيه الألوان والجسم والوجه والأسلوب الشخصي للحصول على اتجاه أكثر رقياً لصورتك.</p>`,
    },
  ],
};

type ServiceItem = {
  title: string;
  html: string;
};

export default function AnalysisServices({ editable = false }: { editable?: boolean }) {
  const { content, saveContent, isSaving, error } = usePageComponentContent("analysis", "services", defaults);
  const { language } = useLanguage();
  const t = translations[language].analysisServices;

  return (
    <AdminEditableSection content={content} editable={editable} error={error} isSaving={isSaving} title="Analysis services" onSave={saveContent}>
      {({ content: editorContent, isEditing, updateContent }) => {
        const displayItems = defaults.items as ServiceItem[];

        return (
      <section className="analysis-services">
        <div className="analysis-services__inner">
          <div className="analysis-services__copy">
            {displayItems.map((item, index) => (
              <details className="analysis-service" name="analysis-services" key={index}>
                <summary>
                  <EditableContent as="span" plain contentId={`analysis.services.item${index}.title`} fallback={item.title} fallbackAr={defaultsAr.items[index]?.title} />
                  <span className="analysis-service__mark" aria-hidden="true" />
                </summary>
                <EditableContent
                  as="div"
                  defaultClass="analysis-service__content"
                  contentId={`analysis.services.item${index}.html`}
                  fallback={item.html}
                  fallbackAr={defaultsAr.items[index]?.html}
                />
              </details>
            ))}
          </div>

          <div className="analysis-services__image">
            <EditableImage
              src={String(editorContent.imageUrl) || analysisWoman}
              alt="Woman wearing a white draped outfit"
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
