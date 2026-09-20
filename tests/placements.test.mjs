import test from "node:test";
import assert from "node:assert/strict";
import { validatePlacementSubmission } from "../src/lib/placement-validation.ts";
import { categories, moments } from "../src/lib/moments.ts";

const valid = {
  creatorName: "Example", email: "creator@example.com", handle: "@example", audience: "Local community",
  creatorCountry: "Pakistan", event: "Backpack patch", city: "Lahore", country: "Pakistan",
  startDate: "2026-11-01", endDate: "2026-11-07", description: "Daily public walks",
  deliverable: "Three hours per day", reach: "Not measured", deliverableDetails: "Daily dated photos",
  placementCategory: "Bags", industry: "Lifestyle", item: "Backpack", surface: "Front panel", dimensions: "10 x 8 cm",
  photoUrl: "https://example.com/bag.jpg", production: "Brand supplies patch", exclusivity: "One patch",
  followers: "10000", price: "60.50",
};
const validate = (body) => validatePlacementSubmission(body, "2026-09-19");

test("campaign examples use real public slot maps", () => {
  assert.ok(moments.length >= 2);
  assert.equal(new Set(moments.map((item) => item.slug)).size, moments.length);
  for (const item of moments) {
    assert.equal(item.isDemo, true);
    assert.ok(categories.includes(item.category) || categories.slice(1).includes(item.category));
    for (const field of ["surface", "dimensions", "duration", "itinerary", "visibility", "proof", "production", "exclusivity"]) assert.ok(item[field]);
    assert.ok(item.inventory[0].price > 0);
    assert.ok(item.bodyKind);
    assert.ok(item.creator.portraitUrl);
  }
});
test("accepts physical ad space from a creator meeting the audience threshold", () => assert.equal(validate(valid), null));
test("requires surface, dimensions, photo, production, and proof", () => {
  for (const key of ["surface", "dimensions", "photoUrl", "production", "exclusivity", "deliverableDetails"])
    assert.ok(validate({ ...valid, [key]: "" }));
});
test("rejects event-only categories", () => assert.ok(validate({ ...valid, placementCategory: "Tech" })));
test("requires a recognised creator niche", () => {
  for (const industry of ["", "Crypto", "tech"]) assert.match(String(validate({ ...valid, industry })), /niche|field/);
  for (const industry of ["Tech", "Fashion", "Food & Drink"]) assert.equal(validate({ ...valid, industry }), null);
});
test("rejects invalid, reversed, and past dates", () => {
  for (const dates of [{ startDate: "2026-02-30" }, { endDate: "2026-10-01" }, { startDate: "2026-01-01" }, { endDate: "invalid" }])
    assert.ok(validate({ ...valid, ...dates }));
});
test("validates email and photo links", () => {
  for (const fields of [{ email: "broken@" }, { photoUrl: "javascript:alert(1)" }, { photoUrl: "http://example.com" }, { photoUrl: "https://user:password@example.com" }])
    assert.ok(validate({ ...valid, ...fields }));
});
test("rejects invalid asking prices and audience sizes", () => {
  for (const price of ["", "0", "-10", "100001", "1.001", "Infinity"]) assert.ok(validate({ ...valid, price }));
  for (const followers of ["", "-1", "0", "1.5", "9999999999"]) assert.ok(validate({ ...valid, followers }));
  assert.equal(validate({ ...valid, followers: "250" }), null);
});
