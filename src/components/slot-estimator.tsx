"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { Accordion, Badge as OxygenBadge, Button as OxygenButton, Slider } from "@geomak/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowIcon, CheckIcon } from "@/components/icons";

const presets = [150, 250, 500, 800];

export function SlotEstimator() {
  const [slots, setSlots] = useState(8);
  const [price, setPrice] = useState(250);
  const total = useMemo(() => slots * price, [slots, price]);

  return (
    <div className="slot-estimator">
      <Slider
        htmlFor="est-slots"
        label="Numbered slots"
        min={4}
        max={15}
        value={slots}
        showValue
        formatValue={(n) => `${n} zones`}
        onChange={(value) => setSlots(value as number)}
      />
      <div>
        <Slider
          htmlFor="est-price"
          label="Ask per slot"
          min={50}
          max={2000}
          step={50}
          value={price}
          showValue
          formatValue={(n) => `$${n}`}
          onChange={(value) => setPrice(value as number)}
        />
        <div className="slot-estimator-presets">
          <OxygenBadge tone="accent" variant="soft">${price} ask</OxygenBadge>
          {presets.map((value) => (
            <OxygenButton
              key={value}
              content={`$${value}`}
              variant={price === value ? "primary" : "outline"}
              size="sm"
              onClick={() => setPrice(value)}
            />
          ))}
        </div>
      </div>
      <p className="slot-estimator-total">
        <span>If every slot fills</span>
        <strong>${total.toLocaleString()}</strong>
      </p>
    </div>
  );
}

export function LandingEyebrow() {
  return <Badge variant="outline" className="landing-eyebrow">Physical ad marketplace</Badge>;
}

export function LandingTrust() {
  return (
    <div className="trust-row">
      <Badge variant="secondary" className="landing-trust"><CheckIcon /> Offers stay here</Badge>
      <Badge variant="secondary" className="landing-trust"><CheckIcon /> Dated photos required</Badge>
      <Badge variant="secondary" className="landing-trust"><CheckIcon /> No follower minimum</Badge>
    </div>
  );
}

export function LandingCta({
  href,
  children,
  tone = "primary",
  size,
}: {
  href: string;
  children: ReactNode;
  tone?: "primary" | "outline" | "dark";
  size?: "lg";
}) {
  return (
    <Button
      size={size}
      variant={tone === "outline" ? "outline" : "default"}
      className={`landing-btn landing-btn-${tone}`}
      nativeButton={false}
      render={<Link href={href} />}
    >
      {children}
    </Button>
  );
}

export function LandingHeroActions({ listHref, browseHref }: { listHref: string; browseHref: string }) {
  return (
    <div className="hero-actions">
      <LandingCta href={listHref} tone="primary" size="lg">List your slots <ArrowIcon /></LandingCta>
      <LandingCta href={browseHref} tone="outline" size="lg">Browse open slots</LandingCta>
    </div>
  );
}

export function LandingFaq() {
  return (
    <Accordion type="single" collapsible variant="contained" className="landing-faq reveal">
      <Accordion.Item value="pay" title="How does payment work?">
        An accepted offer locks the slot and the terms. Checkout is not live, so no money is taken. Do not start paid work until payment is on.
      </Accordion.Item>
      <Accordion.Item value="proof" title="What if photos never land?">
        Every listing requires dated photos on the same campaign page. If they do not land, the brand can stop and raise it from the dashboard. We do not hold funds until checkout is live.
      </Accordion.Item>
      <Accordion.Item value="size" title="Do I need a big following?">
        No. There is no follower minimum. Brands buy the zone and the room you walk into.
      </Accordion.Item>
      <Accordion.Item value="list" title="How do I list my slots?">
        Create a creator account. Add the event, a photo, how many spots, and a price. Publish. Brands offer on that page.
      </Accordion.Item>
      <Accordion.Item value="site" title="Do I need my own website?">
        No. The campaign URL lives on Momento. Brands open it, pick a slot, and send an offer here.
      </Accordion.Item>
    </Accordion>
  );
}
