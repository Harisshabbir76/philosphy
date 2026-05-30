import Image from "next/image";
import Link from "next/link";
import faqImage from "../Images/faq2.jpg";
import "../Styles/FaqQuestions.css";

export default function FaqQuestions() {
  return (
    <section className="faq-questions">
      <div className="faq-questions__wrap">
        <h2>
          STILL HAVE
          <br />
          QUESTIONS?
        </h2>
        <div className="faq-questions__image">
          <Image src={faqImage} alt="Woman reading a magazine" fill sizes="118px" />
        </div>
        <Link href="/contact-us" className="faq-questions__link">
          CONTACT US
        </Link>
      </div>
    </section>
  );
}
