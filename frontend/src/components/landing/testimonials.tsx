"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Quote } from "lucide-react";

import { cn } from "@/lib/cn";
import { EASE_OUT } from "@/lib/motion";
import { Section, SectionHeading } from "@/components/shared/section";
import { Reveal } from "@/components/shared/reveal";
import { SnapCarousel } from "@/components/shared/snap-carousel";

/**
 * Placeholder content.
 *
 * These are illustrative roles written to demonstrate the layout. They are not
 * real customers and no real person or company is named. Replace this array
 * with approved, attributed quotes before launch.
 */
interface Testimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Supplier files used to break our nightly load about once a month, and it was always a column nobody had touched in a year. Now the run finishes and the report tells us what changed.",
    name: "Data platform lead",
    role: "B2B software, around 40 pipelines",
    initials: "DP",
  },
  {
    quote:
      "The checking step is what sold the team. We are not asking anyone to trust an automatic rename, we are handing them a list of exactly what changed and what still needs a decision.",
    name: "Analytics engineer",
    role: "Financial services",
    initials: "AE",
  },
  {
    quote:
      "Onboarding a new client's customer data used to be two days of matching columns by hand. Most of it now sorts itself out on the first upload, and we only look at the leftovers.",
    name: "Solutions architect",
    role: "Data consultancy",
    initials: "SA",
  },
];

const ROTATE_MS = 7000;

function Attribution({ item }: { item: Testimonial }) {
  return (
    <footer className="mt-5 flex items-center gap-3">
      <span
        aria-hidden
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-semibold text-white"
      >
        {item.initials}
      </span>
      <div className="leading-tight">
        <p className="text-sm font-medium text-ink-900">{item.name}</p>
        <p className="text-[0.8125rem] text-ink-400">{item.role}</p>
      </div>
    </footer>
  );
}

export function Testimonials() {
  return (
    <Section className="bg-surface-2/60">
      <SectionHeading
        eyebrow="From the field"
        title="What changes when a renamed column stops being an incident"
      />

      {/* Touch: swipe between quotes rather than waiting on a rotation. */}
      <SnapCarousel
        ariaLabel="Testimonials"
        className="mt-7 lg:hidden"
        itemClassName="w-[88%] sm:w-[62%]"
      >
        {TESTIMONIALS.map((item) => (
          <blockquote
            key={item.name}
            className="flex h-full w-full flex-col rounded-panel border border-line bg-surface p-6 shadow-soft"
          >
            <Quote className="size-6 text-brand-200" aria-hidden />
            <p className="mt-3 flex-1 text-pretty text-[0.9375rem] leading-relaxed text-ink-700">
              {item.quote}
            </p>
            <Attribution item={item} />
          </blockquote>
        ))}
      </SnapCarousel>

      <DesktopTestimonials />
    </Section>
  );
}

/** Desktop: a single quote that rotates on a timer. */
function DesktopTestimonials() {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % TESTIMONIALS.length);
    }, ROTATE_MS);
    return () => clearInterval(timer);
  }, [reduceMotion]);

  const active = TESTIMONIALS[index];

  return (
    <Reveal className="mt-8 hidden lg:block">
      <div className="mx-auto max-w-3xl rounded-panel border border-line bg-surface p-9 shadow-panel">
        <Quote className="size-7 text-brand-200" aria-hidden />

        <div className="relative mt-3 min-h-32">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: EASE_OUT }}
            >
              <p className="text-pretty text-xl leading-relaxed text-ink-700">
                {active.quote}
              </p>
              <Attribution item={active} />
            </motion.blockquote>
          </AnimatePresence>
        </div>

        <div className="mt-6 flex items-center gap-2" role="tablist" aria-label="Testimonials">
          {TESTIMONIALS.map((item, itemIndex) => (
            <button
              key={item.name}
              type="button"
              role="tab"
              aria-selected={itemIndex === index}
              aria-label={`Show quote ${itemIndex + 1}`}
              onClick={() => setIndex(itemIndex)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                itemIndex === index
                  ? "w-7 bg-brand-500"
                  : "w-1.5 bg-line-strong hover:bg-ink-300",
              )}
            />
          ))}
        </div>
      </div>
    </Reveal>
  );
}
