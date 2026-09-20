import Link from "next/link";
import { moments } from "@/lib/moments";

type Chip = {
  kind: "creator" | "brand";
  name: string;
  note: string;
  href: string;
  photo?: string;
  color?: string;
  handle?: string;
};

function chipsFromExamples(): Chip[] {
  const chips: Chip[] = [];
  for (const moment of moments.filter((item) => item.bodyKind)) {
    const href = `/placements/${moment.slug}`;
    chips.push({
      kind: "creator",
      name: moment.creator.name,
      handle: moment.creator.handle,
      note: `${moment.surface} · ${moment.city}`,
      photo: moment.creator.portraitUrl || moment.photoUrl || "",
      href,
    });
    const seen = new Set<string>();
    for (const slot of moment.slots ?? []) {
      if (seen.has(slot.brand)) continue;
      seen.add(slot.brand);
      chips.push({
        kind: "brand",
        name: slot.brand,
        note: `on ${slot.name.toLowerCase()}`,
        color: slot.color,
        href,
      });
    }
  }
  return chips;
}

function BrandMark({ name, color }: { name: string; color: string }) {
  const letters = name.replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase() || "B";
  const ink = color === "#ffe04d" || color === "#9cff57";
  return (
    <span className="proof-mark" style={{ background: color, color: ink ? "#111" : "#fff" }} aria-hidden>
      {letters}
    </span>
  );
}

export function ProofTicker() {
  const chips = chipsFromExamples();
  const loop = [...chips, ...chips];

  return (
    <div className="proof-ticker" aria-label="Format examples from creators and the brands on their pages">
      <p className="proof-ticker-kicker">Format examples · creators and brands already mapped this way</p>
      <div className="proof-ticker-mask">
        <div className="proof-ticker-track">
          {loop.map((chip, index) => (
            <Link
              key={`${chip.kind}-${chip.name}-${index}`}
              href={chip.href}
              className={`proof-chip is-${chip.kind}`}
            >
              {chip.kind === "creator" ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={chip.photo} alt="" />
                  <span>
                    <b>{chip.name}</b>
                    <small>{chip.handle} · {chip.note}</small>
                  </span>
                </>
              ) : (
                <>
                  <BrandMark name={chip.name} color={chip.color ?? "#0b0d10"} />
                  <span>
                    <b>{chip.name}</b>
                    <small>{chip.note}</small>
                  </span>
                </>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
