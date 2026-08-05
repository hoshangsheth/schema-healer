import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "md" | "lg";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-600 text-white shadow-sm shadow-brand-600/25 hover:bg-brand-700 disabled:bg-brand-300 disabled:shadow-none",
  secondary:
    "bg-white text-ink-900 ring-1 ring-inset ring-ink-200 hover:bg-ink-50 disabled:text-ink-400",
  ghost: "text-ink-700 hover:bg-ink-100 disabled:text-ink-400",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-[15px]",
};

const BASE_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors disabled:cursor-not-allowed";

function classesFor(variant: ButtonVariant, size: ButtonSize, extra: string) {
  return `${BASE_CLASSES} ${SIZE_CLASSES[size]} ${VARIANT_CLASSES[variant]} ${extra}`;
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={classesFor(variant, size, className)}
      {...rest}
    >
      {children}
    </button>
  );
}

interface LinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

/** Anchor styled as a button, for in-page navigation. */
export function LinkButton({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: LinkButtonProps) {
  return (
    <a className={classesFor(variant, size, className)} {...rest}>
      {children}
    </a>
  );
}
