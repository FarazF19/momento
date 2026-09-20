import Link from "next/link";
export function GettingStarted({ creator, listed, offered, accepted }: { creator: boolean; listed: boolean; offered: boolean; accepted: boolean }) {
  const steps = creator ? [
    { title: "List your first ad space", text: "Choose an item, show the surface, and set your dates and asking price.", done: listed, href: "/list", action: "Create a listing" },
    { title: "Review brand offers", text: "Compare the brand, brief, and price. You decide which offers fit.", done: offered, href: "#offers", action: "View incoming offers" },
    { title: "Agree the placement", text: "Accept the right fit to reserve the space. Payment is not enabled yet—do not start paid work.", done: accepted, href: "#offers", action: "Review terms" },
  ] : [
    { title: "Find your first ad space", text: "Compare creators’ items by location, surface, dates, and asking price.", done: offered, href: "/discover", action: "Browse ad spaces" },
    { title: "Send a clear offer", text: "Open a live listing, propose your price, and describe your brand and artwork.", done: offered, href: "/discover", action: "Find a placement" },
    { title: "Track the response", text: "An accepted offer reserves terms; it is not a payment. Keep track of the creator’s decision here.", done: accepted, href: "#offers", action: "View my offers" },
  ];
  return <section className="getting-started" aria-labelledby="getting-started-title"><div className="guide-heading"><div><span className="eyebrow">Your next steps</span><h2 id="getting-started-title">{creator ? "Turn one item into an opportunity." : "Start with one well-placed brand."}</h2></div><span>Email confirmed ✓</span></div><ol>{steps.map((step, i) => <li key={step.title}><span className={step.done ? "step-number complete" : "step-number"}>{step.done ? "✓" : `0${i + 1}`}</span><h3>{step.title}</h3><p>{step.text}</p><Link href={step.href}>{step.action} →</Link></li>)}</ol></section>;
}
