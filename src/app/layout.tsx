import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Momento — Sponsor what happens next",
  description: "A marketplace where creators list where they are going and brands sponsor what they make there.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
