import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Providers } from "@/components/providers";
import "./globals.css";
import "./launch.css";

export const metadata: Metadata = {
  title: "Momento — Sponsor their next adventure",
  description: "Meet creators heading to real events. Sponsor a placement on what they wear or carry, agree on the details, and get photo proof.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

