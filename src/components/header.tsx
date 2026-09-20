"use client";

import { useEffect, useState } from "react";
import { HeaderNav } from "./header-nav";

export function Header() {
  const [role, setRole] = useState<"creator" | "brand" | null>(null);

  useEffect(() => {
    let alive = true;
    import("@/lib/supabase/browser").then(({ supabaseBrowser }) => {
      const client = supabaseBrowser();
      if (!client) return;
      client.auth.getSession().then(({ data }) => {
        if (!alive) return;
        const next = data.session?.user?.user_metadata?.role;
        if (next === "creator" || next === "brand") setRole(next);
      });
    });
    return () => { alive = false; };
  }, []);

  return <HeaderNav role={role} />;
}
