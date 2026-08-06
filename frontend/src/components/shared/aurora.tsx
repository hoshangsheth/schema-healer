import { cn } from "@/lib/cn";

/**
 * Ambient background: two slow-drifting colour fields behind a dot grid.
 *
 * Implemented in CSS rather than Framer Motion so it costs nothing on the main
 * thread, and it stops entirely under `prefers-reduced-motion` via the global
 * animation reset in `globals.css`.
 */
export function Aurora({
  className,
  intensity = "soft",
}: {
  className?: string;
  intensity?: "soft" | "vivid";
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div
        className={cn(
          "absolute -top-40 -left-32 size-[42rem] rounded-full blur-3xl animate-drift",
          intensity === "vivid"
            ? "bg-brand-300/45"
            : "bg-brand-200/35",
        )}
      />
      <div
        className={cn(
          "absolute -top-24 right-[-12rem] size-[38rem] rounded-full blur-3xl animate-drift [animation-delay:-8s]",
          intensity === "vivid" ? "bg-teal-400/30" : "bg-teal-100/60",
        )}
      />
      <div className="absolute inset-0 bg-dot-grid opacity-[0.5] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />

      {/* Painted fade rather than a mask on the blurred layer, which keeps the
          field from ending on a hard edge without compositing artefacts. */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-canvas" />
    </div>
  );
}
