import Image from "next/image";
import Link from "next/link";
import woman from "../Images/woman.png";
import newspaper from "../Images/newspaper.webp";
import "../Styles/IntroApproach.css";

export default function IntroApproach() {
  return (
    <section className="intro-approach">
      <div className="intro-approach__top">
        <div className="intro-approach__copy">
          <h2>
            At Philosophy, style isn&apos;t chosen.
            
            It&apos;s matched, expressed &amp; owned.
          </h2>
          <p>
            Welcome to Philosophy - a space where creativity is guided by purpose and every
            detail is considered with care. We believe in designing with clarity, creating work
            that feels effortless yet deeply thoughtful. From concept to execution, our approach
            is rooted in sophistication, balance, and quiet confidence - allowing your brand to
            speak with meaning, not noise.
          </p>
          <button className="button">
            BOOK YOUR CONSULTATION NOW
          </button>
          
        </div>
        <div className="intro-approach__images">
          <div className="intro-approach__image intro-approach__image--woman">
            <Image src={woman} alt="Woman walking through Paris" fill sizes="180px" />
          </div>
          <div className="intro-approach__image intro-approach__image--newspaper">
            <Image src={newspaper} alt="Fashion books on a wooden table" fill sizes="260px" />
          </div>
        </div>
      </div>

      <div className="intro-approach__bottom">
        <h4 className="section-kicker">OUR APPROACH</h4>
        <h2>Intentional. Refined. Effortless.</h2>
        <p>
          Welcome to Philosophy - a space where creativity is guided by purpose and every detail
          is considered with care. We believe in designing with clarity, creating work that feels
          effortless yet deeply thoughtful. From concept to execution, our approach is rooted in
          sophistication, balance, and quiet confidence - allowing your brand to speak with
          meaning, not noise.
        </p>
      </div>
    </section>
  );
}
