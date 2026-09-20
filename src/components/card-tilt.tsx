"use client";

import Atropos from "atropos/react";
import "atropos/css";
import type { ReactNode } from "react";

export function CardTilt({ children }: { children: ReactNode }) {
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return (
    <Atropos
      className="space-tilt"
      rotate={!reduced}
      rotateXMax={11}
      rotateYMax={14}
      shadowScale={1}
      highlight={!reduced}
      duration={400}
    >
      {children}
    </Atropos>
  );
}
