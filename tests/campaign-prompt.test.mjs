import test from "node:test";
import assert from "node:assert/strict";
import { campaignIdFromPrompt, generateCampaign } from "../src/lib/campaign-prompt.ts";

test("one-line prompt becomes an in-platform campaign with priced slots", () => {
  const prompt = "I'm racing HYROX in Dubai. 8 slots on my kit, $400 to $2000.";
  const campaign = generateCampaign(prompt);
  assert.equal(campaign.slug, campaignIdFromPrompt(prompt));
  assert.equal(campaign.isDemo, true);
  assert.equal(campaign.bodyKind, "body");
  assert.equal(campaign.slots.length, 8);
  assert.equal(campaign.slots[0].price, 2000);
  assert.equal(campaign.slots.at(-1).price, 400);
  assert.match(campaign.city, /Dubai/);
  assert.ok(campaign.inventory.length === 8);
});

test("dress prompts map dress slots", () => {
  const campaign = generateCampaign("Walking TOKEN2049 in a white dress. 6 spots, $350.");
  assert.equal(campaign.bodyKind, "dress");
  assert.equal(campaign.slots.length, 6);
});

test("signed-in creator name is used instead of guessing from the prompt", () => {
  const campaign = generateCampaign("I'm running a city marathon in Berlin. 6 slots on my kit, $200.", { name: "Ayesha Khan" });
  assert.equal(campaign.creator.name, "Ayesha Khan");
});

test("generated campaigns never reuse example creator photos", () => {
  const body = generateCampaign("I'm racing HYROX in Dubai. 8 slots on my kit, $400 to $2000.");
  const dress = generateCampaign("Walking TOKEN2049 in a white dress. 6 spots, $350.");
  assert.equal(body.photoUrl, "/campaigns/body-placeholder.svg");
  assert.equal(dress.photoUrl, "/campaigns/dress-placeholder.svg");
  assert.doesNotMatch(body.photoUrl, /marc-lou|vanshu/);
  assert.doesNotMatch(dress.photoUrl, /marc-lou|vanshu/);
  assert.notEqual(body.slug, "marc-lou-hyrox");
  assert.notEqual(dress.slug, "vanshu-token2049");
});
