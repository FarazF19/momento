"use client";

import type { AdSlot } from "@/lib/moments";

const bodyPins = [
  { top: "36%", left: "48.5%" },
  { top: "36%", left: "51.8%" },
  { top: "41%", left: "55.5%" },
  { top: "50%", left: "46%" },
  { top: "58%", left: "48.5%" },
  { top: "58%", left: "51.8%" },
];

const dressPins = [
  { top: "28%", left: "50%" },
  { top: "38%", left: "50%" },
  { top: "48%", left: "42%" },
  { top: "48%", left: "58%" },
  { top: "58%", left: "50%" },
  { top: "70%", left: "50%" },
];

export function CampaignStage({
  kind,
  slots = [],
  compact = false,
  photo,
}: {
  kind: "body" | "dress";
  slots?: AdSlot[];
  compact?: boolean;
  photo?: string;
}) {
  const pins = kind === "dress" ? dressPins : bodyPins;
  return (
    <div className={`slot-scene${compact ? " slot-scene-compact" : ""}${kind === "dress" ? " is-light" : ""}`} aria-hidden="true">
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="slot-photo" src={photo} alt="" />
      ) : null}
      <div className="slot-pins">
        {slots.slice(0, pins.length).map((slot, index) => (
          <span key={slot.id} className="slot-pin" style={{ top: pins[index].top, left: pins[index].left, background: slot.color }}>
            {slot.brand}
          </span>
        ))}
      </div>
    </div>
  );
}
