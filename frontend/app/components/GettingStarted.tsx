import Image from "next/image";
import store from "../Images/store.png";
import "../Styles/GettingStarted.css";

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

export default function GettingStarted() {
  return (
    <section className="getting-started">
      <div className="getting-started__hero">
        <p className="section-kicker">HOW TO GET STARTED</p>
        <div className="getting-started__cards">
          {steps.map((step, index) => (
            <article className="getting-started__card" key={step.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h2>{step.title}</h2>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </div>
      <div className="getting-started__lower">
        <div className="getting-started__store">
          <Image src={store} alt="Fashion atelier interior" fill sizes="520px" />
        </div>
        <h2>WANNA LEARN MORE ABOUT FASHION?</h2>
        <h3>Workshops coming soon!</h3>
        <p>
          Stay tuned for intimate styling sessions, creative fashion workshops, and inspiring
          experiences designed for women who appreciate timeless elegance, personal style, and
          the art behind fashion.
        </p>
        <a href="/contact-us">STAY UPDATED</a>
      </div>
    </section>
  );
}
