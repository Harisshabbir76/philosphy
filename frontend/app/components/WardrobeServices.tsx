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
      html: `<p>A personalized wardrobe refinement experience designed to help you understand what you already own and what truly works for you. Through a guided session in your home, we assess your pieces, refine your choices, and transform your wardrobe into a more functional, organized, and wearable system tailored to your lifestyle.</p>
<strong>Before the session:</strong>
<ul><li>Scheduled home visit to your wardrobe</li></ul>
<strong>During the session:</strong>
<ul><li>Full wardrobe review and refinement process</li><li>Guidance on understanding your existing cuts and styles</li><li>Identification of what suits you and what doesn't based on:<ul class="wardrobe-analysis__dash-list"><li>Cuts</li><li>Colors</li></ul></li><li>Body measurements taken</li><li>Quick color test (general indication, not a full color analysis)</li></ul>
<strong>After &amp; within the session:</strong>
<ul><li>Review of suitable pieces that may need alterations</li><li>Suggestions on how to repair and adjust clothing for better use</li><li>Creation of new outfit combinations from existing pieces</li><li>List of missing items and wardrobe needs</li><li>Guidance on what to let go of</li><li>Support with decluttering (using bags or boxes)</li><li>Practical guidance on how to organize your wardrobe efficiently</li></ul>
<p>Every wardrobe is unique, so the system is tailored specifically to your needs.</p>
<p class="wardrobe-analysis__price">PRICE:<br />Abu Dhabi: 500 AED per hour<br />Other Emirates &amp; Cities: 650 AED per hour<br />Minimum booking: 3 hours</p>`,
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
      html: `<p>تجربة شخصية لتحسين خزانة ملابسك مصمّمة لمساعدتك على فهم ما تملكينه فعلاً وما يناسبك حقاً. من خلال جلسة موجَّهة في منزلك، نقيّم قطعك، ونحسّن خياراتك، ونحوّل خزانتك إلى نظام أكثر عملية وتنظيماً وقابلية للارتداء يناسب أسلوب حياتك.</p>
<strong>قبل الجلسة:</strong>
<ul><li>زيارة منزلية مجدولة إلى خزانة ملابسك</li></ul>
<strong>أثناء الجلسة:</strong>
<ul><li>مراجعة شاملة للخزانة وعملية تحسينها</li><li>إرشاد لفهم القصّات والأنماط الموجودة لديك</li><li>تحديد ما يناسبك وما لا يناسبك بناءً على:<ul class="wardrobe-analysis__dash-list"><li>القصّات</li><li>الألوان</li></ul></li><li>أخذ قياسات الجسم</li><li>اختبار لوني سريع (إشارة عامة، وليس تحليلاً لونياً كاملاً)</li></ul>
<strong>بعد وأثناء الجلسة:</strong>
<ul><li>مراجعة القطع المناسبة التي قد تحتاج إلى تعديلات</li><li>اقتراحات حول كيفية إصلاح الملابس وتعديلها للاستفادة منها بشكل أفضل</li><li>ابتكار تنسيقات جديدة من القطع الموجودة</li><li>قائمة بالقطع الناقصة واحتياجات الخزانة</li><li>إرشاد حول ما يجب الاستغناء عنه</li><li>المساعدة في التخلص من الفوضى (باستخدام أكياس أو صناديق)</li><li>إرشاد عملي حول كيفية تنظيم خزانتك بكفاءة</li></ul>
<p>كل خزانة فريدة، لذا يُصمَّم النظام خصيصاً ليناسب احتياجاتك.</p>
<p class="wardrobe-analysis__price">السعر:<br />أبوظبي: 500 درهم في الساعة<br />الإمارات والمدن الأخرى: 650 درهم في الساعة<br />الحد الأدنى للحجز: 3 ساعات</p>
<a href="/booking" class="wardrobe-analysis__button">احجزي استشارتك الآن</a>`,
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
