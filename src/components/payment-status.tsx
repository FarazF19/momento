"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowIcon, CheckIcon } from "./icons";

type Status = {
  payment_status: string;
  booking_status: string;
};

export function PaymentStatus({ bookingId }: { bookingId: string }) {
  const [status, setStatus] = useState<Status | null>(null);
  const [stopped, setStopped] = useState(false);

  useEffect(() => {
    if (!bookingId) return;
    let cancelled = false;
    let attempts = 0;

    async function check() {
      attempts += 1;
      try {
        const response = await fetch(`/api/bookings/${bookingId}/status`, { cache: "no-store" });
        if (response.ok && !cancelled) {
          const next = await response.json() as Status;
          setStatus(next);
          if (["paid", "failed", "expired", "reversed", "amount_mismatch"].includes(next.payment_status)) return;
        }
      } catch {
        // The webhook can arrive after the redirect, so retry briefly.
      }
      if (!cancelled && attempts < 10) window.setTimeout(check, 2000);
      else if (!cancelled) setStopped(true);
    }

    check();
    return () => { cancelled = true; };
  }, [bookingId]);

  const paid = status?.payment_status === "paid";
  const failed = status && ["failed", "expired", "reversed", "amount_mismatch"].includes(status.payment_status);

  return (
    <main className="status-page shell">
      <div className={paid ? "status-mark paid" : failed ? "status-mark failed" : "status-mark pending"}>{paid ? <CheckIcon /> : failed ? "!" : "···"}</div>
      <div className="eyebrow"><span /> {paid ? "Payment confirmed" : failed ? "Payment needs attention" : "Confirming payment"}</div>
      <h1>{paid ? <>Your moment is<br />being confirmed.</> : failed ? <>That payment did<br />not complete.</> : <>We’re checking with<br />the payment provider.</>}</h1>
      <p>{paid ? "The provider webhook confirmed payment. Next, the creator reviews the campaign and the work begins." : failed ? "No booking has been confirmed. Return to the moment to try again or choose another payment method." : stopped ? "Confirmation is taking longer than usual. We’ll update the booking from the provider webhook; you can safely close this page." : "A redirect alone never marks a booking paid. This page will update when the signed provider webhook arrives."}</p>
      <div className="status-steps">
        <span className={paid ? "done" : "active"}><b>1</b>Payment</span>
        <span className={paid ? "active" : ""}><b>2</b>Creator confirmation</span>
        <span><b>3</b>Automatic payout after approval</span>
      </div>
      <Link href="/discover" className="button button-dark button-large">Keep exploring <ArrowIcon /></Link>
    </main>
  );
}
