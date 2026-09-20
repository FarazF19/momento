"use client";

import type { AdSlot } from "@/lib/moments";
import { pinsFor, type PlacementTemplate } from "@/lib/campaign-draft";

export function CampaignStage({
  kind,
  slots = [],
  compact = false,
  photo,
  template,
}: {
  kind: "body" | "dress";
  slots?: AdSlot[];
  compact?: boolean;
  photo?: string;
  template?: PlacementTemplate;
}) {
  const pins = pinsFor(template || (kind === "dress" ? "dress" : "body"), Math.min(slots.length, 15));
  return (
    <div className={`slot-scene${compact ? " slot-scene-compact" : ""}${kind === "dress" ? " is-light" : ""}`} aria-hidden="true">
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="slot-photo" src={photo} alt="" />
      ) : null}
      <div className="slot-pins">
        {slots.slice(0, pins.length).map((slot, index) => (
          <span key={slot.id} className="slot-pin" style={{ top: pins[index].top, left: pins[index].left, background: slot.color }}>
            {slot.brand === "Open" ? String(index + 1).padStart(2, "0") : slot.brand}
          </span>
        ))}
      </div>
    </div>
  );
}
