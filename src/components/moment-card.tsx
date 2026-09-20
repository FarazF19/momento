"use client";

import Link from "next/link";
import type { Moment } from "@/lib/moments";
import { formatPrice } from "@/lib/moments";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowIcon } from "./icons";

export function MomentCard({ moment }: { moment: Moment; featured?: boolean }) {
  const href = `/placements/${moment.slug}`;
  const photo = moment.photoUrl || moment.creator.portraitUrl;
  const slots = moment.slots?.length || moment.inventory.length;
  const price = moment.raisedLabel || formatPrice(Math.min(...moment.inventory.map((item) => item.price)));

  return (
    <Card className="campaign-card landing-campaign-card">
      <Link className="campaign-photo" href={href} aria-label={moment.title}>
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt="" loading="lazy" decoding="async" />
        ) : (
          <span className="campaign-initials" style={{ background: moment.color }}>{moment.creator.avatar}</span>
        )}
        <Badge className="space-zone landing-slot-badge">{slots} slots</Badge>
      </Link>
      <CardHeader className="campaign-meta">
        <p className="space-kicker">{moment.creator.niche}</p>
        <CardTitle>
          <Link href={href}>{moment.title}</Link>
        </CardTitle>
        <CardDescription className="space-where">{moment.tagline}</CardDescription>
      </CardHeader>
      <CardFooter className="campaign-meta-row">
        <div><strong>{price}</strong><small>{moment.city}</small></div>
        <Link className="space-cta" href={href}>Open campaign <ArrowIcon /></Link>
      </CardFooter>
    </Card>
  );
}
