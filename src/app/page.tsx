import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { ServiceCards } from "@/components/landing/ServiceCards";
import { StartFromProblem } from "@/components/landing/StartFromProblem";
import { ProcessSection } from "@/components/landing/ProcessSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { ExamplesSection } from "@/components/landing/ExamplesSection";
import { WhyMvpSection } from "@/components/landing/WhyMvpSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { FinalCta } from "@/components/landing/FinalCta";
import { Footer } from "@/components/landing/Footer";
import { StickyMobileCta } from "@/components/landing/StickyMobileCta";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="pb-20 md:pb-0">
        <Hero />
        <ServiceCards />
        <StartFromProblem />
        <ProcessSection />
        <PricingSection />
        <ExamplesSection />
        <WhyMvpSection />
        <FAQSection />
        <FinalCta />
      </main>
      <Footer />
      <StickyMobileCta />
    </>
  );
}
