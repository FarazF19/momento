"use client";
import { useState } from "react";
const examples = [
  { label: "The outfit", position: "0% 0%", title: "Your next conference.", surface: "Front of hoodie", className: "hoodie" },
  { label: "The laptop", position: "50% 0%", title: "Your next coworking day.", surface: "Laptop lid", className: "laptop" },
  { label: "The bag", position: "100% 0%", title: "Your next city trip.", surface: "Backpack strap", className: "bag" },
];
export function HeroPlacement() {
  const [active, setActive] = useState(0);
  const example = examples[active];
  return <div className="launch-preview">
    <div className="launch-preview-tabs" role="group" aria-label="Explore example placements">{examples.map((item, index) => <button key={item.label} type="button" aria-pressed={active === index} onClick={() => setActive(index)}>{item.label}</button>)}</div>
    <div className={`launch-preview-photo ${example.className}`} style={{ backgroundPosition: example.position }} role="img" aria-label={`Illustration of a creator with a ${example.surface.toLowerCase()} advertising placement`}>
      <span className="launch-preview-label">Illustrative listing</span><span className="launch-preview-patch">YOUR<br />BRAND</span>
      <div className="launch-preview-photo-caption"><small>A creator. A place. Your brand.</small><strong>{example.title}</strong></div>
    </div>
    <div className="launch-preview-details" aria-live="polite"><div><span>01 · {example.surface}</span><strong>One day. One placement.</strong></div><div><strong>$250</strong><span>Example asking price</span></div></div>
    <div className="launch-preview-proof"><span>Creator approves the brand</span><span>3 dated photos · example terms</span></div>
  </div>;
}
