import "../Styles/StyleMarquee.css";

const words = [
  "Timeless",
  "Refined",
  "Intentional",
  "Elegant",
  "Minimal",
  "Sophisticated",
  "Elevated",
  "Curated",
  "Thoughtful",
  "Effortless",
  "Balanced",
  "Polished",
  "Classic",
  "Modern",
  "Understated",
  "Graceful",
  "Harmonious",
];

export default function StyleMarquee() {
  const line = words.map((word) => `${word} //`).join(" ");

  return (
    <section className="style-marquee" aria-label="Style values">
      <div className="style-marquee__track">
        <span>{line}</span>
        <span>{line}</span>
      </div>
    </section>
  );
}
