import Image from "next/image";
import storyRoom from "../Images/story-room.png";
import "../Styles/StoryFoundation.css";

export default function StoryFoundation() {
  return (
    <section className="story-foundation">
      <div className="story-foundation__copy">
        <p className="story-foundation__kicker">WHERE IT ALL STARTED</p>
        <h2>A Thoughtful Foundation</h2>
        <p>
          I graduated from United Arab Emirates University, where I studied molecular and cellular
          biology alongside communication and leadership.
          <br />
          This taught me that every detail matters, that careful observation brings understanding,
          and that a methodical approach can turn insight into art.
          <br />
          <br />
          I began exploring beauty as a makeup artist, learning the subtle details that make each
          woman unique. I later refined my fashion expertise through studies
          <br />
          in Dubai and, in 2023, had the honor of writing fashion articles featured on Savoir
          Avenue, sharing my insights with a wider audience.
        </p>
      </div>
      <div className="story-foundation__image">
        <Image src={storyRoom} alt="Warm styling office interior" fill sizes="100vw" />
      </div>
    </section>
  );
}
