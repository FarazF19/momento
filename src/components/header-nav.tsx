"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "./logo";
import { CloseIcon, MenuIcon } from "./icons";

function listHref(role: "creator" | "brand" | null) {
  if (role === "creator") return "/studio";
  if (role === "brand") return "/discover";
  return "/login?mode=signup&role=creator&next=/studio";
}

export function HeaderNav({ role }: { role: "creator" | "brand" | null }) {
  const [open, setOpen] = useState(false);
  const primaryHref = listHref(role);
  const primaryLabel = role === "brand" ? "Browse open slots" : "List your slots";

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
            <Link href={role ? "/dashboard" : "/login"} className="button button-outline">{role ? "Dashboard" : "Sign in"}</Link>
            <Link href={primaryHref} className="button button-primary">{primaryLabel}</Link>
          </div>
        </nav>
        <div className="header-actions">
          <Link href={role ? "/dashboard" : "/login"} className="text-link">{role ? "Dashboard" : "Sign in"}</Link>
          <Link href={primaryHref} className="button button-primary button-small">{primaryLabel}</Link>
        </div>
        <button className="menu-button" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"}>
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
    </header>
  );
}
