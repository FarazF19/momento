"use client";

import { useEffect, useRef } from "react";

export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      if (motion.matches) ref.current?.pause();
      else void ref.current?.play().catch(() => {});
    };
    sync();
    motion.addEventListener("change", sync);
    return () => motion.removeEventListener("change", sync);
  }, []);
  return (
    <figure className="hero-explainer">
      <video ref={ref} muted loop playsInline controls preload="metadata" poster="/creators/film-poster.jpg" aria-label="How Momento works: creators list ad space on everyday items, brands make offers, and creators provide placement proof" aria-describedby="hero-video-caption">
        <source src="/creators/momento-film.mp4" type="video/mp4" />
        Your browser cannot play this video. Creators list ad space, brands make an offer, and creators provide photo proof.
      </video>
      <figcaption id="hero-video-caption">Your brand. Their everyday. A 16-second concept film with fictional creators and AI-created imagery.</figcaption>
    </figure>
  );
}
