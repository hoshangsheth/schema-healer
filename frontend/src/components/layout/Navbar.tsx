"use client";

import { useState } from "react";

import { Button, LinkButton } from "@/components/shared/Button";
import { LogoMark } from "@/components/shared/Icons";

const NAV_LINKS = [
  { href: "#product", label: "Product" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#about", label: "About" },
] as const;

/**
 * Sticky top navigation.
 *
 * There is no authentication in SchemaHealer, so there is no sign-in
 * control here — the only call to action is the interactive demo.
 */
export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-ink-200/70 bg-white/85 backdrop-blur-md">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8"
      >
        <a
          href="#top"
          className="flex items-center gap-2.5 font-semibold tracking-tight text-ink-900"
        >
          <LogoMark className="h-8 w-8" />
          <span className="text-[17px]">SchemaHealer</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-ink-500 transition-colors hover:text-ink-900"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <LinkButton href="#demo">Try SchemaHealer</LinkButton>
        </div>

        <Button
          variant="ghost"
          className="md:hidden"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? "Close" : "Menu"}
        </Button>
      </nav>

      {isMenuOpen && (
        <div
          id="mobile-nav"
          className="border-t border-ink-200 bg-white px-5 py-4 md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <LinkButton
            href="#demo"
            className="mt-3 w-full"
            onClick={() => setIsMenuOpen(false)}
          >
            Try SchemaHealer
          </LinkButton>
        </div>
      )}
    </header>
  );
}
