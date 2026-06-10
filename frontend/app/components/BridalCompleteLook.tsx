"use client";

import bridalCompleteImage from "../Images/bridal2.png";
import AdminEditableSection, { EditableImage } from "./AdminEditableSection";
import { EditableContent } from "./CMS";
import { usePageComponentContent } from "../lib/pageContent";
import { useLanguage } from "../lib/LanguageContext";
import { translations } from "../lib/translations";
import "../Styles/BridalCompleteLook.css";

const defaults = {
  imageUrl: "",
  eyebrow: "THE COMPLETE BRIDAL WEDDING LOOK",
  title: "Your wedding look, styled with complete professional precision.",
  introHtml: `<p>A private, high-end bridal styling experience designed to curate the bride's complete wedding look with elegance, precision, and personal direction. Every detail is thoughtfully considered to create a cohesive bridal aesthetic that reflects the bride's personality, lifestyle, and unique vision.</p>
<p>The experience begins with a dedicated home consultation to understand the bride's aesthetic direction, followed by an in-depth seasonal color analysis to identify the most harmonious and flattering color palette. Detailed body shape and facial feature analysis are also conducted to define the most suitable silhouettes, cuts, and styling details.</p>
<p>A personalized shopping and styling direction plan is then created to guide all bridal wardrobe and styling decisions throughout the journey.</p>`,
  leftHtml: `<h3>Inclusions:</h3>
<ul class="bridal-complete__list">
<li>Dedicated home consultation</li>
<li>Seasonal color analysis</li>
<li>Body shape and facial feature analysis</li>
<li>Personalized bridal styling direction plan</li>
<li>Organization and scheduling of bridal shopping and wedding dress fitting sessions</li>
<li>Accompanied wedding dress shopping sessions with expert styling guidance</li>
</ul>
<h3>Full bridal look curation includes:</h3>
<ul class="bridal-complete__list">
<li>Wedding dress</li>
<li>Veil</li>
<li>Hair accessories</li>
<li>Jewelry</li>
<li>Bouquet styling</li>
<li>Makeup direction aligned with the bride's color season</li>
<li>Hairstyle recommendations tailored to facial structure and overall aesthetic</li>
</ul>
<h3>Additional inclusions:</h3>
<ul class="bridal-complete__list">
<li>Support in selecting and coordinating hair and makeup artists</li>
<li>Creation of an elegant Mood Board to visually communicate the bridal vision to the beauty team</li>
<li>Final curated bridal presentation (approx. 10 slides) summarizing the complete head-to-toe wedding look as a reference for the wedding day</li>
</ul>`,
  rightHtml: `<h3>Service Structure</h3>
<ul class="bridal-complete__list">
<li>Includes up to 7 styling and shopping sessions distributed throughout the preparation journey</li>
<li>Additional days beyond the 15-day structure are charged at 300 AED per day</li>
<li>Continuous stylist support from the first consultation until the wedding day</li>
<li>Final pre-wedding virtual consultation to review all details and finalize styling decisions</li>
</ul>
<h3>Optional Wedding Day Service</h3>
<p>Available upon request and may include:</p>
<ul class="bridal-complete__list">
<li>Walking coaching</li>
<li>Entrance styling</li>
<li>Outfit assistance</li>
<li>Jewelry dressing</li>
<li>Final look coordination before the bride's appearance</li>
<li>Additional styling services are also available for post-wedding events, after-party looks, or up to 5 additional curated outfits if completed ahead of schedule.</li>
</ul>
<h3>Price</h3>
<p>4000 AED</p>
<a href="/booking" class="bridal-complete__button">BOOK YOUR CONSULTATION NOW</a>`,
};

