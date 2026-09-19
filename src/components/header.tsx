"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "./logo";
import { CloseIcon, MenuIcon } from "./icons";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-inner shell">
        <Logo />
        <nav className={open ? "nav-links nav-open" : "nav-links"} aria-label="Primary navigation">
          <Link href="/discover" onClick={() => setOpen(false)}>Explore</Link>
          <Link href="/#how-it-works" onClick={() => setOpen(false)}>How it works</Link>
          <Link href="/#for-brands" onClick={() => setOpen(false)}>For brands</Link>
          <Link href="/list" onClick={() => setOpen(false)}>For creators</Link>
          <div className="mobile-actions">
            <Link href="/discover" className="button button-outline">Sign in</Link>
            <Link href="/list" className="button button-primary">List a moment</Link>
          </div>
        </nav>
        <div className="header-actions">
          <Link href="/discover" className="text-link">Sign in</Link>
          <Link href="/list" className="button button-primary button-small">List a moment</Link>
        </div>
        <button className="menu-button" type="button" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"}>
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
    </header>
  );
}
