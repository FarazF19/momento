"use client";

import { useState } from "react";
import Link from "next/link";
import type { Moment } from "@/lib/moments";
import { formatPrice } from "@/lib/moments";
import { ArrowIcon } from "./icons";
import { CampaignStage } from "./campaign-stage";

export function CampaignCard({ moment }: { moment: Moment }) {
  const [open, setOpen] = useState(false);
  const face = moment.creator.portraitUrl || "";
  const cover = moment.photoUrl || face;
  const dark = moment.bodyKind === "body";
  const href = `/placements/${moment.slug}`;
  const slots = moment.slots ?? [];

  return (
    <article className={`campaign-card${open ? " is-open" : ""}${dark ? " is-dark" : ""}`}>
      <div
        className="campaign-flip"
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-label={`${moment.creator.name} campaign. ${open ? "Showing slots" : "Showing photo"}.`}
        onClick={() => setOpen((value) => !value)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen((value) => !value);
          }
        }}
      >
        <div className="campaign-face campaign-cover">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="campaign-cover-photo" src={cover} alt="" />
          {face && face !== cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="campaign-cover-face" src={face} alt="" />
          ) : null}
          <div className="campaign-cover-shade">
            <span className="campaign-kicker">{moment.city} · {moment.dates}</span>
            <strong className="campaign-cover-name">{moment.creator.name}</strong>
            <span className="campaign-cover-detail">{moment.creator.handle} · {moment.surface}</span>
            <b>{moment.raisedLabel}</b>
          </div>
        </div>
        <div className="campaign-face campaign-inside">
          <div className="campaign-mini">
            {moment.bodyKind ? <CampaignStage kind={moment.bodyKind} slots={slots} compact photo={moment.photoUrl} /> : null}
            <div className="campaign-mini-body">
              <p>On this Momento page</p>
              <ul>
                {slots.slice(0, 4).map((slot) => (
                  <li key={slot.id}>
                    <i style={{ background: slot.color }} />
                    <span>{slot.name}</span>
                    <b>{formatPrice(slot.price)}</b>
                  </li>
                ))}
              </ul>
              <Link className="space-cta" href={href} onClick={(event) => event.stopPropagation()}>
                Open campaign <ArrowIcon />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="campaign-meta">
        <div>
          <p className="space-kicker">{moment.creator.niche}</p>
          <h3><Link href={href}>{moment.title}</Link></h3>
          <p className="space-where">{moment.tagline}</p>
        </div>
        <div className="campaign-meta-row">
          <div>
            <strong>{moment.raisedLabel}</strong>
            <small>{slots.length || moment.inventory.length} slots · offered here</small>
          </div>
          <Link className="space-cta" href={href}>Open campaign <ArrowIcon /></Link>
        </div>
      </div>
    </article>
  );
}
