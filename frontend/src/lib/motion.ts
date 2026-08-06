import type { Transition, Variants } from "framer-motion";

/**
 * Shared motion vocabulary.
 *
 * Every animation is composed from these primitives so timing and easing stay
 * consistent across the marketing and application surfaces.
 */

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

export const springSoft: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 30,
  mass: 0.9,
};

export const springSnappy: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 34,
  mass: 0.7,
};

export const transitionBase: Transition = {
  duration: 0.5,
  ease: EASE_OUT,
};

/** Per-index delay for staggered groups. */
export function staggerDelay(index: number, step = 0.07, base = 0): number {
  return base + index * step;
}

/** Step level transition: fade, blur and a small scale settle. */
export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 12, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.45, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: "blur(6px)",
    transition: { duration: 0.25, ease: EASE_IN_OUT },
  },
};

/** Standard `whileInView` viewport config: animate once, slightly early. */
export const viewportOnce = {
  once: true,
  amount: 0.25,
  margin: "0px 0px -80px 0px",
} as const;
