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
      <Badge variant="secondary" className="landing-trust"><CheckIcon /> You approve every brand</Badge>
      <Badge variant="secondary" className="landing-trust"><CheckIcon /> Dated photos required</Badge>
      <Badge variant="secondary" className="landing-trust"><CheckIcon /> 10K+ on one social platform</Badge>
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
      <LandingCta href={listHref} tone="primary" size="lg">I’m a creator <ArrowIcon /></LandingCta>
      <LandingCta href={browseHref} tone="outline" size="lg">Find creators</LandingCta>
    </div>
  );
}

export function LandingFaq() {
  return (
    <Accordion type="single" collapsible variant="contained" className="landing-faq reveal">
      <Accordion.Item value="pay" title="How does payment work?">
        You can create a listing and discuss offers during early access. Checkout and automatic payouts are not enabled yet. Accepting an offer does not take payment or confirm a paid booking. Do not start paid work until payment is available and confirmed.
      </Accordion.Item>
      <Accordion.Item value="proof" title="What if photos never land?">
        Agree on the photo requirements and deadline before a campaign. Photos document where the branding appeared; they do not measure impressions or guarantee sales. Payment, cancellation, and refund terms must be shown before paid checkout launches.
      </Accordion.Item>
      <Accordion.Item value="size" title="Do I need a big following?">
        Creators need at least 10,000 followers on one public Instagram, TikTok, or X account. Counts across accounts are not combined. We check profile ownership and audience size before publishing.
      </Accordion.Item>
      <Accordion.Item value="list" title="How do I list my slots?">
        Create a creator account, confirm your email, and verify your social profile. Add your event, an original photo, placement details, asking price, and required proof. Then publish your page.
      </Accordion.Item>
      <Accordion.Item value="production" title="Who prints and ships the branding?">Agree this in the listing: who supplies the artwork, who produces and ships the patch or sticker, the deadline, and whether those costs are included in the asking price. The creator approves the design before wearing it.</Accordion.Item>
      <Accordion.Item value="site" title="Do I need my own website?">
        No. Your listing has its own Momento URL. Share it with brands so they can review the creator, event, placement, and proposed terms.
      </Accordion.Item>
    </Accordion>
  );
}

