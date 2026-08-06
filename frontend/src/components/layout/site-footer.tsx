import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ButtonLink } from "@/components/shared/button";
import { Logo } from "@/components/shared/logo";
import { siteConfig } from "@/lib/site";

const COLUMNS = [
  {
    heading: "Product",
    links: [
      { label: "Why SchemaHealer", href: "/#product" },
      { label: "How it works", href: "/#how-it-works" },
      { label: "Live demo", href: "/#demo" },
      { label: "About", href: "/#about" },
    ],
  },
  {
    heading: "Recovery",
    links: [
      { label: "Known name matching", href: "/#how-it-works" },
      { label: "Close match detection", href: "/#how-it-works" },
      { label: "AI recovery", href: "/#how-it-works" },
      { label: "Verification", href: "/#how-it-works" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="relative border-t border-line bg-surface">
      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
          <div className="space-y-3">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-ink-500">
              A recovery layer that sits in front of your pipeline, so a renamed
              column never becomes an incident.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.heading} className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-400">
                {column.heading}
              </p>
              <ul className="space-y-0.5 lg:space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="inline-flex min-h-11 items-center text-sm text-ink-600 transition-colors hover:text-brand-700 lg:min-h-0"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="space-y-4 rounded-card border border-line bg-surface-2 p-5">
            <div className="space-y-1.5">
              <p className="text-[0.9375rem] font-semibold tracking-[-0.01em] text-ink-900">
                Ready to stop patching spreadsheets?
              </p>
              <p className="text-[0.8125rem] leading-relaxed text-ink-500">
                Upload a file and see the recovery report in under a minute.
              </p>
            </div>
            <ButtonLink
              href="/app"
              size="md"
              fullWidth
              className="justify-center sm:w-auto"
              trailingIcon={<ArrowRight className="size-3.5" aria-hidden />}
            >
              Open the workspace
            </ButtonLink>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-line pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-ink-400">
            © {new Date().getFullYear()} {siteConfig.name}. A recovery layer for
            customer data pipelines.
          </p>
          {siteConfig.githubUrl ? (
            <a
              href={siteConfig.githubUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="text-xs text-ink-400 transition-colors hover:text-ink-700"
            >
              Source
            </a>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
