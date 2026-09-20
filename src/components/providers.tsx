"use client";

import "@geomak/ui/styles";
import { ThemeProvider, TooltipProvider } from "@geomak/ui";

const momentoTheme = {
  colors: {
    background: "#f4f0e6",
    surface: "#fffdf8",
    "surface-raised": "#fffdf8",
    border: "rgba(11, 13, 16, 0.2)",
    "border-strong": "#0b0d10",
    foreground: "#0b0d10",
    "foreground-secondary": "#0b0d10",
    "foreground-muted": "#6d6a62",
    accent: "#ff5b3a",
    "accent-hover": "#e04a2c",
    "accent-foreground": "#0b0d10",
  },
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider colorScheme="light" theme={momentoTheme}>
      <TooltipProvider>{children}</TooltipProvider>
    </ThemeProvider>
  );
}
