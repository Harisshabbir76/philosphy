"use client";

import analysisOne from "../Images/ps-analysis1.png";
import analysisTwo from "../Images/ps-analysis2.png";
import AdminEditableSection, { EditableImage } from "./AdminEditableSection";
import { EditableContent } from "./CMS";
import { usePageComponentContent } from "../lib/pageContent";
import { useLanguage } from "../lib/LanguageContext";
import { translations } from "../lib/translations";
import "../Styles/PersonalShoppingInPerson.css";

const defaults = {
  imageOneUrl: "",
  imageTwoUrl: "",
  title: "PERSONAL SHOPPING (IN-PERSON)",
  html: `<p>A personalized in-person shopping experience designed to make shopping more intentional, efficient, and aligned with your lifestyle. From selecting the right stores to curating complete outfits, every choice is guided by your body, personal style, and overall image goals—helping you build a wardrobe that truly works for you.</p>
<h3>Before the session:</h3>
<ul>
<li>Appointment booked in advance</li>
<li>Online consultation to understand:
<ul class="ps-in-person__dash-list">
<li>Your needs</li>
<li>Your expectations</li>
<li>Your shopping goals</li>
</ul>
</li>
<li>Selection of suitable shopping destinations and stores</li>
</ul>
<h3>On the shopping day:</h3>
<ul>
<li>In-person shopping session at the mall</li>
<li>Body measurements taken (for first-time clients)</li>
</ul>
<h3>During the session:</h3>
<ul>
<li>Personalized outfit selection and styling</li>
<li>Guidance based on:
<ul class="ps-in-person__dash-list">
<li>Body shape</li>
<li>Measurements</li>
<li>Personal style</li>
</ul>
</li>
<li>Color-focused shopping if your color season is already known</li>
<li>Optional quick color test if needed</li>
</ul>
<p>(Provides a general indication, but is less detailed than a full color season analysis)</p>
<p>The goal of the session is to simplify shopping, help you choose pieces that genuinely suit you, and create ready-to-wear looks tailored to your lifestyle.</p>
<p class="ps-in-person__price">PRICE:<br />1200 AED per shopping day<br />(Full day session from 10:00 AM – 7:00 PM)</p>
<a href="/booking" class="ps-in-person__button">BOOK YOUR CONSULTATION NOW</a>`,
};

const defaultsAr = {
  title: "التسوّق الشخصي (حضورياً)",
  html: `<p>تجربة تسوّق حضورية شخصية مصمّمة لجعل التسوّق أكثر تركيزاً وكفاءة وتوافقاً مع نمط حياتك. من اختيار المتاجر المناسبة إلى تنسيق إطلالات كاملة، يكون كل خيار موجَّهاً بجسمك وأسلوبك الشخصي وأهداف صورتك العامة — لمساعدتك على بناء خزانة ملابس تناسبك حقاً.</p>
<h3>قبل الجلسة:</h3>
<ul>
<li>حجز الموعد مسبقاً</li>
<li>استشارة عبر الإنترنت لفهم:
<ul class="ps-in-person__dash-list">
<li>احتياجاتك</li>
<li>توقّعاتك</li>
<li>أهداف تسوّقك</li>
</ul>
</li>
<li>اختيار وجهات ومتاجر التسوّق المناسبة</li>
</ul>
<h3>في يوم التسوّق:</h3>
<ul>
<li>جلسة تسوّق حضورية في المول</li>
<li>أخذ قياسات الجسم (للعميلات لأول مرة)</li>
</ul>
<h3>أثناء الجلسة:</h3>
<ul>
<li>اختيار وتنسيق إطلالات مخصصة</li>
<li>إرشاد مبني على:
<ul class="ps-in-person__dash-list">
<li>شكل الجسم</li>
<li>القياسات</li>
<li>الأسلوب الشخصي</li>
</ul>
</li>
<li>تسوّق يركّز على الألوان إذا كان فصل ألوانك معروفاً مسبقاً</li>
<li>اختبار ألوان سريع اختياري عند الحاجة</li>
</ul>
<p>(يوفّر إشارة عامة، لكنه أقل تفصيلاً من تحليل فصل الألوان الكامل)</p>
<p>الهدف من الجلسة هو تبسيط التسوّق، ومساعدتك على اختيار قطع تناسبك حقاً، وإنشاء إطلالات جاهزة للارتداء مصمّمة وفق نمط حياتك.</p>
<p class="ps-in-person__price">السعر:<br />1200 درهم في يوم التسوّق<br />(جلسة يوم كامل من 10:00 صباحاً – 7:00 مساءً)</p>
<a href="/booking" class="ps-in-person__button">احجزي استشارتك الآن</a>`,
};

export default function PersonalShoppingInPerson({ editable = false }: { editable?: boolean }) {
  const { content, saveContent, isSaving, error } = usePageComponentContent("personal-shopping", "inPerson", defaults);
  const { language } = useLanguage();
  const t = translations[language].personalShoppingInPerson;

  return (
    <AdminEditableSection content={content} editable={editable} error={error} isSaving={isSaving} title="In-person shopping" onSave={saveContent}>
      {({ content: editorContent, isEditing, updateContent }) => (
      <section className="ps-in-person">
        <div className="ps-in-person__inner">
          <div className="ps-in-person__copy">
            <EditableContent as="h2" plain contentId="personal-shopping.inPerson.title" fallback={defaults.title} fallbackAr={defaultsAr.title} />
            <EditableContent as="div" contentId="personal-shopping.inPerson.html" fallback={defaults.html} fallbackAr={defaultsAr.html} />
          </div>

          <div className="ps-in-person__images" aria-hidden="true">
            <div className="ps-in-person__image ps-in-person__image--large">
              <EditableImage src={String(editorContent.imageOneUrl) || analysisOne} alt="" fill sizes="400px" isEditing={isEditing} onChange={(imageOneUrl) => updateContent({ imageOneUrl })} />
            </div>
            <div className="ps-in-person__image ps-in-person__image--small">
              <EditableImage src={String(editorContent.imageTwoUrl) || analysisTwo} alt="" fill sizes="260px" isEditing={isEditing} onChange={(imageTwoUrl) => updateContent({ imageTwoUrl })} />
            </div>
          </div>
        </div>
      </section>
      )}
    </AdminEditableSection>
  );
}
