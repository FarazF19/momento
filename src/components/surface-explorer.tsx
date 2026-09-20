"use client";

import { useState } from "react";
import { TEMPLATES } from "@/lib/campaign-draft";

const shown = TEMPLATES.filter((item) => item.id === "body" || item.id === "kit" || item.id === "dress" || item.id === "upper");

export function SurfaceExplorer() {
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState<number | null>(0);
  const template = shown[active];
  const count = 8;
  const photo = template.id === "dress" ? "/campaigns/vanshu-dress.png" : "/campaigns/marc-lou-og.jpg";
  const pins = template.id === "dress"
    ? [
        { top: "28%", left: "50%" },
        { top: "36%", left: "50%" },
        { top: "36%", left: "58%" },
        { top: "62%", left: "50%" },
        { top: "42%", left: "44%" },
        { top: "42%", left: "56%" },
        { top: "52%", left: "50%" },
        { top: "24%", left: "56%" },
      ]
    : [
        { top: "36%", left: "64%" },
        { top: "36%", left: "71%" },
        { top: "42%", left: "76%" },
        { top: "48%", left: "56%" },
        { top: "60%", left: "64%" },
        { top: "60%", left: "71%" },
        { top: "34%", left: "28%" },
        { top: "30%", left: "68%" },
      ].slice(0, count);

  return (
    <div className="surface-explorer">
      <div className="surface-tabs" role="tablist" aria-label="Placement types">
        {shown.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active === index}
            className={active === index ? "is-on" : ""}
            onClick={() => { setActive(index); setHover(0); }}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="surface-play">
        <div className={`surface-stage is-photo${template.bodyKind === "dress" ? " is-light" : ""}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo} alt="" />
          {pins.map((pin, index) => (
            <button
              key={`${template.id}-${index}`}
              type="button"
              className={`surface-pin${hover === index ? " is-on" : ""}`}
              style={{ top: pin.top, left: pin.left, animationDelay: `${index * 40}ms` }}
              onMouseEnter={() => setHover(index)}
              onFocus={() => setHover(index)}
              onClick={() => setHover(index)}
            >
              {String(index + 1).padStart(2, "0")}
            </button>
          ))}
        </div>
        <ol className="surface-slots">
          {template.slotNames.slice(0, count).map((name, index) => (
            <li key={name} className={hover === index ? "is-on" : ""} onMouseEnter={() => setHover(index)}>
              <b>{String(index + 1).padStart(2, "0")}</b>
              <span>{name}</span>
              <small>Open</small>
            </li>
          ))}
        </ol>
      </div>
      <p className="surface-hint">Click a number. That is one priced zone a brand can offer on.</p>
    </div>
  );
}
