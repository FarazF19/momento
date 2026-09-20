"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Reliable scroll-reveal for every browser: elements get `.will-reveal` (hidden)
// only once JS runs, then `.in-view` as they enter the viewport, staggered per
// container. Skipped entirely for users who prefer reduced motion.
const TARGETS = [
  ".people-card", ".steps-grid article", ".audience-grid article", ".getting-started li",
  ".section-heading", ".how-heading", ".brand-poster", ".brand-copy", ".faq-section h2",
  ".faq-section details", ".final-cta > div", ".audience-note", ".stat-strip span",
  ".value-split article", ".audience-cta", ".discovery-tools", ".dashboard-list article",
].join(",");

export function ScrollFx() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname === "/" || typeof IntersectionObserver === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const elements = Array.from(document.querySelectorAll<HTMLElement>(TARGETS));
    if (!elements.length) return;
    const seen = new Map<HTMLElement | null, number>();
    const viewport = window.innerHeight;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.06 });
    for (const el of elements) {
      if (el.classList.contains("in-view") || el.getBoundingClientRect().top < viewport * 0.85) continue; // never hide what's already on screen
      const siblingIndex = seen.get(el.parentElement) ?? 0;
      seen.set(el.parentElement, siblingIndex + 1);
      el.style.setProperty("--reveal-delay", `${Math.min(siblingIndex, 5) * 90}ms`);
      el.classList.add("will-reveal");
      observer.observe(el);
    }
    return () => observer.disconnect();
  }, [pathname]);
  return null;
}
