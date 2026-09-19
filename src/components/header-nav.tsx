"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "./logo";
import { CloseIcon, MenuIcon } from "./icons";

export function HeaderNav({ role }: { role: "creator" | "brand" | null }) {
  const [open, setOpen] = useState(false);
  const actionHref = role === "brand" ? "/discover" : role === "creator" ? "/list" : "/login?mode=signup";
  const actionLabel = role === "brand" ? "Find ad space" : role === "creator" ? "List ad space" : "Get started";

  return (
    <header className="site-header">
      <div className="header-inner shell">
        <Logo />
        <nav className={open ? "nav-links nav-open" : "nav-links"} aria-label="Primary navigation">
          <Link href="/discover" onClick={() => setOpen(false)}>Ad spaces</Link>
          <Link href="/brands" onClick={() => setOpen(false)}>For brands</Link>
          <Link href="/creators" onClick={() => setOpen(false)}>For creators</Link>
          <div className="mobile-actions">
            <Link href={role ? "/dashboard" : "/login"} className="button button-outline">{role ? "Dashboard" : "Sign in"}</Link>
            <Link href={actionHref} className="button button-primary">{actionLabel}</Link>
          </div>
        </nav>
        <div className="header-actions">
          <Link href={role ? "/dashboard" : "/login"} className="text-link">{role ? "Dashboard" : "Sign in"}</Link>
          <Link href={actionHref} className="button button-primary button-small">{actionLabel}</Link>
        </div>
        <button className="menu-button" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"}>
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
    </header>
  );
}
