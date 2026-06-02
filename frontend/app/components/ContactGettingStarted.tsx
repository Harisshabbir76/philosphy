import Image from "next/image";
import store from "../Images/store.png";
import "../Styles/ContactGettingStarted.css";

const steps = [
  {
    title: "CHOOSE A PACKAGE",
    text: "Select the service that best aligns with your needs, whether you're looking for a complete transformation or focused guidance. Each option is thoughtfully designed to support you with clarity and intention.",
  },
  {
    title: "SCHEDULE A CONSULT",
    text: "Book a consultation where we take the time to understand your lifestyle, preferences, and goals. This is where we align on your vision and define the direction moving forward.",
  },
  {
    title: "MAKE IT OFFICIAL",
    text: "Once everything feels right, we confirm the details and begin the process. With a clear plan in place, we move forward with a refined and seamless experience tailored to you.",
  },
];

export default function ContactGettingStarted() {
  return (
    <section className="contact-started">
      <div className="contact-started__intro">
        <div className="contact-started__store">
          <Image src={store} alt="Fashion atelier interior" fill sizes="440px" />
        </div>
        <h2 className=" wanna-learn">WANNA LEARN MORE ABOUT FASHION?</h2>
        <h2>Workshops coming soon!</h2>
        <p>
          Stay tuned for intimate styling sessions, creative fashion workshops, and inspiring
          experiences designed for women who appreciate timeless elegance, personal style, and
          the art behind fashion.
        </p>
        <a href="/contact-us">STAY UPDATED</a>
      </div>

      <div className="contact-started__steps">
        <p className="contact-started__kicker">HOW TO GET STARTED</p>
        <div className="contact-started__cards">
          {steps.map((step, index) => (
            <article className="contact-started__card" key={step.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
