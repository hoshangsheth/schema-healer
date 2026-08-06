"use client";

import Link from "next/link";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/cn";
import { springSnappy } from "@/lib/motion";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white shadow-[0_1px_0_0_rgba(255,255,255,0.16)_inset,0_10px_24px_-12px_rgba(91,55,224,0.9)] hover:bg-brand-500 disabled:hover:bg-brand-600",
  secondary:
    "bg-surface text-ink-800 border border-line-strong shadow-soft hover:border-brand-300 hover:text-brand-700",
  ghost: "text-ink-600 hover:text-ink-900 hover:bg-surface-2",
  danger: "bg-danger-500 text-white hover:bg-danger-600",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[0.8125rem] gap-1.5 rounded-lg",
  md: "h-11 px-5 text-sm gap-2 rounded-xl",
  lg: "h-13 px-6 text-[0.9375rem] gap-2.5 rounded-xl",
};

const BASE =
  "relative inline-flex items-center justify-center font-medium tracking-[-0.01em] transition-colors duration-200 select-none disabled:opacity-55 disabled:pointer-events-none";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { variant = "primary", size = "md", leadingIcon, trailingIcon, className, children, ...props },
    ref,
  ) {
    return (
      <motion.button
        ref={ref}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.985, y: 0 }}
        transition={springSnappy}
        className={cn(BASE, VARIANTS[variant], SIZES[size], className)}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {leadingIcon}
        {children}
        {trailingIcon}
      </motion.button>
    );
  },
);

export interface ButtonLinkProps {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  /** Set for in-page anchors so smooth scrolling is not intercepted. */
  scroll?: boolean;
  /** Stretch to the container, for stacked touch layouts. */
  fullWidth?: boolean;
}

/** Anchor styled as a button, for navigation rather than actions. */
export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  leadingIcon,
  trailingIcon,
  scroll,
  fullWidth = false,
}: ButtonLinkProps) {
  return (
    <motion.span
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.985, y: 0 }}
      transition={springSnappy}
      className={cn("inline-flex", fullWidth && "w-full")}
    >
      <Link
        href={href}
        scroll={scroll}
        className={cn(
          BASE,
          VARIANTS[variant],
          SIZES[size],
          fullWidth && "w-full",
          className,
        )}
      >
        {leadingIcon}
        {children}
        {trailingIcon}
      </Link>
    </motion.span>
  );
}
