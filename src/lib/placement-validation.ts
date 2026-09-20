const kinds = ["Clothing", "Laptops", "Bags", "Travel"];
const niches = ["Tech", "Fashion", "Beauty", "Fitness", "Food & Drink", "Travel", "Gaming", "Music", "Business", "Lifestyle"];

export function sanitizeHandle(value: string, fallbackName = "") {
  const cleaned = String(value || "").trim().replace(/^@+/, "").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 30);
  if (cleaned) return `@${cleaned}`;
  const fromName = String(fallbackName || "").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 30);
  return fromName ? `@${fromName}` : "";
}

export function isAllowedPhotoUrl(value: string) {
  const photo = String(value || "").trim();
  if (photo.startsWith("/campaigns/") && photo.length > "/campaigns/".length && !/\s/.test(photo)) return true;
  if (photo.startsWith("data:image/") && photo.includes(",") && !/\s/.test(photo)) return true;
  try {
    const url = new URL(photo);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}

function validCalendarDate(date: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date) && Number.isFinite(Date.parse(date)) && new Date(date).toISOString().slice(0, 10) === date;
}

export function validatePlacementSubmission(body: Record<string, unknown>, today = new Date().toISOString().slice(0, 10)): string | null {
  const required = ["creatorName", "email", "handle", "audience", "creatorCountry", "event", "city", "country", "startDate", "endDate", "description", "deliverable", "reach", "deliverableDetails", "placementCategory", "industry", "item", "surface", "dimensions", "photoUrl", "production", "exclusivity"];
  if (required.some((key) => typeof body[key] !== "string" || !(body[key] as string).trim())) return "Please complete every placement field.";
  if (!kinds.includes(String(body.placementCategory))) return "Choose a valid placement category.";
  if (!niches.includes(String(body.industry))) return "Choose the niche that best matches your audience.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(body.email))) return "Enter a valid work email.";
  const price = Number(body.price);
  const followers = Number(body.followers);
  if (body.followers === "" || !Number.isSafeInteger(followers) || followers < 1 || followers > 2147483647) return "Enter your audience size as a whole number.";
  if (!Number.isFinite(price) || price < 1 || price > 100000 || Math.abs(price * 100 - Math.round(price * 100)) > 0.000001) return "Enter an asking price between $1 and $100,000 with at most two decimal places.";
  const start = String(body.startDate);
  const end = String(body.endDate);
  if (!validCalendarDate(start) || !validCalendarDate(end) || start < today || end < start) return "Choose valid dates: starting today or later and ending on or after the start.";
  try {
    const photo = new URL(String(body.photoUrl));
    if (photo.protocol !== "https:" || photo.username || photo.password) return "Use an HTTPS photo link without embedded credentials.";
  } catch { return "Enter a valid HTTPS link to your item photo."; }
  return null;
}

export function validateSimpleListing(body: Record<string, unknown>, today = new Date().toISOString().slice(0, 10)): string | null {
  const required = ["event", "city", "country", "startDate", "endDate", "handle", "placementCategory"];
  if (required.some((key) => typeof body[key] !== "string" || !(body[key] as string).trim())) {
    return "Please complete the event, city, country, dates, handle, and placement category.";
  }
  if (!kinds.includes(String(body.placementCategory))) return "Choose a valid placement category.";
  const start = String(body.startDate);
  const end = String(body.endDate);
  if (!validCalendarDate(start) || !validCalendarDate(end) || start < today || end < start) {
    return "Choose valid dates: starting today or later and ending on or after the start.";
  }
  if (String(body.priceMode || "") !== "offer") {
    const price = Number(body.price);
    if (!Number.isFinite(price) || price < 1 || price > 100000 || Math.abs(price * 100 - Math.round(price * 100)) > 0.000001) {
      return "Enter an asking price between $1 and $100,000 with at most two decimal places.";
    }
  }
  if (!isAllowedPhotoUrl(String(body.photoUrl || ""))) {
    return "Use an HTTPS photo, a /campaigns/ path, or a data:image upload.";
  }
  return null;
}
