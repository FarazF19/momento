"use client";

import { useState } from "react";
import {
  Card,
  SegmentedControl,
  Statistic,
  Stepper,
  ThemeProvider,
} from "@geomak/ui";
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

export function LandingTheme({ children }: { children: React.ReactNode }) {
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

export function LandingHow() {
  return (
    <>
      <div className="landing-stepper reveal">
        <Stepper
          current={2}
          steps={[
            { key: "list", title: "Creator lists the slots", description: "Numbered, priced, tied to an event." },
            { key: "offer", title: "Brand sends an offer", description: "One zone. The conversation stays here." },
            { key: "prove", title: "Wear it. Prove it.", description: "Dated photos on the same page." },
          ]}
        />
      </div>
      <div className="how-now-grid reveal-stagger">
        <Card className="landing-ox-card">
          <Card.Header title="Creator lists the slots" subtitle="01" />
          <Card.Body>Chest, sleeve, jersey, dress — numbered, priced, and tied to a real event or city.</Card.Body>
        </Card>
        <Card className="landing-ox-card">
          <Card.Header title="Brand sends an offer" subtitle="02" />
          <Card.Body>Pick one zone. Send a brief and a price. The conversation stays on Momento.</Card.Body>
        </Card>
        <Card className="landing-ox-card">
          <Card.Header title="Wear it. Prove it." subtitle="03" />
          <Card.Body>The creator approves the artwork, wears the mark, and uploads dated photos to the same page.</Card.Body>
        </Card>
      </div>
    </>
  );
}

export function LandingInclude() {
  return (
    <div className="include-grid reveal-stagger">
        <Card className="landing-ox-card">
        <Card.Header title="The wear" subtitle="01" />
        <Card.Body>The mark is on the numbered zone for the event dates you list. The clothes stay with the creator.</Card.Body>
      </Card>
      <Card className="landing-ox-card">
        <Card.Header title="The proof" subtitle="02" />
        <Card.Body>Dated photos go on the same campaign page. Brands do not have to chase a DM for evidence.</Card.Body>
      </Card>
      <Card className="landing-ox-card">
        <Card.Header title="The exclusivity" subtitle="03" />
        <Card.Body>One brand per numbered slot. Another logo does not sit on the same square of fabric.</Card.Body>
      </Card>
      <Card className="landing-ox-card">
        <Card.Header title="The conversation" subtitle="04" />
        <Card.Body>Offers, acceptance, and artwork approval stay on Momento. No outbound hop to another site.</Card.Body>
      </Card>
    </div>
  );
}

export function LandingCompare() {
  return (
    <div className="compare-table reveal">
      <Card className="landing-ox-card">
        <Card.Header title="Influencer post" />
        <Card.Body>
          <ul>
            <li>Lives in a feed for a day</li>
            <li>Reach is a screenshot</li>
            <li>Hard to say where the logo sat</li>
            <li>Proof is a link that dies</li>
          </ul>
        </Card.Body>
      </Card>
      <Card className="landing-ox-card is-on">
        <Card.Header title="Numbered slot" />
        <Card.Body>
          <ul>
            <li>Worn in a real room, on a real date</li>
            <li>One zone, one price</li>
            <li>Chest, sleeve, dress — you can name it</li>
            <li>Dated photos stay on the campaign page</li>
          </ul>
        </Card.Body>
      </Card>
    </div>
  );
}

export function LandingProof() {
  return (
    <div className="proof-line reveal-stagger">
      <Card className="landing-ox-card" padding="lg">
        <Statistic
          label="Before"
          value="Artwork approved"
          helpText="Brand sends artwork. Creator approves it. The slot is reserved on the same page."
        />
      </Card>
      <Card className="landing-ox-card" padding="lg">
        <Statistic
          label="During"
          value="Worn on the dates"
          helpText="The mark is worn for the dates on the listing — race, conference, city week."
        />
      </Card>
      <Card className="landing-ox-card" padding="lg">
        <Statistic
          label="After"
          value="Photos on the page"
          helpText="Dated photos upload to the campaign. Anyone with the link can see the proof."
        />
      </Card>
    </div>
  );
}
