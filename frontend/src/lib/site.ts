/**
 * Site level configuration.
 *
 * Outbound links render only when they are configured, so the shipped UI never
 * contains a dead placeholder link.
 */

export const siteConfig = {
  name: "SchemaHealer",
  tagline: "Automatic schema recovery for data pipelines",
  githubUrl: process.env.NEXT_PUBLIC_GITHUB_URL ?? "",
  /** Feedback form endpoint. The section is hidden when this is empty. */
  feedbackEndpoint:
    process.env.NEXT_PUBLIC_FEEDBACK_ENDPOINT ?? "https://formspree.io/f/xeajogkv",
} as const;

/** Answers offered for "How did you discover SchemaHealer?". */
export const DISCOVERY_OPTIONS = [
  "LinkedIn",
  "Instagram",
  "Threads",
  "Google Search",
  "GitHub",
  "Portfolio Website",
  "Friend or Colleague",
  "Other",
] as const;

export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

export function primaryNavLinks(): NavLink[] {
  const links: NavLink[] = [
    { label: "Product", href: "/#product" },
    { label: "How it works", href: "/#how-it-works" },
    { label: "Live demo", href: "/#demo" },
    { label: "About", href: "/#about" },
  ];

  if (siteConfig.githubUrl) {
    links.push({ label: "GitHub", href: siteConfig.githubUrl, external: true });
  }

  return links;
}
