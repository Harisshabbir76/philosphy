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
      html: `<p>A personalized in-home experience designed to identify the colors that naturally enhance your features. Through a guided session, we analyze how different tones interact with your skin, hair, and overall presence to define your undertone and color season—giving you clarity and confidence in your styling choices.</p>
<strong>Before the session:</strong>
<ul><li>Scheduled appointment (date &amp; time agreed in advance)</li><li>Home visit (external location can be arranged if needed, venue cost covered by client)</li></ul>
<strong>During the session:</strong>
<ul><li>Full color analysis using professional tools (mirror, drape, lighting, color kit)</li><li>Observation of how colors interact with your natural features</li><li>Comparison of shades and their effect on your skin</li><li>Exploration of suitable hair color options</li><li>Identification of:<ul class="analysis-service__dash-list"><li>Undertone</li><li>Most harmonious color palette</li><li>Your color season</li></ul></li></ul>
<strong>After the session:</strong>
<ul><li>Personal color fan with your best shades (provided immediately)</li><li>Detailed PDF report (within 10–15 working days), including:<ul class="analysis-service__dash-list"><li>Understanding your color season</li><li>How to dress based on your season and contrast</li><li>Color coordination principles</li><li>Suitable fabric colors</li><li>Guidance for traditional wear (e.g. mukhawar), if relevant</li><li>Jewelry selection and color pairing</li><li>Recommended hair color options</li></ul></li></ul>
<p class="analysis-service__price">PRICE: 1880 AED</p>
<a href="/booking" class="analysis-service__button">BOOK YOUR CONSULTATION NOW</a>`,
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
      html: `<p>تجربة منزلية شخصية مصمّمة لتحديد الألوان التي تُبرز ملامحك بشكل طبيعي. من خلال جلسة موجَّهة، نحلّل كيف تتفاعل الدرجات المختلفة مع بشرتك وشعرك وحضورك العام لتحديد درجة لونك الأساسية وفصلك اللوني—ما يمنحك وضوحاً وثقة في خياراتك التنسيقية.</p>
<strong>قبل الجلسة:</strong>
<ul><li>موعد محدد (يُتفق على التاريخ والوقت مسبقاً)</li><li>زيارة منزلية (يمكن ترتيب موقع خارجي عند الحاجة، مع تحمّل العميلة لتكلفة المكان)</li></ul>
<strong>أثناء الجلسة:</strong>
<ul><li>تحليل لوني كامل باستخدام أدوات احترافية (مرآة، أقمشة، إضاءة، عدة ألوان)</li><li>ملاحظة كيفية تفاعل الألوان مع ملامحك الطبيعية</li><li>مقارنة الدرجات وتأثيرها على بشرتك</li><li>استكشاف خيارات ألوان الشعر المناسبة</li><li>تحديد:<ul class="analysis-service__dash-list"><li>درجة اللون الأساسية</li><li>أكثر لوحة ألوان تناسقاً</li><li>فصلك اللوني</li></ul></li></ul>
<strong>بعد الجلسة:</strong>
<ul><li>مروحة ألوان شخصية بأفضل درجاتك (تُقدَّم فوراً)</li><li>تقرير PDF مفصّل (خلال 10–15 يوم عمل)، يتضمّن:<ul class="analysis-service__dash-list"><li>فهم فصلك اللوني</li><li>كيفية اختيار ملابسك بناءً على فصلك ودرجة التباين</li><li>مبادئ تنسيق الألوان</li><li>ألوان الأقمشة المناسبة</li><li>إرشادات للزي التقليدي (مثل المخوّر) عند الحاجة</li><li>اختيار المجوهرات وتنسيق الألوان</li><li>خيارات ألوان الشعر الموصى بها</li></ul></li></ul>
<p class="analysis-service__price">السعر: 1880 درهم</p>
<a href="/booking" class="analysis-service__button">احجزي استشارتك الآن</a>`,
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
