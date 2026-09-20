"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function LandingMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(".hero-copy > *", { y: 12, duration: 0.4, stagger: 0.05, ease: "power2.out" });
      gsap.from(".hero-feature", { y: 14, duration: 0.45, ease: "power2.out", delay: 0.08 });
      gsap.to(".ticker-track", { xPercent: -50, ease: "none", duration: 32, repeat: -1 });

      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.from(el, {
          autoAlpha: 0, y: 18, duration: 0.42, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 92%", toggleActions: "play none none none" },
        });
      });
    });
    return () => ctx.revert();
  }, []);
  return null;
}
