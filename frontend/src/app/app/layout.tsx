import type { Metadata } from "next";

import { AppHeader } from "@/components/layout/app-header";

export const metadata: Metadata = {
  title: "Recovery workspace",
  description:
    "Upload a CSV file, watch the recovery run, and download a checked file with the column names your systems expect.",
};

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
    </div>
  );
}
