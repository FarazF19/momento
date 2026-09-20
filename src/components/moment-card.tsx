"use client";

import Link from "next/link";
import type { Moment } from "@/lib/moments";
import { formatPrice } from "@/lib/moments";
import { Badge } from "@/components/ui/badge";
import { ArrowIcon } from "./icons";

function BrandDot({ name, color }: { name: string; color: string }) {
  const letters = name.replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase() || "B";
  const ink = color === "#ffe04d" || color === "#9cff57";
  return (
    <span className="campaign-brand" title={name} style={{ background: color, color: ink ? "#111" : "#fff" }}>
      {letters}
    </span>
  );
}

export function MomentCard({ moment }: { moment: Moment; featured?: boolean }) {
  const href = `/placements/${moment.slug}`;
  const photo = moment.creator.portraitUrl || moment.photoUrl;
  const slots = Number(moment.surface.match(/\d+/)?.[0]) || moment.slots?.length || moment.inventory.length;
  const price = moment.isDemo ? "Sample campaign" : moment.raisedLabel || `From ${formatPrice(Math.min(...moment.inventory.map((item) => item.price)))}`;
  const brands = [...new Map((moment.slots ?? []).map((slot) => [slot.brand, slot])).values()].slice(0, 6);
  const face = moment.creator.portraitUrl;

  return (
    <article className="campaign-card landing-campaign-card">
      <Link className="campaign-photo" href={href} aria-label={moment.title}>
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt="" loading="lazy" decoding="async" />
        ) : (
          <span className="campaign-initials" style={{ background: moment.color }}>{moment.creator.avatar}</span>
        )}
        <Badge className="space-zone landing-slot-badge">{moment.isDemo ? "Example · not bookable" : `${slots} placements`}</Badge>
      </Link>
      <div className="campaign-who">
        {face ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={face} alt="" />
        ) : (
          <span className="campaign-who-fallback">{moment.creator.avatar}</span>
        )}
        <div>
          <strong>{moment.creator.name}</strong>
          <small>{moment.creator.handle} · {moment.city}</small>
        </div>
      </div>
      <div className="campaign-meta">
        <p className="space-kicker">{moment.creator.niche}</p>
        {!moment.isDemo && <div className="campaign-audience"><span>{moment.creator.followers} followers</span>{moment.creator.socialUrl && <a href={moment.creator.socialUrl} target="_blank" rel="noreferrer">View social profile ↗</a>}</div>}
        <h3>
          <Link href={href}>{moment.title}</Link>
        </h3>
        <p className="space-where">{moment.tagline}</p>
        {!moment.isDemo && brands.length > 0 ? (
          <div className="campaign-brands" aria-label="Brands on this page">
            {brands.map((slot) => (
              <BrandDot key={slot.brand} name={slot.brand} color={slot.color} />
            ))}
          </div>
        ) : null}
      </div>
      <div className="campaign-meta-row">
        <div><strong>{price}</strong><small>{moment.dates}</small></div>
        <Link className="space-cta" href={href}>{moment.isDemo ? "View example" : "View creator"} <ArrowIcon /></Link>
      </div>
      {moment.isDemo && <p className="campaign-sample-note">Format illustration. No affiliation, availability, or earnings on Momento implied.</p>}
    </article>
  );
}

