"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "./logo";
import { CloseIcon, MenuIcon } from "./icons";
import { Button } from "@/components/ui/button";

function listHref(role: "creator" | "brand" | null) {
  if (role === "creator") return "/studio";
  if (role === "brand") return "/discover";
  return "/login?mode=signup&role=creator&next=/studio";
}

export function HeaderNav({ role }: { role: "creator" | "brand" | null }) {
  const [open, setOpen] = useState(false);
  const primaryHref = listHref(role);
  const primaryLabel = role === "brand" ? "Browse open slots" : "List your slots";
  const signInHref = role ? "/dashboard" : "/login";
  const signInLabel = role ? "Dashboard" : "Sign in";

  return (
    <header className="site-header">
      <div className="header-inner shell">
        <Logo />
        <nav className={open ? "nav-links nav-open" : "nav-links"} aria-label="Primary navigation">
          <Link href="/discover" onClick={() => setOpen(false)}>Browse slots</Link>
          <Link href="/#how-it-works" onClick={() => setOpen(false)}>How it works</Link>
          <Link href="/brands" onClick={() => setOpen(false)}>For brands</Link>
          <Link href="/creators" onClick={() => setOpen(false)}>For creators</Link>
          <div className="mobile-actions">
            <Button nativeButton={false} variant="outline" className="header-btn-outline" render={<Link href={signInHref} onClick={() => setOpen(false)} />}>
              {signInLabel}
            </Button>
            <Button nativeButton={false} className="header-cta" render={<Link href={primaryHref} onClick={() => setOpen(false)} />}>
              {primaryLabel}
            </Button>
          </div>
        </nav>
        <div className="header-actions">
          <Button nativeButton={false} variant="outline" size="sm" className="header-btn-outline" render={<Link href={signInHref} />}>
            {signInLabel}
          </Button>
          <Button nativeButton={false} size="sm" className="header-cta" render={<Link href={primaryHref} />}>
            {primaryLabel}
          </Button>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="menu-button"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </Button>
      </div>
    </header>
  );
}
