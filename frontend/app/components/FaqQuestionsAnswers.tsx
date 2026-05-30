import "../Styles/FaqQuestionsAnswers.css";

const faqs = [
  {
    question: "What services do you offer?",
    answer:
      "I offer personal styling, wardrobe edits, outfit curation, shopping support, and special occasion styling tailored to your lifestyle and goals.",
  },
  {
    question: "How does the styling process work?",
    answer:
      "The process begins with understanding you--your lifestyle, preferences, and goals. From there, I create a tailored approach, whether it's refining your wardrobe, sourcing new pieces, or curating complete looks that feel natural and effortless.",
  },
  {
    question: "Do I need to have a specific style before working with you?",
    answer:
      "No. We can define and refine your personal style together through your preferences, needs, proportions, colors, and the way you want to feel in your clothes.",
  },
  {
    question: "Is this service only for special occasions?",
    answer:
      "Not at all. Styling can support everyday dressing, workwear, travel, seasonal updates, events, or a complete wardrobe refresh.",
  },
  {
    question: "Can you work with my existing wardrobe?",
    answer:
      "Yes. We can begin with what you already own, identify the pieces that serve you best, and build outfits or shopping priorities from there.",
  },
  {
    question: "Do you offer personal shopping services?",
    answer:
      "Yes. Personal shopping can be included as a focused service or as part of a broader styling plan, depending on what you need.",
  },
  {
    question: "How do I get started?",
    answer:
      "You can get started by reaching out through the contact page so we can discuss your goals and choose the right styling direction.",
  },
];

export default function FaqQuestionsAnswers() {
  return (
    <section className="faq-answers" aria-label="FAQ answers">
      <div className="faq-answers__list">
        {faqs.map((item, index) => (
          <details className="faq-answer" name="faq-answers" key={item.question}>
            <summary className="faq-answer__trigger">
              <span>
                {index + 1}. {item.question}
              </span>
              <span className="faq-answer__icon" aria-hidden="true" />
            </summary>
            <div className="faq-answer__panel">
              <p>{item.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
