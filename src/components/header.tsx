"use client";

import { useEffect, useState } from "react";
import { HeaderNav } from "./header-nav";
import { supabaseBrowser } from "@/lib/supabase/browser";

export function Header() {
  const [role, setRole] = useState<"creator" | "brand" | null>(null);

  useEffect(() => {
    const client = supabaseBrowser();
    if (!client) return;
    client.auth.getSession().then(({ data }) => {
      const next = data.session?.user?.user_metadata?.role;
      if (next === "creator" || next === "brand") setRole(next);
    });
  }, []);

  return <HeaderNav role={role} />;
}
