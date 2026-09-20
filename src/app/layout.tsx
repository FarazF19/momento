import type { Metadata } from "next";
import { ScrollFx } from "@/components/scroll-fx";
import "./globals.css";

export const metadata: Metadata = {
  title: "Momento — Numbered slots on a real person",
  description: "Write one line. We turn it into a campaign page with a slot map. Brands offer on Momento.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body><ScrollFx />{children}</body>
    </html>
  );
}
