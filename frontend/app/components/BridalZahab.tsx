"use client";

import bridalZahabImage from "../Images/bridal3.jpeg";
import AdminEditableSection, { EditableImage, type ImageStyleData } from "./AdminEditableSection";
import { EditableContent } from "./CMS";
import { usePageComponentContent } from "../lib/pageContent";
import { useLanguage } from "../lib/LanguageContext";
import { translations } from "../lib/translations";
import "../Styles/BridalZahab.css";

const defaults = {
  imageUrl: "",
  imageStyle: {} as ImageStyleData,
  title: "BRIDAL DOWRY STYLING EXPERIENCE – ZHAB",
  html: `<p>Your elegance is built on structure, not guesswork.</p>
<p>A professional personal shopping experience designed for brides who want to build their trousseau in a refined, intentional, and fully structured way. The service focuses on selecting every piece with purpose, ensuring the entire zhab feels cohesive, elegant, and aligned with the bride's personal style and lifestyle.</p>
<p>Before any shopping begins, the experience is built around understanding the bride through seasonal color analysis, body shape analysis, and facial feature assessment to ensure every styling decision feels harmonious and flattering.</p>
<a href="/booking" class="bridal-zahab__button">BOOK YOUR CONSULTATION NOW</a>`,
  packageItems: ["SERVICE PROCESS", "BASIC FOUNDATION PACKAGE", "ESSENTIAL ZHAB PACKAGE", "COMPLETE BRIDAL ZHAB PACKAGE"],
  packageDescription: "A structured bridal shopping path tailored to the bride's preparation needs.",
};

const defaultsAr = {
  title: "تجربة تنسيق جهاز العروس – زهاب",
  html: `<p>أناقتك مبنية على هيكل واضح، لا على التخمين.</p>
<p>تجربة تسوّق شخصية احترافية مصمّمة للعرائس اللواتي يرغبن في بناء جهازهن بطريقة راقية ومدروسة ومنظّمة بالكامل. تركّز الخدمة على اختيار كل قطعة بهدف، لضمان أن يكون الزهاب بأكمله متناسقاً وأنيقاً ومتوافقاً مع أسلوب العروس الشخصي ونمط حياتها.</p>
<p>قبل بدء أي تسوّق، تُبنى التجربة على فهم العروس من خلال تحليل فصول الألوان وتحليل شكل الجسم وتقييم ملامح الوجه لضمان أن يكون كل قرار تنسيقي متناغماً ومُطرياً.</p>
<a href="/booking" class="bridal-zahab__button">احجزي استشارتك الآن</a>`,
  packageItems: ["خطوات الخدمة", "الباقة الأساسية", "باقة زهاب الأساسية", "باقة زهاب العروس الكاملة"],
  packageDescription: "مسار تسوّق منظّم للعروس مصمّم وفق احتياجات تحضيرها.",
};

export default function BridalZahab({ editable = false }: { editable?: boolean }) {
  const { content, saveContent, isSaving, error } = usePageComponentContent("bridal", "zahab", defaults);
  const { language } = useLanguage();
  const t = translations[language].bridalZahab;

  return (
    <AdminEditableSection content={content} editable={editable} error={error} isSaving={isSaving} title="Bridal zahab" onSave={saveContent}>
      {({ content: editorContent, isEditing, updateContent }) => {
        return (
      <section className="bridal-zahab">
        <div className="bridal-zahab__inner">
          <div className="bridal-zahab__copy">
            <EditableContent as="h2" plain contentId="bridal.zahab.title" fallback={defaults.title} fallbackAr={defaultsAr.title} />
            <EditableContent as="div" contentId="bridal.zahab.html" fallback={defaults.html} fallbackAr={defaultsAr.html} />

            <div className="bridal-zahab__list">
              {defaults.packageItems.map((item, index) => (
                <details className="bridal-zahab__item" name="bridal-zahab" key={index}>
                  <summary>
                    <EditableContent as="span" plain contentId={`bridal.zahab.package${index}.title`} fallback={item} fallbackAr={defaultsAr.packageItems[index]} />
                    <span className="bridal-zahab__mark" aria-hidden="true" />
                  </summary>
                  <div className="bridal-zahab__content">
                    <EditableContent as="p" plain contentId={`bridal.zahab.package${index}.description`} fallback={defaults.packageDescription} fallbackAr={defaultsAr.packageDescription} />
                  </div>
                </details>
              ))}
            </div>
          </div>

          <div className="bridal-zahab__image">
            <EditableImage src={String(editorContent.imageUrl) || bridalZahabImage} alt="Bride standing in a softly lit entrance" fill sizes="385px" isEditing={isEditing} onChange={(imageUrl) => updateContent({ imageUrl })} imageStyle={editorContent.imageStyle as ImageStyleData | undefined} />
          </div>
        </div>
      </section>
        );
      }}
    </AdminEditableSection>
  );
}
