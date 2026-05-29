import Image from "next/image";
import chooseUs from "../Images/choose-us.svg";
import bannerSmall from "../Images/banner small.png";
import "../Styles/WhyChooseUs.css";

export default function WhyChooseUs() {
  return (
    <section className="why-choose">
      <div className="why-choose__text">
        <h2>THE SMALLEST DETAILS MAKE THE STRONGEST IMPRESSION.</h2>
        <p>This is where your style takes shape. This is where you stand out.</p>
        <Image src={chooseUs} alt="" className="why-choose__mark" />
        <h3>WHY CHOOSE US?</h3>
        <h4>
          We believe true style is not about following trends, but about understanding what
          genuinely works for you, with a refined and thoughtful approach, we focus on creating
          results that feel natural, effortless, and lasting, combining a deep sense of aesthetics
          with careful attention to detail to ensure every choice is intentional, personal, and
          aligned with who you are.
        </h4>
        {/* Horizontal line added here */}
        <div className="why-choose__divider"></div>
      </div>
      
      <div className="why-choose__image">
        <Image src={bannerSmall} alt="Elegant interior with seated woman" fill sizes="100vw" />
      </div>
    </section>
  );
}