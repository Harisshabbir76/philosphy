import Image from "next/image";
import brownWoman from "../Images/brown-woman.jpeg";
import "../Styles/StoryFounder.css";

export default function StoryFounder() {
  return (
    <section className="story-founder">
      <div className="story-founder__copy">
        <p className="story-founder__kicker">MEET THE FOUNDER</p>
        <h2>Where style becomes a story of identity.</h2>
        <p>
          From a young age, I was drawn to history and culture, which led me to traditional
          Emirati attire and the makhwar.
          <br />
          To me, they are more than garments--they embody heritage, art, and identity, and I bring
          this vision to life through my work and styling.
        </p>
      </div>
      <div className="story-founder__image">
        <Image src={brownWoman} alt="Founder seated in a brown dress" fill sizes="115px" />
      </div>
    </section>
  );
}
