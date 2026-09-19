import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

function secret() {
  const value = process.env.ONBOARDING_TOKEN_SECRET;
  if (!value || value.length < 32) throw new Error("ONBOARDING_TOKEN_SECRET must be at least 32 characters");
  return value;
}

export function createOnboardingToken(listingId: string) {
  const expires = Math.floor(Date.now() / 1000) + 24 * 60 * 60;
  const payload = `${listingId}.${expires}`;
  const signature = createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function verifyOnboardingToken(listingId: string, token: string) {
  const [tokenId, expiresText, signature] = token.split(".");
  if (tokenId !== listingId || !expiresText || !signature || Number(expiresText) < Math.floor(Date.now() / 1000)) return false;
  const payload = `${tokenId}.${expiresText}`;
  const expected = createHmac("sha256", secret()).update(payload).digest();
  let received: Buffer;
  try { received = Buffer.from(signature, "base64url"); } catch { return false; }
  return received.length === expected.length && timingSafeEqual(received, expected);
}
