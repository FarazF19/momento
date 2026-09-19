import { Header } from "@/components/header";
import { PaymentStatus } from "@/components/payment-status";

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: Promise<{ booking?: string }> }) {
  const { booking } = await searchParams;
  return (
    <>
      <Header />
      <PaymentStatus bookingId={booking || ""} />
    </>
  );
}
