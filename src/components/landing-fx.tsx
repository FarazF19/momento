"use client";

import { useEffect } from "react";

export function LandingFx() {
  useEffect(() => {
    document.documentElement.classList.add("landing-fx");
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll(".reveal, .reveal-stagger > *").forEach((el) => el.classList.add("is-in"));
      return;
    }
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(".reveal, .reveal-stagger > *"));
    const seen = new Map<HTMLElement | null, number>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      }
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    for (const el of nodes) {
      const parent = el.parentElement;
      const index = seen.get(parent) ?? 0;
      seen.set(parent, index + 1);
      el.style.setProperty("--d", `${Math.min(index, 6) * 70}ms`);
      observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);
  return null;
}
