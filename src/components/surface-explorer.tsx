"use client";

import { useState, type ReactNode } from "react";
import { SegmentedControl, ThemeProvider } from "@geomak/ui";
import { TEMPLATES } from "@/lib/campaign-draft";

const shown = TEMPLATES.filter((item) => item.id === "body" || item.id === "kit" || item.id === "dress" || item.id === "upper");

const landingTheme = {
  colors: {
    background: "#f4f0e6",
    surface: "#fffdf8",
    "surface-raised": "#fffdf8",
    border: "rgba(11, 13, 16, 0.2)",
    "border-strong": "#0b0d10",
    foreground: "#0b0d10",
    "foreground-secondary": "#2b2924",
    "foreground-muted": "#6d6a62",
    accent: "#ff5b3a",
    "accent-hover": "#e24a2c",
    "accent-foreground": "#0b0d10",
    warning: "#c9a116",
  },
  shadows: {
    sm: "2px 2px 0 #0b0d10",
    md: "4px 4px 0 #0b0d10",
    lg: "6px 6px 0 #0b0d10",
    xl: "8px 8px 0 #0b0d10",
  },
  typography: {
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  radius: {
    md: 5,
    lg: 8,
    xl: 12,
  },
};

export function LandingTheme({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider colorScheme="light" className="landing-oxygen" theme={landingTheme}>
      {children}
    </ThemeProvider>
  );
}

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
      <SegmentedControl
        aria-label="Placement types"
        fullWidth
        value={template.id}
        onChange={(value) => {
          const index = shown.findIndex((item) => item.id === value);
          if (index < 0) return;
          setActive(index);
          setHover(0);
        }}
        options={shown.map((item) => ({ value: item.id, label: item.label }))}
      />
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

function MomentoCard({ index, title, children, featured }: { index?: string; title: string; children: ReactNode; featured?: boolean }) {
  return (
    <article className={`momento-card${featured ? " is-on" : ""}`}>
      {index ? <span className="momento-card-index">{index}</span> : null}
      <h3>{title}</h3>
      <div className="momento-card-body">{children}</div>
    </article>
  );
}

export function LandingHow() {
  return (
    <div className="how-now-grid reveal-stagger">
      <MomentoCard index="01" title="Number the zones">
        Chest, sleeve, jersey, dress. Price each one. Tie them to a race, a conference, or a city week.
      </MomentoCard>
      <MomentoCard index="02" title="Take the offer">
        A brand picks one square, sends a brief and a price. You approve it here.
      </MomentoCard>
      <MomentoCard index="03" featured title="Wear it. Prove it.">
        Approve the art, wear the mark, upload dated photos to the same page.
      </MomentoCard>
    </div>
  );
}

export function LandingInclude() {
  return (
    <div className="include-grid reveal-stagger">
      <MomentoCard index="01" title="The wear">
        The logo sits on that zone for the dates you list. The clothes stay yours.
      </MomentoCard>
      <MomentoCard index="02" title="The proof">
        Dated photos land on the campaign page. Brands do not chase a DM.
      </MomentoCard>
      <MomentoCard index="03" title="The exclusive">
        One brand per number. No second logo on the same square of fabric.
      </MomentoCard>
      <MomentoCard index="04" title="The deal">
        Offer, accept, and approve artwork on Momento. No hop to another site.
      </MomentoCard>
    </div>
  );
}

export function LandingCompare() {
  return (
    <div className="compare-table reveal-stagger">
      <MomentoCard title="A sponsored post">
        <ul>
          <li>Gone after a day in the feed</li>
          <li>Reach is a screenshot</li>
          <li>Hard to say where the logo sat</li>
          <li>The proof link dies</li>
        </ul>
      </MomentoCard>
      <MomentoCard featured title="A numbered slot">
        <ul>
          <li>Worn in a real room, on a real date</li>
          <li>One zone, one price</li>
          <li>Chest, sleeve, dress — you can name it</li>
          <li>Dated photos stay on the page</li>
        </ul>
      </MomentoCard>
    </div>
  );
}

export function LandingProof() {
  return (
    <div className="proof-line reveal-stagger">
      <MomentoCard index="01" title="Before">
        Brand sends artwork. You approve it. The slot is reserved here.
      </MomentoCard>
      <MomentoCard index="02" featured title="During">
        The mark is worn for the dates on the listing.
      </MomentoCard>
      <MomentoCard index="03" title="After">
        Dated photos upload to the campaign. Anyone with the link can see them.
      </MomentoCard>
    </div>
  );
}
