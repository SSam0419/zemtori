import SectionNavbar from "./nav/SectionNavbar";
import FeatureSection from "./sections/FeatureSection";
import HeroSection from "./sections/HeroSection";
import PricingSection from "./sections/PricingSection";

function LandingPage() {
  return (
    <div className="flex flex-col items-center px-10 py-20">
      <SectionNavbar />
      <div className={``}>
        <div className="fixed left-0 top-0 -z-10 h-full w-full">
          <div className="absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(100%_50%_at_50%_0%,rgba(0,163,255,0.13)_0,rgba(0,163,255,0)_50%,rgba(0,163,255,0)_100%)]"></div>
        </div>
        <div id="hero" className="my-10">
          <HeroSection />
        </div>

        <div id="features" className="my-20 rounded border bg-background p-10">
          <FeatureSection />
        </div>
        <div id="pricing" className="py-20">
          <PricingSection />
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
