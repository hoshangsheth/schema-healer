import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { Providers } from "./providers";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "SchemaHealer: automatic schema recovery for data pipelines",
    template: "%s · SchemaHealer",
  },
  description:
    "SchemaHealer spots renamed and reworded columns in CSV files, works out where each one belongs, checks the result, and keeps your data pipelines running.",
  applicationName: "SchemaHealer",
  keywords: [
    "schema drift",
    "data pipeline reliability",
    "CSV column mapping",
    "data quality",
    "data engineering",
  ],
  openGraph: {
    title: "SchemaHealer: automatic schema recovery",
    description:
      "Spot renamed columns, recover the right fields automatically, and keep your data flowing without manual fixes.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#fbfbfe",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-canvas">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-200 focus:rounded-lg focus:bg-ink-900 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
        >
          Skip to content
        </a>
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
