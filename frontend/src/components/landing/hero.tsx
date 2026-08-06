"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, PlayCircle } from "lucide-react";

import { ButtonLink } from "@/components/shared/button";
import { Eyebrow } from "@/components/shared/badge";
import { Aurora } from "@/components/shared/aurora";
import { DriftPreview } from "@/components/landing/drift-preview";
import { EASE_OUT } from "@/lib/motion";

const ASSURANCES = [
  "No account required",
  "Works with any CSV export",
  "Every change explained",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-10 sm:pt-32 sm:pb-16">
      <Aurora intensity="vivid" />

      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="grid items-center gap-9 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
            >
              <Eyebrow>
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full rounded-full bg-brand-400 animate-pulse-ring" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-brand-500" />
                </span>
                Automatic schema recovery
              </Eyebrow>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.06 }}
              className="mt-4 text-balance text-[2.125rem] leading-[1.08] font-semibold tracking-[-0.035em] text-ink-900 sm:text-5xl sm:tracking-[-0.04em] lg:text-6xl"
            >
              Your pipeline shouldn&rsquo;t break because someone{" "}
              <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-teal-500 bg-clip-text text-transparent">
                renamed a column
              </span>
              .
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.14 }}
              className="mt-3.5 max-w-xl text-pretty text-[1.0625rem] leading-relaxed text-ink-500 sm:text-lg"
            >
              When a spreadsheet arrives with different column names, SchemaHealer works
              out where each one belongs, rebuilds the file with the names your systems
              expect, and shows you exactly what it changed.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.22 }}
              className="mt-6 grid grid-cols-1 gap-2.5 sm:flex sm:flex-row sm:items-center sm:gap-3"
            >
              <ButtonLink
                href="/app"
                size="lg"
                className="justify-center"
                trailingIcon={<ArrowRight className="size-4" aria-hidden />}
              >
                Recover a file free
              </ButtonLink>
              <ButtonLink
                href="/#how-it-works"
                size="lg"
                variant="secondary"
                className="justify-center"
                leadingIcon={<PlayCircle className="size-4" aria-hidden />}
              >
                See how it works
              </ButtonLink>
            </motion.div>

            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.32 }}
              className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2"
            >
              {ASSURANCES.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-ink-500">
                  <span className="flex size-4 items-center justify-center rounded-full bg-success-50 text-success-600">
                    <Check className="size-2.5" aria-hidden strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </motion.ul>
          </div>

          <DriftPreview />
        </div>
      </div>
    </section>
  );
}
