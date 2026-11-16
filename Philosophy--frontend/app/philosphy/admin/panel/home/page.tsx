import HeroSection from "../../../../components/HeroSection";
import IntroApproach from "../../../../components/IntroApproach";
import ServicesSection from "../../../../components/ServicesSection";
import WhyChooseUs from "../../../../components/WhyChooseUs";
import GettingStarted from "../../../../components/GettingStarted";
import StyleMarquee from "../../../../components/StyleMarquee";

export default function HomeEditorPage() {
  return (
    <main className="admin-page-preview">
      <header className="admin-page-preview__header">
        <p>Website Page Editor</p>
        <h1>Home</h1>
      </header>
      <HeroSection editable />
      <IntroApproach editable />
      <ServicesSection editable />
      <WhyChooseUs editable />
      <GettingStarted editable />
      <StyleMarquee editable page="home" />
    </main>
  );
}
