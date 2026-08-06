"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { cn } from "@/lib/cn";

/**
 * Swipeable card rail for touch screens.
 *
 * Built on CSS scroll snapping rather than a drag library: the browser handles
 * momentum, rubber banding and accessibility for free, it costs nothing on the
 * main thread, and a trackpad or keyboard works the same way a thumb does.
 *
 * The dots are a read-out of scroll position, and they double as controls.
 */
export function SnapCarousel({
  children,
  ariaLabel,
  className,
  /** Card width. Leave the next card peeking so the swipe is discoverable. */
  itemClassName = "w-[85%] sm:w-[47%]",
}: {
  children: ReactNode[];
  ariaLabel: string;
  className?: string;
  itemClassName?: string;
}) {
  const railRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const frame = useRef<number | null>(null);

  const measure = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const item = rail.firstElementChild as HTMLElement | null;
    if (!item) return;

    const stride = item.offsetWidth + parseFloat(getComputedStyle(rail).columnGap || "0");
    if (stride <= 0) return;

    const index = Math.round(rail.scrollLeft / stride);
    setActive((current) =>
      current === index ? current : Math.min(Math.max(index, 0), children.length - 1),
    );
  }, [children.length]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const onScroll = () => {
      if (frame.current !== null) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = null;
        measure();
      });
    };

    rail.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      rail.removeEventListener("scroll", onScroll);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [measure]);

  const scrollTo = (index: number) => {
    const rail = railRef.current;
    const item = rail?.children[index] as HTMLElement | undefined;
    if (!rail || !item) return;
    rail.scrollTo({ left: item.offsetLeft - rail.offsetLeft, behavior: "smooth" });
  };

  return (
    <div className={cn("relative", className)}>
      <ul
        ref={railRef}
        aria-label={ariaLabel}
        className="scrollbar-none -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-5 pb-1"
        style={{ scrollPaddingLeft: "1.25rem" }}
      >
        {children.map((child, index) => (
          <li
            key={index}
            className={cn("flex shrink-0 snap-start", itemClassName)}
            aria-current={index === active ? "true" : undefined}
          >
            {child}
          </li>
        ))}
      </ul>

      {children.length > 1 ? (
        <div className="mt-4 flex items-center justify-center gap-2">
          {children.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => scrollTo(index)}
              aria-label={`Go to item ${index + 1} of ${children.length}`}
              className="flex size-11 items-center justify-center"
            >
              <span
                className={cn(
                  "block h-1.5 rounded-full transition-all duration-300",
                  index === active ? "w-6 bg-brand-500" : "w-1.5 bg-line-strong",
                )}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
