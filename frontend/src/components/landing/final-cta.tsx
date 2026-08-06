import { ArrowRight } from "lucide-react";

import { ButtonLink } from "@/components/shared/button";
import { Aurora } from "@/components/shared/aurora";
import { Reveal } from "@/components/shared/reveal";

export function FinalCta() {
  return (
    <section className="relative px-5 pb-16 sm:px-8">
      <Reveal className="mx-auto w-full max-w-6xl">
        <div className="relative overflow-hidden rounded-panel border border-brand-200/70 bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 px-6 py-12 text-center shadow-panel sm:px-12 sm:py-16">
          <Aurora className="opacity-30 mix-blend-soft-light" />

          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-balance text-3xl font-semibold tracking-[-0.03em] text-white sm:text-[2.25rem] sm:leading-[1.12]">
              Upload the file that broke last time.
            </h2>
            <p className="mt-3 text-pretty text-base leading-relaxed text-brand-100">
              You will get the rebuilt file, a column by column account of what changed,
              and a set of checks telling you whether it is safe to use.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink
                href="/app"
                size="lg"
                variant="secondary"
                className="border-transparent bg-white text-brand-700 hover:text-brand-800"
                trailingIcon={<ArrowRight className="size-4" aria-hidden />}
              >
                Open the workspace
              </ButtonLink>
              <ButtonLink
                href="/#how-it-works"
                size="lg"
                variant="ghost"
                className="text-white hover:bg-white/10 hover:text-white"
              >
                See the steps
              </ButtonLink>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
