import { SchemaHealerDemo } from "@/components/demo/SchemaHealerDemo";
import { BeforeAfter } from "@/components/landing/BeforeAfter";
import { Faq } from "@/components/landing/Faq";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { ValueCards } from "@/components/landing/ValueCards";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <BeforeAfter />
        <ValueCards />
        <HowItWorks />
        <SchemaHealerDemo />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
