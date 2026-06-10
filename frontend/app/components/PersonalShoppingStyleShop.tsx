"use client";

import womensImage from "../Images/ps-womens.png";
import AdminEditableSection, { EditableImage, type ImageStyleData } from "./AdminEditableSection";
import { EditableContent } from "./CMS";
import { usePageComponentContent } from "../lib/pageContent";
import { useLanguage } from "../lib/LanguageContext";
import { translations } from "../lib/translations";
import "../Styles/PersonalShoppingStyleShop.css";

const defaults = {
  imageUrl: "",
  imageStyle: {} as ImageStyleData,
  title: "STYLE & SHOP EXPERIENCE",
  html: `<p>Your elegance is built on structure, not guesswork.</p>
<p>A professional personal shopping experience designed for brides who want to build their trousseau in a refined, intentional, and fully structured way. The service begins with a complete understanding of the bride's personal image through seasonal color analysis, body shape analysis, and facial feature assessment before any shopping takes place.</p>
<p>The goal is to carefully curate every piece in a cohesive way that reflects the bride's personal style, lifestyle, and overall aesthetic direction.</p>
<a href="/booking" class="ps-style-shop__button">BOOK YOUR CONSULTATION NOW</a>`,
  packageItems: ["SERVICE PROCESS", "BASIC FOUNDATION PACKAGE", "ESSENTIAL STYLE & SHOP PACKAGE", "COMPLETE STYLE & SHOP PACKAGE"],
  packageDescription: "A refined consultation path created around your wardrobe needs, occasion plans, and styling direction.",
};

const defaultsAr = {
  title: "تجربة التنسيق والتسوّق",
  html: `<p>أناقتك مبنية على هيكل واضح، لا على التخمين.</p>
<p>تجربة تسوّق شخصية احترافية مصمّمة للعرائس اللواتي يرغبن في بناء جهازهن بطريقة راقية ومدروسة ومنظّمة بالكامل. تبدأ الخدمة بفهم كامل لصورة العروس الشخصية من خلال تحليل فصول الألوان وتحليل شكل الجسم وتقييم ملامح الوجه قبل بدء أي تسوّق.</p>
<p>الهدف هو تنسيق كل قطعة بعناية بطريقة متناسقة تعكس أسلوب العروس الشخصي ونمط حياتها واتجاهها الجمالي العام.</p>
<a href="/booking" class="ps-style-shop__button">احجزي استشارتك الآن</a>`,
  packageItems: ["خطوات الخدمة", "الباقة الأساسية", "باقة التنسيق والتسوّق الأساسية", "باقة التنسيق والتسوّق الكاملة"],
  packageDescription: "مسار استشاري راقٍ مصمّم حول احتياجات خزانتك وخطط مناسباتك واتجاه تنسيقك.",
};

export default function PersonalShoppingStyleShop({ editable = false }: { editable?: boolean }) {
  const { content, saveContent, isSaving, error } = usePageComponentContent("personal-shopping", "styleShop", defaults);
  const { language } = useLanguage();
  const t = translations[language].personalShoppingStyleShop;

  return (
    <AdminEditableSection content={content} editable={editable} error={error} isSaving={isSaving} title="Style and shop" onSave={saveContent}>
      {({ content: editorContent, isEditing, updateContent }) => {
        return (
      <section className="ps-style-shop">
        <div className="ps-style-shop__inner">
          <div className="ps-style-shop__copy">
            <EditableContent as="h2" plain contentId="personal-shopping.styleShop.title" fallback={defaults.title} fallbackAr={defaultsAr.title} />
            <EditableContent as="div" contentId="personal-shopping.styleShop.html" fallback={defaults.html} fallbackAr={defaultsAr.html} />

            <div className="ps-style-shop__list">
              {defaults.packageItems.map((item, index) => (
                <details className="ps-style-shop__item" name="ps-style-shop" key={index}>
                  <summary>
                    <EditableContent as="span" plain contentId={`personal-shopping.styleShop.package${index}.title`} fallback={item} fallbackAr={defaultsAr.packageItems[index]} />
                    <span className="ps-style-shop__mark" aria-hidden="true" />
                  </summary>
                  <div className="ps-style-shop__content">
                    <EditableContent as="p" plain contentId={`personal-shopping.styleShop.package${index}.description`} fallback={defaults.packageDescription} fallbackAr={defaultsAr.packageDescription} />
                  </div>
                </details>
              ))}
            </div>
          </div>

          <div className="ps-style-shop__image">
            <EditableImage src={String(editorContent.imageUrl) || womensImage} alt="Women browsing elegant wardrobe pieces" fill sizes="270px" isEditing={isEditing} onChange={(imageUrl) => updateContent({ imageUrl })} imageStyle={editorContent.imageStyle as ImageStyleData | undefined} />
          </div>
        </div>
      </section>
        );
      }}
    </AdminEditableSection>
  );
}
