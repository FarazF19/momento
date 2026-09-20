import type { Metadata } from "next";
import { ScrollFx } from "@/components/scroll-fx";
import "./globals.css";

export const metadata: Metadata = {
  title: "Momento — Numbered ad slots on real people",
  description: "Creators list numbered ad spots on their body and clothes for an event. Brands send offers on this site. Photo proof comes back on the same page.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body><ScrollFx />{children}</body>
    </html>
  );
}
