"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function LandingMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(".hero-copy > *", { y: 16, duration: 0.48, stagger: 0.06, ease: "power3.out" });
      gsap.from(".hero-feature", { y: 20, duration: 0.55, delay: 0.1, ease: "power3.out" });
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.from(el, {
          y: 28, autoAlpha: 0, duration: 0.55, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>(".reveal-stagger").forEach((group) => {
        gsap.from(group.children, {
          y: 26, autoAlpha: 0, duration: 0.5, stagger: 0.09, ease: "power3.out",
          scrollTrigger: { trigger: group, start: "top 86%", once: true },
        });
      });
    });
    return () => ctx.revert();
  }, []);
  return null;
}
