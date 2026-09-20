import test from "node:test";
import assert from "node:assert/strict";
import {
  CAMPAIGN_DRAFT_STORE,
  TEMPLATES,
  clampSlotCount,
  draftId,
  draftToMoment,
  listingFields,
  pinsFor,
  shareText,
} from "../src/lib/campaign-draft.ts";

function sample(overrides = {}) {
  return {
    eventName: "City Marathon",
    startDate: "2026-10-12",
    endDate: "2026-10-12",
    city: "Berlin",
    country: "Germany",
    description: "Full race, then the recap.",
    template: "kit",
    slotCount: 8,
    photos: [],
    priceMode: "ask",
    price: 250,
    wornFullEvent: true,
    photoProof: true,
    exclusive: true,
    socialMention: false,
    handle: "@aya",
    niche: "Fitness",
    creatorName: "Aya Khan",
    ...overrides,
  };
}

test("draftId is stable for the same event fields", () => {
  const draft = sample();
  assert.equal(draftId(draft), draftId({ ...draft }));
  assert.equal(draftId(draft), draftId({ ...draft, photos: ["data:image/jpeg;base64,xx"], price: 999 }));
  assert.notEqual(draftId(draft), draftId(sample({ eventName: "Night Run" })));
  assert.match(draftId(draft), /^city-marathon-[a-z0-9]+$/);
});

test("generated moments never reuse example creator photos", () => {
  const empty = draftToMoment(sample({ photos: [] }));
  const marc = draftToMoment(sample({ photos: ["/campaigns/marc-lou.png", "/campaigns/marc-lou-og.jpg"] }));
  const vanshu = draftToMoment(sample({ template: "dress", photos: ["/campaigns/vanshu.jpg", "/campaigns/vanshu-dress.png"] }));
  const mixed = draftToMoment(sample({ photos: ["/campaigns/marc-lou.png", "/uploads/mine.jpg"] }));
  for (const moment of [empty, marc, vanshu, mixed]) {
    assert.doesNotMatch(moment.photoUrl, /marc-lou|vanshu/);
    assert.notEqual(moment.slug, "marc-lou-hyrox");
    assert.notEqual(moment.slug, "vanshu-token2049");
  }
  assert.equal(empty.photoUrl, "/campaigns/body-placeholder.svg");
  assert.equal(marc.photoUrl, "/campaigns/body-placeholder.svg");
  assert.equal(vanshu.photoUrl, "/campaigns/dress-placeholder.svg");
  assert.equal(mixed.photoUrl, "/uploads/mine.jpg");
  assert.equal(empty.isDemo, true);
});

test("slot count is clamped between 4 and 15", () => {
  assert.equal(clampSlotCount(8), 8);
  assert.equal(draftToMoment(sample({ slotCount: 8 })).slots.length, 8);
  assert.equal(draftToMoment(sample({ slotCount: 2 })).slots.length, 4);
  assert.equal(draftToMoment(sample({ slotCount: 99 })).slots.length, 15);
  assert.equal(pinsFor("body", 20).length, 15);
  assert.equal(pinsFor("dress", 4).length, 4);
  assert.equal(pinsFor("laptop", 15).length, 15);
  assert.ok(draftToMoment(sample({ slotCount: 12 })).slots.every((slot, index) => slot.brand === "Open" && slot.id === `s${index + 1}`));
});

test("offer mode uses open-to-offers label and numeric slot prices", () => {
  const open = draftToMoment(sample({ priceMode: "offer", price: 0 }));
  assert.equal(open.raisedLabel, "open to offers");
  assert.ok(open.slots.every((slot) => slot.price === 100));
  const priced = draftToMoment(sample({ priceMode: "offer", price: 175 }));
  assert.equal(priced.raisedLabel, "open to offers");
  assert.ok(priced.slots.every((slot) => slot.price === 175));
  const ask = draftToMoment(sample({ priceMode: "ask", price: 400 }));
  assert.match(ask.raisedLabel, /\$400/);
  assert.ok(ask.slots.every((slot) => slot.price === 400));
});

test("listing payload includes the keys the marketplace POST must accept", () => {
  const body = listingFields(sample({ priceMode: "offer", price: 80 }));
  const keys = [
    "event", "city", "country", "startDate", "endDate", "description",
    "placementCategory", "industry", "item", "surface", "dimensions", "photoUrl",
    "handle", "audience", "creatorName", "price", "priceMode", "slotCount",
    "template", "slots", "deliverable", "deliverableDetails", "production",
    "exclusivity", "reach", "followers", "creatorCountry",
  ];
  assert.deepEqual(Object.keys(body), keys);
  assert.equal(body.price, 100);
  assert.equal(body.priceMode, "offer");
  assert.equal(body.followers, "0");
  assert.equal(body.surface, "8 numbered zones");
  assert.equal(body.industry, "Fitness");
  assert.equal(CAMPAIGN_DRAFT_STORE, "momento-campaign-draft");
  assert.equal(TEMPLATES.length, 6);
  assert.ok(TEMPLATES.every((item) => item.placeholder === "/campaigns/body-placeholder.svg" || item.placeholder === "/campaigns/dress-placeholder.svg"));
});

test("share text includes the campaign url", () => {
  const text = shareText(sample(), "https://momento.example/placements/abc");
  assert.match(text, /8 numbered slots/);
  assert.match(text, /City Marathon/);
  assert.match(text, /https:\/\/momento\.example\/placements\/abc/);
});
