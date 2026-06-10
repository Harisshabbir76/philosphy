"use client";

import AdminEditableSection from "./AdminEditableSection";
import { EditableContent } from "./CMS";
import { usePageComponentContent } from "../lib/pageContent";
import { useLanguage } from "../lib/LanguageContext";
import { translations } from "../lib/translations";
import "../Styles/BridalConcierge.css";

const defaults = {
  eyebrow: "ADD-ON SERVICE",
  title: "NEED EXTRA HELP ON YOUR WEDDING DAY?",
  subtitle: "Bridal Concierge",
  html: `<p>Enhance your bridal experience with our Bridal Concierge Add-On, a personalized support service designed to ensure every detail comes together flawlessly on your special day.</p>
<p>On the wedding day, we are there to oversee the final touches, ensure everything looks polished and cohesive, assist with styling adjustments, and provide seamless support throughout the occasion so you can feel confident, relaxed, and fully present in every moment.</p>
<p class="bridal-concierge__price">Price: 1200 AED</p>
<a href="/booking" class="bridal-concierge__button">BOOK YOUR CONSULTATION NOW</a>`,
};

const defaultsAr = {
  eyebrow: "خدمة إضافية",
  title: "هل تحتاجين إلى مساعدة إضافية في يوم زفافك؟",
  subtitle: "كونسيرج العروس",
  html: `<p>عزّزي تجربتك كعروس مع خدمة كونسيرج العروس الإضافية، وهي خدمة دعم شخصية مصمّمة لضمان أن تتكامل كل تفصيلة بسلاسة في يومك المميّز.</p>
<p>في يوم الزفاف، نكون حاضرات للإشراف على اللمسات الأخيرة، وضمان أن تبدو كل التفاصيل متناسقة وأنيقة، والمساعدة في تعديلات التنسيق، وتقديم دعم سلس طوال المناسبة لتشعري بالثقة والراحة والحضور الكامل في كل لحظة.</p>
<p class="bridal-concierge__price">السعر: 1200 درهم</p>
<a href="/booking" class="bridal-concierge__button">احجزي استشارتك الآن</a>`,
};

export default function BridalConcierge({ editable = false }: { editable?: boolean }) {
  const { content, saveContent, isSaving, error } = usePageComponentContent("bridal", "concierge", defaults);
  const { language } = useLanguage();
  const t = translations[language].bridalConcierge;

  return (
    <AdminEditableSection content={content} editable={editable} error={error} isSaving={isSaving} title="Bridal concierge" onSave={saveContent}>
      {() => (
      <section className="bridal-concierge">
        <div className="bridal-concierge__inner">
          <EditableContent as="p" plain defaultClass="bridal-concierge__eyebrow" contentId="bridal.concierge.eyebrow" fallback={defaults.eyebrow} fallbackAr={defaultsAr.eyebrow} />
          <EditableContent as="h2" plain contentId="bridal.concierge.title" fallback={defaults.title} fallbackAr={defaultsAr.title} />
          <EditableContent as="h3" plain contentId="bridal.concierge.subtitle" fallback={defaults.subtitle} fallbackAr={defaultsAr.subtitle} />
          <EditableContent as="div" contentId="bridal.concierge.html" fallback={defaults.html} fallbackAr={defaultsAr.html} />
        </div>
      </section>
      )}
    </AdminEditableSection>
  );
}
