import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Momento — Your brand. Their everyday.",
  description: "Rent advertising space on creators’ clothes, laptops, bags, and upcoming trips. Creators list the space. Brands make an offer.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
