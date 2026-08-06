import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import { Eyebrow } from "@/components/shared/badge";
import { Reveal } from "@/components/shared/reveal";

export function Section({
  id,
  children,
  className,
  containerClassName,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
}) {
  return (
    <section id={id} className={cn("relative py-14 sm:py-18", className)}>
      <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", containerClassName)}>
        {children}
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow ? (
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>
      ) : null}
      <Reveal index={1}>
        <h2
          className={cn(
            "text-balance text-3xl font-semibold tracking-[-0.03em] text-ink-900 sm:text-[2.25rem] sm:leading-[1.12]",
            align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl",
          )}
        >
          {title}
        </h2>
      </Reveal>
      {description ? (
        <Reveal index={2}>
          <p
            className={cn(
              "text-pretty text-base leading-relaxed text-ink-500",
              align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl",
            )}
          >
            {description}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