const defaultsAr = {
  eyebrow: "إطلالة العروس الكاملة ليوم الزفاف",
  title: "إطلالة زفافك، منسّقة بدقة احترافية كاملة.",
  introHtml: `<p>تجربة تنسيق راقية وخاصة للعروس، مصمّمة لتنسيق إطلالة الزفاف الكاملة بأناقة ودقة وتوجيه شخصي. تُدرَس كل تفصيلة بعناية لخلق جمالية عروس متناسقة تعكس شخصية العروس ونمط حياتها ورؤيتها الفريدة.</p>
<p>تبدأ التجربة باستشارة منزلية مخصصة لفهم الاتجاه الجمالي للعروس، يتبعها تحليل معمّق لفصول الألوان لتحديد لوحة الألوان الأكثر تناغماً وإطراءً. كما يُجرى تحليل مفصّل لشكل الجسم وملامح الوجه لتحديد الصور الظلية والقصّات وتفاصيل التنسيق الأنسب.</p>
<p>ثم تُوضَع خطة شخصية للتسوّق وتوجيه التنسيق لإرشاد جميع قرارات خزانة وإطلالات الزفاف طوال الرحلة.</p>`,
  leftHtml: `<h3>تشمل:</h3>
<ul class="bridal-complete__list">
<li>استشارة منزلية مخصصة</li>
<li>تحليل فصول الألوان</li>
<li>تحليل شكل الجسم وملامح الوجه</li>
<li>خطة شخصية لتوجيه تنسيق العروس</li>
<li>تنظيم وجدولة جلسات تسوّق العروس وقياس فستان الزفاف</li>
<li>مرافقة في جلسات تسوّق فستان الزفاف مع إرشاد احترافي للتنسيق</li>
</ul>
<h3>يشمل تنسيق إطلالة العروس الكاملة:</h3>
<ul class="bridal-complete__list">
<li>فستان الزفاف</li>
<li>الطرحة</li>
<li>إكسسوارات الشعر</li>
<li>المجوهرات</li>
<li>تنسيق باقة الورد</li>
<li>توجيه المكياج بما يتوافق مع فصل ألوان العروس</li>
<li>توصيات تصفيفة الشعر المناسبة لملامح الوجه والمظهر العام</li>
</ul>
<h3>إضافات تشمل:</h3>
<ul class="bridal-complete__list">
<li>الدعم في اختيار وتنسيق خبراء الشعر والمكياج</li>
<li>إنشاء لوحة إلهام أنيقة لإيصال رؤية العروس بصرياً إلى فريق التجميل</li>
<li>عرض تقديمي نهائي منسّق للعروس (حوالي 10 شرائح) يلخّص إطلالة الزفاف الكاملة من الرأس إلى القدم كمرجع ليوم الزفاف</li>
</ul>`,
  rightHtml: `<h3>هيكل الخدمة</h3>
<ul class="bridal-complete__list">
<li>يشمل ما يصل إلى 7 جلسات تنسيق وتسوّق موزّعة على مدار رحلة التحضير</li>
<li>تُحتسب الأيام الإضافية بعد هيكل الـ15 يوماً بمبلغ 300 درهم لليوم</li>
<li>دعم مستمر من المنسّقة من أول استشارة وحتى يوم الزفاف</li>
<li>استشارة افتراضية نهائية قبل الزفاف لمراجعة جميع التفاصيل وإنهاء قرارات التنسيق</li>
</ul>
<h3>خدمة يوم الزفاف الاختيارية</h3>
<p>متاحة عند الطلب وقد تشمل:</p>
<ul class="bridal-complete__list">
<li>تدريب على المشي</li>
<li>تنسيق الدخول</li>
<li>المساعدة في ارتداء الإطلالة</li>
<li>تنسيق ارتداء المجوهرات</li>
<li>تنسيق الإطلالة النهائية قبل ظهور العروس</li>
<li>تتوفّر أيضاً خدمات تنسيق إضافية لفعاليات ما بعد الزفاف وإطلالات الحفلات اللاحقة، أو ما يصل إلى 5 إطلالات منسّقة إضافية في حال الانتهاء قبل الموعد.</li>
</ul>
<h3>السعر</h3>
<p>4000 درهم</p>
<a href="/booking" class="bridal-complete__button">احجزي استشارتك الآن</a>`,
};

export default function BridalCompleteLook({ editable = false }: { editable?: boolean }) {
  const { content, saveContent, isSaving, error } = usePageComponentContent("bridal", "completeLook", defaults);
  const { language } = useLanguage();
  const t = translations[language].bridalCompleteLook;

  return (
    <AdminEditableSection content={content} editable={editable} error={error} isSaving={isSaving} title="Complete bridal look" onSave={saveContent}>
      {({ content: editorContent, isEditing, updateContent }) => (
      <section className="bridal-complete">
        <div className="bridal-complete__inner">
          <div className="bridal-complete__intro">
            <EditableContent as="p" plain defaultClass="bridal-complete__eyebrow" contentId="bridal.completeLook.eyebrow" fallback={defaults.eyebrow} fallbackAr={defaultsAr.eyebrow} />
            <EditableContent as="h2" plain contentId="bridal.completeLook.title" fallback={defaults.title} fallbackAr={defaultsAr.title} />
            <EditableContent as="div" contentId="bridal.completeLook.introHtml" fallback={defaults.introHtml} fallbackAr={defaultsAr.introHtml} />
          </div>

          <div className="bridal-complete__image">
            <EditableImage src={String(editorContent.imageUrl) || bridalCompleteImage} alt="Bride standing before a wedding stage" fill sizes="(max-width: 900px) 100vw, 1300px" isEditing={isEditing} onChange={(imageUrl) => updateContent({ imageUrl })} />
          </div>

          <div className="bridal-complete__details">
            <EditableContent as="div" defaultClass="bridal-complete__column bridal-complete__column--right" contentId="bridal.completeLook.leftHtml" fallback={defaults.leftHtml} fallbackAr={defaultsAr.leftHtml} />
            <div className="bridal-complete__divider" aria-hidden="true" />
            <EditableContent as="div" defaultClass="bridal-complete__column" contentId="bridal.completeLook.rightHtml" fallback={defaults.rightHtml} fallbackAr={defaultsAr.rightHtml} />
          </div>
        </div>
      </section>
      )}
    </AdminEditableSection>
  );
}
