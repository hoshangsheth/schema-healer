import { LogoMark } from "@/components/shared/Icons";

const FOOTER_LINKS = [
  { href: "#product", label: "Product" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#demo", label: "Try SchemaHealer" },
  { href: "#about", label: "About" },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-ink-200 bg-ink-50">
      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5 font-semibold tracking-tight text-ink-900">
              <LogoMark className="h-8 w-8" />
              <span className="text-[17px]">SchemaHealer</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-ink-500">
              AI-powered schema recovery for reliable data pipelines.
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-col gap-2.5 sm:items-end">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-ink-500 transition-colors hover:text-ink-900"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="mt-10 border-t border-ink-200 pt-6 text-xs text-ink-400">
          SchemaHealer is under active development. This is a staging build.
        </p>
      </div>
    </footer>
  );
}
