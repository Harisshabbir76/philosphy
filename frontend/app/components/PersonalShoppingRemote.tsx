"use client";

import remoteImage from "../Images/ps3.jpeg";
import AdminEditableSection, { EditableImage } from "./AdminEditableSection";
import { EditableContent } from "./CMS";
import { usePageComponentContent } from "../lib/pageContent";
import { useLanguage } from "../lib/LanguageContext";
import { translations } from "../lib/translations";
import "../Styles/PersonalShoppingRemote.css";

const defaults = {
  imageUrl: "",
  title: "I SHOP 4 U – REMOTE PERSONAL SHOPPING SERVICE",
  tab: "Relax... I'll curate your style.",
  intro:
    "A fully personalized remote shopping experience where all pieces are carefully selected and purchased on your behalf based on your personal style, body shape, and seasonal color profile. Designed for clients who already have a clear understanding of their image foundations, this service offers a refined and effortless way to build cohesive everyday looks without the stress of shopping yourself.",
  html: `<p>The experience begins with an online consultation to understand your lifestyle, needs, priorities, and budget before curating pieces tailored specifically to you.</p>
<p>The service focuses on everyday lifestyle wardrobes, including:</p>
<ul class="ps-remote__bullet-list">
<li>Workwear</li>
<li>Travel outfits</li>
<li>Home elegance &amp; loungewear</li>
<li>Everyday casual looks</li>
</ul>
<p>All selected pieces are curated to feel cohesive, practical, and aligned with your personal style identity. Purchases may include clothing, abayas, modest fashion pieces, and selected beauty products when needed.</p>
<p>From sourcing and purchasing to arranging home delivery, the entire process is handled for you. At the end of the service, you receive a curated styling file showing all selected pieces styled into complete looks for effortless daily dressing.</p>
<p>Pricing</p>
<ul class="ps-remote__bullet-list">
<li>1–2 Looks: 1000 AED</li>
<li>3–5 Looks: 2000 AED</li>
<li>6–10 Looks: 3850 AED</li>
</ul>
<a href="/booking" class="ps-remote__button">BOOK YOUR CONSULTATION NOW</a>`,
};

const defaultsAr = {
  title: "أنا أتسوّق نيابةً عنكِ – خدمة التسوّق الشخصي عن بُعد",
  tab: "استرخي... سأنسّق أسلوبك.",
  intro:
    "تجربة تسوّق شخصية كاملة عن بُعد حيث تُختار جميع القطع وتُشترى نيابةً عنكِ بناءً على أسلوبك الشخصي وشكل جسمك وفصل ألوانك الموسمي. مصمّمة للعميلات اللواتي يمتلكن فهماً واضحاً لأسس صورتهن، وتقدّم هذه الخدمة طريقة راقية وسهلة لبناء إطلالات يومية متناسقة دون عناء التسوّق بنفسك.",
  html: `<p>تبدأ التجربة باستشارة عبر الإنترنت لفهم نمط حياتك واحتياجاتك وأولوياتك وميزانيتك قبل تنسيق قطع مصمّمة خصيصاً لكِ.</p>
<p>تركّز الخدمة على خزانة الملابس اليومية لنمط الحياة، وتشمل:</p>
<ul class="ps-remote__bullet-list">
<li>ملابس العمل</li>
<li>إطلالات السفر</li>
<li>أناقة المنزل وملابس الاسترخاء</li>
<li>الإطلالات اليومية الكاجوال</li>
</ul>
<p>تُنسَّق جميع القطع المختارة لتكون متناسقة وعملية ومتوافقة مع هويتك الأسلوبية الشخصية. قد تشمل المشتريات الملابس والعباءات وقطع الأزياء المحتشمة ومنتجات تجميل مختارة عند الحاجة.</p>
<p>من البحث والشراء إلى ترتيب التوصيل إلى المنزل، تُدار العملية بالكامل نيابةً عنكِ. وفي نهاية الخدمة، تحصلين على ملف تنسيق منسّق يعرض جميع القطع المختارة منسّقة في إطلالات كاملة لارتداء يومي سهل.</p>
<p>التسعير</p>
<ul class="ps-remote__bullet-list">
<li>1–2 إطلالة: 1000 درهم</li>
<li>3–5 إطلالات: 2000 درهم</li>
<li>6–10 إطلالات: 3850 درهم</li>
</ul>
<a href="/booking" class="ps-remote__button">احجزي استشارتك الآن</a>`,
};

export default function PersonalShoppingRemote({ editable = false }: { editable?: boolean }) {
  const { content, saveContent, isSaving, error } = usePageComponentContent("personal-shopping", "remote", defaults);
  const { language } = useLanguage();
  const t = translations[language].personalShoppingRemote;

  return (
    <AdminEditableSection content={content} editable={editable} error={error} isSaving={isSaving} title="Remote shopping" onSave={saveContent}>
      {({ content: editorContent, isEditing, updateContent }) => (
      <section className="ps-remote">
        <div className="ps-remote__inner">
          <div className="ps-remote__intro">
            <EditableContent as="h2" plain contentId="personal-shopping.remote.title" fallback={defaults.title} fallbackAr={defaultsAr.title} />
            <div className="ps-remote__tabs" aria-label="Remote shopping steps">
              <EditableContent as="span" plain contentId="personal-shopping.remote.tab" fallback={defaults.tab} fallbackAr={defaultsAr.tab} />
            </div>
            <EditableContent as="p" plain contentId="personal-shopping.remote.intro" fallback={defaults.intro} fallbackAr={defaultsAr.intro} />
          </div>

          <div className="ps-remote__image">
            <EditableImage src={String(editorContent.imageUrl) || remoteImage} alt="Cream skirt and heels styling inspiration" fill sizes="104px" isEditing={isEditing} onChange={(imageUrl) => updateContent({ imageUrl })} />
          </div>

          <EditableContent
            as="div"
            defaultClass="ps-remote__details"
            contentId="personal-shopping.remote.html"
            fallback={defaults.html}
            fallbackAr={defaultsAr.html}
          />
        </div>
      </section>
      )}
    </AdminEditableSection>
  );
}
