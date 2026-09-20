import test from "node:test";
import assert from "node:assert/strict";
import { sanitizeHandle, validatePlacementSubmission, validateSimpleListing } from "../src/lib/placement-validation.ts";

const simple = {
  event: "Berlin marathon kit",
  city: "Berlin",
  country: "Germany",
  startDate: "2026-11-01",
  endDate: "2026-11-02",
  handle: "@runner",
  placementCategory: "Clothing",
  photoUrl: "/campaigns/body-placeholder.svg",
  price: "200",
};

const validate = (body) => validateSimpleListing(body, "2026-09-20");

test("sanitizeHandle keeps @alphanum only", () => {
  assert.equal(sanitizeHandle("@You_Name!"), "@youname");
  assert.equal(sanitizeHandle("Maya City"), "@mayacity");
  assert.equal(sanitizeHandle("@@@"), "");
  assert.equal(sanitizeHandle("", "Ayesha Khan"), "@ayeshakhan");
});

test("validateSimpleListing accepts a minimal listing with a local campaign photo", () => {
  assert.equal(validate(simple), null);
  assert.equal(validate({ ...simple, photoUrl: "https://example.com/kit.jpg" }), null);
  assert.equal(validate({ ...simple, photoUrl: "data:image/png;base64,iVBORw0KGgo=" }), null);
});

test("validateSimpleListing requires event, city, country, dates, handle, and category", () => {
  for (const key of ["event", "city", "country", "startDate", "endDate", "handle", "placementCategory"]) {
    assert.ok(validate({ ...simple, [key]: "" }));
  }
  assert.ok(validate({ ...simple, placementCategory: "Tech" }));
});

test("validateSimpleListing enforces dates starting today or later", () => {
  assert.ok(validate({ ...simple, startDate: "2026-09-19" }));
  assert.ok(validate({ ...simple, startDate: "2026-11-03", endDate: "2026-11-02" }));
  assert.ok(validate({ ...simple, startDate: "2026-02-30" }));
});

test("validateSimpleListing checks price unless offer mode", () => {
  for (const price of ["", "0", "-1", "100001", "1.001"]) assert.ok(validate({ ...simple, price }));
  assert.equal(validate({ ...simple, priceMode: "offer", price: "" }), null);
  assert.equal(validate({ ...simple, priceMode: "offer" }), null);
});

test("validateSimpleListing rejects unsafe photo URLs", () => {
  for (const photoUrl of ["http://example.com/a.jpg", "javascript:alert(1)", "/other/photo.jpg", "data:text/plain,hi"]) {
    assert.ok(validate({ ...simple, photoUrl }));
  }
});

test("validatePlacementSubmission stays exported for the full listing form", () => {
  const full = {
    creatorName: "Example", email: "creator@example.com", handle: "@example", audience: "Local community",
    creatorCountry: "Pakistan", event: "Backpack patch", city: "Lahore", country: "Pakistan",
    startDate: "2026-11-01", endDate: "2026-11-07", description: "Daily public walks",
    deliverable: "Three hours per day", reach: "Not measured", deliverableDetails: "Daily dated photos",
    placementCategory: "Bags", industry: "Lifestyle", item: "Backpack", surface: "Front panel", dimensions: "10 x 8 cm",
    photoUrl: "https://example.com/bag.jpg", production: "Brand supplies patch", exclusivity: "One patch",
    followers: "10000", price: "60.50",
  };
  assert.equal(validatePlacementSubmission(full, "2026-09-19"), null);
});
