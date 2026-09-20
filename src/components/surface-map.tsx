"use client";

import { useState } from "react";
import Link from "next/link";
import { PlacementArt } from "./placement-art";

const zones = [
  { id: "clothes", category: "Clothing" as const, zone: "Chest / tee", size: "12 × 8 cm patch", where: "Cafés, streets, weekends", pitch: "The Marc Lou idea, everyday: a logo on the body someone already takes into a room." },
  { id: "laptop", category: "Laptops" as const, zone: "Laptop lid", size: "10 × 7 cm sticker", where: "Coworking, flights, meetups", pitch: "The indie-Twitter classic. The lid faces the room for hours. You buy those hours, not a banner." },
  { id: "bag", category: "Bags" as const, zone: "Bag panel", size: "15 × 10 cm patch", where: "Commutes and trips", pitch: "A walking billboard with a start date and an end date. Flights only if the listing says so." },
];

export function SurfaceMap() {
  const [active, setActive] = useState(1);
  const zone = zones[active];
  return <section className="surface-map" aria-label="Available advertising surfaces">
    <div className="surface-tabs" role="tablist">
      {zones.map((item, index) => (
        <button key={item.id} type="button" role="tab" aria-selected={active === index} className={active === index ? "on" : ""} onClick={() => setActive(index)}>
          <small>0{index + 1}</small>{item.zone}
        </button>
      ))}
    </div>
    <div className="surface-stage" key={zone.id}>
      <div className="surface-art">
        <PlacementArt category={zone.category} title={zone.zone} />
        <span className="space-sticker slap">Your logo<br /><b>goes here</b></span>
      </div>
      <div className="surface-copy">
        <div className="eyebrow"><span /> The inventory is the object</div>
        <h2>{zone.zone}.</h2>
        <p>{zone.pitch}</p>
        <ul>
          <li>{zone.size} — you know the exact rectangle</li>
          <li>Seen at {zone.where.toLowerCase()}</li>
          <li>Creator keeps the item. You rent the surface.</li>
        </ul>
        <Link href="/discover" className="button button-primary button-large">See listings on this surface</Link>
      </div>
    </div>
  </section>;
}
