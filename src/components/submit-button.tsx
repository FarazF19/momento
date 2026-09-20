"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

export function SubmitButton({ idle, pending }: { idle: string; pending: string }) {
  const status = useFormStatus();
  return (
    <Button type="submit" size="lg" className="auth-submit" disabled={status.pending}>
      {status.pending ? pending : idle}
    </Button>
  );
}

export function OutlineSubmitButton({ children, disabled }: { children: ReactNode; disabled?: boolean }) {
  return (
    <Button type="submit" variant="outline" className="auth-outline" disabled={disabled}>
      {children}
    </Button>
  );
}

export function DisabledSubmit({ children }: { children: ReactNode }) {
  return (
    <Button type="submit" size="lg" className="auth-submit" disabled>
      {children}
    </Button>
  );
}
