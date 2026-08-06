import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Hero } from "@/components/landing/hero";
import { ProblemSolution } from "@/components/landing/problem-solution";
import { FeatureGrid } from "@/components/landing/feature-grid";
import { HowItWorks } from "@/components/landing/how-it-works";
import { InteractiveDemo } from "@/components/landing/interactive-demo";
import { About } from "@/components/landing/about";
import { Testimonials } from "@/components/landing/testimonials";
import { Faq } from "@/components/landing/faq";
import { FinalCta } from "@/components/landing/final-cta";
import { FeedbackSection } from "@/components/feedback/feedback-section";
import { MobileCta } from "@/components/landing/mobile-cta";

/**
 * Marketing page.
 *
 * A Server Component that composes the sections. Only the sections that need
 * interaction or scroll linked motion opt into the client.
 */
export default function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
        <ProblemSolution />
        <FeatureGrid />
        <HowItWorks />
        <InteractiveDemo />
        <About />
        <Testimonials />
        <Faq />
        <FinalCta />
        <FeedbackSection />
      </main>
      <SiteFooter />
      <MobileCta />
    </>
  );
}
