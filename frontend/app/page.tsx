import HeroSection from "./components/HeroSection";
import IntroApproach from "./components/IntroApproach";
import ServicesSection from "./components/ServicesSection";
import WhyChooseUs from "./components/WhyChooseUs";
import GettingStarted from "./components/GettingStarted";
import StyleMarquee from "./components/StyleMarquee";

export default function Home() {
  return (
    <>
      <HeroSection />
      <IntroApproach />
      <ServicesSection />
      <WhyChooseUs />
      <GettingStarted />
      <StyleMarquee />
    </>
  );
}
