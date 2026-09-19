export type InventoryItem = {
  id: string;
  name: string;
  description: string;
  timing: string;
  reach: string;
  price: number;
  remaining: number;
};

export type Moment = {
  slug: string;
  event: string;
  city: string;
  country: string;
  dates: string;
  month: string;
  category: "Tech" | "Fashion" | "Culture" | "Travel" | "Gaming";
  tagline: string;
  creator: {
    name: string;
    handle: string;
    niche: string;
    followers: string;
    engagement: string;
    avatar: string;
  };
  image: string;
  color: string;
  accent: string;
  inventory: InventoryItem[];
  fit: string[];
};

export const moments: Moment[] = [
  {
    slug: "sxsw-austin",
    event: "SXSW Austin",
    city: "Austin",
    country: "USA",
    dates: "12–20 Mar 2027",
    month: "MAR",
    category: "Tech",
    tagline: "The ideas shaping culture, captured from the ground.",
    creator: {
      name: "Lena Park",
      handle: "@lenamakes",
      niche: "Tech × culture",
      followers: "186K",
      engagement: "4.9%",
      avatar: "LP",
    },
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1400&q=85",
    color: "#ff5b3a",
    accent: "#ffe04d",
    inventory: [
      { id: "reel", name: "Event recap Reel", description: "A fast, cinematic recap with an integrated brand moment.", timing: "During event", reach: "55K–100K", price: 1800, remaining: 2 },
      { id: "stories", name: "3 Story frames", description: "Live coverage with tag, link, and a clear campaign message.", timing: "During event", reach: "25K–60K", price: 650, remaining: 4 },
      { id: "newsletter", name: "Newsletter field note", description: "A dedicated section in Lena's post-event field note.", timing: "Within 3 days", reach: "18K subscribers", price: 900, remaining: 1 },
    ],
    fit: ["AI tools", "Creator tech", "Travel"],
  },
  {
    slug: "cannes-film-festival",
    event: "Cannes Film Festival",
    city: "Cannes",
    country: "France",
    dates: "11–22 May 2027",
    month: "MAY",
    category: "Culture",
    tagline: "Film, style, and the stories behind the red carpet.",
    creator: {
      name: "Marco Alvarez",
      handle: "@marcoframes",
      niche: "Film & lifestyle",
      followers: "320K",
      engagement: "5.4%",
      avatar: "MA",
    },
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1400&q=85",
    color: "#4f63ff",
    accent: "#ff8e67",
    inventory: [
      { id: "diary", name: "Festival video diary", description: "One editorial day-in-the-life film with natural product placement.", timing: "During event", reach: "90K–180K", price: 3200, remaining: 1 },
      { id: "stories", name: "5 Story frames", description: "Arrival, venue, and event coverage with campaign link.", timing: "During event", reach: "45K–90K", price: 1100, remaining: 3 },
      { id: "photos", name: "Photo set", description: "Six campaign-ready stills licensed for organic brand channels.", timing: "Within 5 days", reach: "Brand-owned", price: 1500, remaining: 2 },
    ],
    fit: ["Fashion", "Travel", "Cameras"],
  },
  {
    slug: "london-design-festival",
    event: "London Design Festival",
    city: "London",
    country: "United Kingdom",
    dates: "11–19 Sep 2027",
    month: "SEP",
    category: "Culture",
    tagline: "Design lives in the details—and in the people who notice them.",
    creator: {
      name: "Maya Chen",
      handle: "@mayacitynotes",
      niche: "Design & city culture",
      followers: "128K",
      engagement: "5.6%",
      avatar: "MC",
    },
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1400&q=85",
    color: "#ffe04d",
    accent: "#ff5b3a",
    inventory: [
      { id: "reel", name: "Festival Reel", description: "A short, cinematic recap from the festival.", timing: "During event", reach: "40K–90K", price: 1800, remaining: 3 },
      { id: "stories", name: "3 Story frames", description: "Behind-the-scenes coverage with tag and link.", timing: "During event", reach: "25K–60K", price: 650, remaining: 5 },
      { id: "newsletter", name: "Newsletter field note", description: "A personal report from London with a dedicated brand mention.", timing: "Within 3 days", reach: "8K–15K", price: 900, remaining: 2 },
    ],
    fit: ["Design tools", "Travel", "Culture"],
  },
  {
    slug: "tokyo-game-show",
    event: "Tokyo Game Show",
    city: "Tokyo",
    country: "Japan",
    dates: "23–26 Sep 2027",
    month: "SEP",
    category: "Gaming",
    tagline: "New worlds, hardware, and culture from Tokyo.",
    creator: {
      name: "Kaito Sato",
      handle: "@kaitoplays",
      niche: "Gaming & tech",
      followers: "278K",
      engagement: "6.1%",
      avatar: "KS",
    },
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1400&q=85",
    color: "#9cff57",
    accent: "#4f63ff",
    inventory: [
      { id: "hands-on", name: "Hands-on video", description: "A dedicated short-form demo recorded on the show floor.", timing: "During event", reach: "80K–160K", price: 2400, remaining: 2 },
      { id: "stories", name: "4 Story frames", description: "Live reactions and product placement from the venue.", timing: "During event", reach: "35K–70K", price: 800, remaining: 4 },
      { id: "stream", name: "Livestream mention", description: "A 60-second integrated segment in the nightly recap stream.", timing: "Event evening", reach: "12K live", price: 1200, remaining: 2 },
    ],
    fit: ["Games", "Hardware", "Energy"],
  },
  {
    slug: "new-york-fashion-week",
    event: "New York Fashion Week",
    city: "New York",
    country: "USA",
    dates: "8–14 Sep 2027",
    month: "SEP",
    category: "Fashion",
    tagline: "Street style, emerging labels, and the view from the front row.",
    creator: {
      name: "Isabella Cruz",
      handle: "@isabellainmotion",
      niche: "Fashion & beauty",
      followers: "412K",
      engagement: "4.7%",
      avatar: "IC",
    },
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=85",
    color: "#ff8bc7",
    accent: "#ffe04d",
    inventory: [
      { id: "look", name: "Sponsored look", description: "One styled look featured in an editorial Reel and photo carousel.", timing: "During event", reach: "120K–240K", price: 4500, remaining: 1 },
      { id: "stories", name: "5 Story frames", description: "Show-day coverage with product tag and link.", timing: "During event", reach: "70K–130K", price: 1350, remaining: 3 },
      { id: "roundup", name: "Trend roundup mention", description: "Integrated placement in the post-week trend report.", timing: "Within 5 days", reach: "90K–170K", price: 1800, remaining: 2 },
    ],
    fit: ["Fashion", "Beauty", "Accessories"],
  },
  {
    slug: "web-summit-lisbon",
    event: "Web Summit Lisbon",
    city: "Lisbon",
    country: "Portugal",
    dates: "1–4 Nov 2027",
    month: "NOV",
    category: "Tech",
    tagline: "Startups, operators, and what the internet builds next.",
    creator: {
      name: "Andre Silva",
      handle: "@andrebuilds",
      niche: "Startups & business",
      followers: "260K",
      engagement: "4.3%",
      avatar: "AS",
    },
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1400&q=85",
    color: "#73d8ff",
    accent: "#ff5b3a",
    inventory: [
      { id: "interview", name: "Founder interview", description: "A concise on-site conversation packaged for short-form channels.", timing: "During event", reach: "65K–140K", price: 2800, remaining: 2 },
      { id: "stories", name: "3 Story frames", description: "Live event coverage with campaign message and link.", timing: "During event", reach: "30K–65K", price: 700, remaining: 4 },
      { id: "brief", name: "Operator brief mention", description: "A native mention in Andre's post-event email briefing.", timing: "Within 2 days", reach: "22K subscribers", price: 1100, remaining: 2 },
    ],
    fit: ["B2B software", "Fintech", "Founder tools"],
  },
];

export const categories = ["All", "Tech", "Fashion", "Culture", "Travel", "Gaming"] as const;

export function getMoment(slug: string) {
  return moments.find((moment) => moment.slug === slug);
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}
