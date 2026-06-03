import Image from "next/image";
import contactBanner from "../Images/contact-banner.png";
import ContactForm from "./ContactForm";
import "../Styles/ContactHero.css";

export default function ContactHero() {
  return (
    <section className="contact-hero">
      {/* ✨ Container now has a hard position relative and custom layout structure */}
      <div className="contact-hero__banner" style={{ position: "relative" }}>
        <Image
          src={contactBanner}
          alt="Contact us background banner"
          fill
          priority={true} // ✨ Instructs the browser to preload this image instantly
          sizes="100vw"
          className="object-cover" // Seamlessly handles center / cover behavior safely
        />
        <div className="contact-hero__shade" />
        <h1>CONTACT US</h1>
      </div>

      <div className="contact-card">
        <h2>Begin Your Styling Journey.</h2>
        <p>
          Every transformation begins with a conversation. Whether you&apos;re refining your
          everyday style or preparing for a special moment, this is where we take the first
          step together. Share a few details below, and I will personally guide you toward a
          styling experience tailored to you.
        </p>
        <ContactForm />
      </div>
    </section>
  );
}