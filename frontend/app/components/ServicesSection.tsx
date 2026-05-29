import Image from "next/image";
import Link from "next/link";
import servicesWoman from "../Images/services-woman.jpg";
import "../Styles/ServicesSection.css";

const services = ["ANALYSIS", "WARDROBE", "PERSONAL SHOPPING", "BRIDAL"];

export default function ServicesSection() {
  return (
    <section className="services-section">
      <div className="services-section__inner">
        <div className="services-section__content">
          <h2>Our Services</h2>
          <p>
            Each service is designed with intention to bring clarity, refinement, and ease into
            your personal style journey, whether through a complete transformation or subtle
            guidance, we thoughtfully consider your lifestyle, preferences, and goals to curate
            what truly belongs, focusing not on excess but on meaningful choices that create a
            wardrobe and presence that feel effortless, aligned, and timeless.
          </p>
          <Link href="/contact-us" className="philosophy-button philosophy-button--light">
            BOOK YOUR CONSULTATION NOW
          </Link>

          <div className="services-section__list">
            {services.map((service, index) => (
              <div className="services-section__row" key={service}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>{service}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="services-section__image">
          <Image src={servicesWoman} alt="Woman overlooking a lake" fill sizes="430px" />
        </div>
      </div>
    </section>
  );
}
