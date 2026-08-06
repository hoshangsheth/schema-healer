"use client";

import type { ElementType, ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/cn";
import { staggerDelay, transitionBase, viewportOnce } from "@/lib/motion";

export interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Position in a staggered group; drives the entry delay. */
  index?: number;
  delay?: number;
  as?: ElementType;
  /** Travel distance in px. Set 0 for a pure fade. */
  distance?: number;
}

/**
 * Scroll triggered entry animation used across the marketing page. It collapses
 * to a plain fade, and then to nothing, when the user prefers reduced motion.
 */
export function Reveal({
  children,
  className,
  index = 0,
  delay = 0,
  as = "div",
  distance = 18,
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  return (
    <MotionTag
      initial={{ opacity: 0, y: reduceMotion ? 0 : distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ ...transitionBase, delay: staggerDelay(index, 0.07, delay) }}
      className={cn(className)}
    >
      {children}
    </MotionTag>
  );
}
