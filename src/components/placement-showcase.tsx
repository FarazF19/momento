"use client";
import { useState } from "react";
import Link from "next/link";
import { PlacementArt } from "./placement-art";
const examples = [
  { category: "Clothing" as const, label: "Wear it", title: "A hoodie. A city. Your brand.", surface: "Chest patch · 10 × 8 cm", route: "City walks in Dubai", duration: "7 days", price: "$175", color: "#efd9cc" },
  { category: "Laptops" as const, label: "Use it", title: "A new home for your brand.", surface: "Laptop lid · 12 × 8 cm", route: "Cafés & coworking in Lahore", duration: "30 days", price: "$120", color: "#dde5d6" },
  { category: "Travel" as const, label: "Take it places", title: "A small patch. A whole new city.", surface: "Daypack panel · 10 × 10 cm", route: "A week exploring Tokyo", duration: "7 days", price: "$250", color: "#e5dff1" },
];
export function PlacementShowcase() {
  const [selected, setSelected] = useState(0);
  const item = examples[selected];
  return <section className="placement-showcase" aria-label="Explore how a placement works">
    <div className="showcase-tabs" role="group" aria-label="Example placement type">{examples.map((example, index) => <button key={example.category} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}>{example.label}</button>)}</div>
    <div className="showcase-scene" style={{ background: item.color }}><span className="showcase-label">Illustrative placement · not a live listing</span><PlacementArt category={item.category} title={item.surface} /><span className="showcase-sticker">Your brand<br /><b>goes here ↗</b></span></div>
    <div className="showcase-caption" aria-live="polite"><span className="eyebrow">{item.route}</span><h2>{item.title}</h2><p>{item.surface}</p><div className="showcase-price"><span><b>{item.price}</b> asking / {item.duration}</span><Link href="/discover">Explore spaces ↗</Link></div></div>
    <div className="showcase-process"><span>01 List the space</span><span>02 Brand offers</span><span>03 Creator chooses</span></div>
  </section>;
}
