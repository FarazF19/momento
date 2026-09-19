import { Header } from "@/components/header";
import { PayoutOnboarding } from "@/components/payout-onboarding";

export default async function PayoutOnboardingPage({ searchParams }: { searchParams: Promise<{ listing?: string; token?: string }> }) {
  const { listing = "", token = "" } = await searchParams;
  return (
    <>
      <Header />
      <PayoutOnboarding listingId={listing} token={token} />
    </>
  );
}
