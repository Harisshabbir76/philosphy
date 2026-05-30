import Image from "next/image";
import storyWardrobe from "../Images/story-wardrobe.jpg";
import "../Styles/StoryPhilosophy.css";

export default function StoryPhilosophy() {
  return (
    <section className="story-philosophy">
      <div className="story-philosophy__copy">
        <h2>THE PHILOSOPHY BEHIND THE WORK</h2>
        <p>
          With over six years of experience, I&apos;ve learned that true beauty comes from harmony--when
          colors, shapes, and style align with both
          <br />
          features and personality, creating effortless elegance and a radiant presence.
        </p>
      </div>
      <div className="story-philosophy__image">
        <Image src={storyWardrobe} alt="Stylist selecting garments from a wardrobe" fill sizes="115px" />
      </div>
    </section>
  );
}
