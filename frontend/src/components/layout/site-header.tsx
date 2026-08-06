"use client";

import Link from "next/link";
import { useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowRight, Menu } from "lucide-react";

import { cn } from "@/lib/cn";
import { primaryNavLinks, type NavLink } from "@/lib/site";
import { ButtonLink } from "@/components/shared/button";
import { Logo } from "@/components/shared/logo";
import { NavDrawer } from "@/components/layout/nav-drawer";

/**
 * Sticky marketing navigation. Transparent over the hero, condensing into a
 * glass bar once the page scrolls. Below the large breakpoint the links move
 * into a slide out drawer.
 *
 * The condensed state is a CSS transition rather than an animated style, so
 * the browser is not laying the bar out again on every scroll frame.
 */
export function SiteHeader() {
  const [condensed, setCondensed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const links = primaryNavLinks();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const next = latest > 24;
    setCondensed((current) => (current === next ? current : next));
  });

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-90">
        <div
          className={cn(
            "border-b transition-[padding,background-color,border-color,box-shadow] duration-300",
            condensed
              ? "glass-panel border-line/80 py-2 shadow-soft sm:py-2.5"
              : "border-transparent bg-transparent py-3 sm:py-4",
          )}
        >
          <nav
            aria-label="Primary"
            className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-5 sm:px-8"
          >
            <Logo />

            <ul className="hidden items-center gap-1 lg:flex">
              {links.map((link) => (
                <li key={link.label}>
                  <NavItem link={link} />
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2">
              <ButtonLink
                href="/app"
                size="sm"
                className="hidden lg:inline-flex"
                trailingIcon={<ArrowRight className="size-3.5" aria-hidden />}
              >
                Try SchemaHealer
              </ButtonLink>

              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-expanded={menuOpen}
                aria-haspopup="dialog"
                aria-label="Open menu"
                className="flex size-11 items-center justify-center rounded-xl border border-line bg-surface text-ink-700 shadow-soft transition-colors active:bg-surface-2 lg:hidden"
              >
                <Menu className="size-5" aria-hidden />
              </button>
            </div>
          </nav>
        </div>
      </header>

      <NavDrawer open={menuOpen} onClose={() => setMenuOpen(false)} links={links} />
    </>
  );
}

function NavItem({ link }: { link: NavLink }) {
  const className =
    "inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium text-ink-600 transition-colors hover:text-ink-900";

  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noreferrer noopener" className={className}>
        {link.label}
      </a>
    );
  }

  return (
    <Link href={link.href} className={className}>
      {link.label}
    </Link>
  );
}
