import Image from "next/image";
import faqHeroBanner from "../Images/faq-hero.png";
import "../Styles/FaqHero.css";

export default function FaqHero() {
  return (
    <section className="faq-hero" aria-label="Frequently asked questions">
      <Image
        src={faqHeroBanner}
        alt="Frequently asked questions background banner"
        fill
        priority={true} // ✨ Force immediate preloading on page load
        sizes="100vw"
        className="object-cover" // Acts exactly like center center / cover
      />
      <div className="faq-hero__shade" />
      <h1>FREQUENTLY ASKED QUESTIONS</h1>
    </section>
  );
}