import Nav from "./_components/Nav";
import MobileStickyCTA from "./_components/MobileStickyCTA";
import { Hero } from "./_components/sections/Hero";
import { LogoWall } from "./_components/sections/LogoWall";
import { LiveTicker } from "./_components/sections/LiveTicker";
import { Bento } from "./_components/sections/Bento";
import { SecuritySection } from "./_components/sections/SecuritySection";
import { HowItWorks } from "./_components/sections/HowItWorks";
import { Testimonial } from "./_components/sections/Testimonial";
import { Pricing } from "./_components/sections/Pricing";
import { FAQ } from "./_components/sections/FAQ";
import { FinalCTA } from "./_components/sections/FinalCTA";
import { Footer } from "./_components/sections/Footer";

export default function Page() {
  return (
    <>
      <Nav />
      <main id="main" className="min-h-screen overflow-x-hidden pb-24 md:pb-0">
        <Hero />
        <LogoWall />
        <LiveTicker />
        <Bento />
        <SecuritySection />
        <HowItWorks />
        <Testimonial />
        <Pricing />
        <FAQ />
        <FinalCTA />
        <Footer />
      </main>
      <MobileStickyCTA />
    </>
  );
}
