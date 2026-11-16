"use client";

import AdminEditableSection from "./AdminEditableSection";
import { EditableContent } from "./CMS";
import { usePageComponentContent } from "../lib/pageContent";
import { useLanguage } from "../lib/LanguageContext";
import { translations } from "../lib/translations";
import "../Styles/BridalEducation.css";

const defaults = {
  html: `<h2>BRIDAL STYLING EDUCATION EXPERIENCE</h2>
<p>Learn to create every look with confidence, from your everyday life to your wedding day.</p>
<p>A personalized educational styling experience designed to help brides understand and build their personal style with confidence, clarity, and intention. This service teaches brides how to style themselves independently while understanding what truly suits their features, lifestyle, and aesthetic direction.</p>
<p>The experience includes a seasonal color analysis tailored specifically to the bride and applied across all her looks, along with body shape and facial feature analysis to identify the most flattering cuts, silhouettes, and styling directions.</p>
<p>Through practical guidance and styling education, brides learn how to create cohesive everyday outfits and occasion looks with ease and confidence.</p>
<h3>Inclusions:</h3>
<p>Personal styling files are delivered covering all aspects of the bride's lifestyle, including:</p>
<ul class="bridal-education__dash-list">
<li>Complete wedding day look</li>
<li>Travel outfits</li>
<li>Hijab and abaya styling</li>
<li>Jalabiyas</li>
<li>Everyday outfits</li>
<li>Loungewear, sleepwear, and pajamas</li>
<li>Formal and special occasion outfits</li>
</ul>
<p>Each file is thoughtfully structured to help the bride understand her personal style and apply it effortlessly in real life.</p>
<p>The wedding styling file includes complete head-to-toe guidance, including:</p>
<ul class="bridal-education__dash-list">
<li>Wedding dress</li>
<li>Veil</li>
<li>Shoes</li>
<li>Jewelry</li>
<li>Bouquet styling</li>
<li>Hair direction</li>
<li>Makeup direction</li>
</ul>
<hr />
<h3>Wedding Dress Shopping Sessions</h3>
<p>If the bride wishes to book wedding dress shopping sessions, she receives a special discounted rate as part of this educational experience.</p>
<p>Wedding Dress Shopping Session: 500 AED per day</p>
<p>During the shopping sessions, the bride is guided to apply everything she has learned in real time while selecting her wedding dress.</p>
<p>The goal of this service is to fully empower the bride to understand her personal style and build a wardrobe that reflects her identity in every detail of her life.</p>
<p class="bridal-education__price">Price:<br />3500 AED</p>
<a href="/booking" class="bridal-education__button">BOOK YOUR CONSULTATION NOW</a>`,
};

const defaultsAr = {
  html: `<h2>تجربة التثقيف في تنسيق إطلالة العروس</h2>
<p>تعلّمي تنسيق كل إطلالة بثقة، من حياتك اليومية إلى يوم زفافك.</p>
<p>تجربة تثقيفية شخصية في التنسيق مصمّمة لمساعدة العرائس على فهم وبناء أسلوبهن الشخصي بثقة ووضوح ونيّة. تعلّم هذه الخدمة العرائس كيفية تنسيق إطلالاتهن بأنفسهن باستقلالية مع فهم ما يناسب ملامحهن ونمط حياتهن واتجاههن الجمالي.</p>
<p>تشمل التجربة تحليلاً لفصول الألوان مخصصاً للعروس ويُطبَّق على جميع إطلالاتها، إلى جانب تحليل شكل الجسم وملامح الوجه لتحديد القصّات والصور الظلية واتجاهات التنسيق الأكثر إطراءً.</p>
<p>من خلال الإرشاد العملي والتثقيف في التنسيق، تتعلّم العرائس كيفية إنشاء إطلالات يومية ومناسباتية متناسقة بسهولة وثقة.</p>
<h3>تشمل:</h3>
<p>تُسلَّم ملفات التنسيق الشخصية بحيث تغطي جميع جوانب نمط حياة العروس، وتشمل:</p>
<ul class="bridal-education__dash-list">
<li>إطلالة يوم الزفاف الكاملة</li>
<li>ملابس السفر</li>
<li>تنسيق الحجاب والعباءة</li>
<li>الجلابيات</li>
<li>الإطلالات اليومية</li>
<li>ملابس المنزل والنوم والبيجامات</li>
<li>إطلالات المناسبات الرسمية والخاصة</li>
</ul>
<p>كل ملف مُنظَّم بعناية لمساعدة العروس على فهم أسلوبها الشخصي وتطبيقه بسهولة في حياتها الواقعية.</p>
<p>يشمل ملف تنسيق الزفاف إرشاداً كاملاً من الرأس إلى القدم، ويتضمن:</p>
<ul class="bridal-education__dash-list">
<li>فستان الزفاف</li>
<li>الطرحة</li>
<li>الأحذية</li>
<li>المجوهرات</li>
<li>تنسيق باقة الورد</li>
<li>توجيه تصفيفة الشعر</li>
<li>توجيه المكياج</li>
</ul>
<hr />
<h3>جلسات التسوّق لفستان الزفاف</h3>
<p>إذا رغبت العروس في حجز جلسات تسوّق لفستان الزفاف، تحصل على سعر مخفّض خاص كجزء من هذه التجربة التثقيفية.</p>
<p>جلسة تسوّق فستان الزفاف: 500 درهم في اليوم</p>
<p>خلال جلسات التسوّق، تُرشَد العروس لتطبيق كل ما تعلّمته في الوقت الفعلي أثناء اختيار فستان زفافها.</p>
<p>الهدف من هذه الخدمة هو تمكين العروس بالكامل لفهم أسلوبها الشخصي وبناء خزانة ملابس تعكس هويتها في كل تفصيل من حياتها.</p>
<p class="bridal-education__price">السعر:<br />3500 درهم</p>
<a href="/booking" class="bridal-education__button">احجزي استشارتك الآن</a>`,
};

export default function BridalEducation({ editable = false }: { editable?: boolean }) {
  const { content, saveContent, isSaving, error } = usePageComponentContent("bridal", "education", defaults);
  const { language } = useLanguage();
  const t = translations[language].bridalEducation;

  return (
    <AdminEditableSection content={content} editable={editable} error={error} isSaving={isSaving} title="Bridal education" onSave={saveContent}>
      {() => (
      <section className="bridal-education">
        <EditableContent
          as="div"
          defaultClass="bridal-education__panel"
          contentId="bridal.education.html"
          fallback={defaults.html}
          fallbackAr={defaultsAr.html}
        />
      </section>
      )}
    </AdminEditableSection>
  );
}
