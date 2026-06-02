import ContactForm from "./ContactForm";
import "../Styles/ContactHero.css";

export default function ContactHero() {
  return (
    <section className="contact-hero">
      <div className="contact-hero__banner">
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
