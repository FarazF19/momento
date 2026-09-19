import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";

// Execute the actual migration in PostgreSQL, with a minimal Supabase auth fixture.
test("PostgreSQL roles, private offers, immutable terms, and reservation lifecycle", async (t) => {
  const db = new PGlite();
  t.after(() => db.close());
  await db.exec(`
    create role anon; create role authenticated;
    create schema auth;
    create table auth.users (id uuid primary key, raw_user_meta_data jsonb, email_confirmed_at timestamptz);
    create function auth.uid() returns uuid language sql stable as
      $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    grant usage on schema public, auth to anon, authenticated;
    grant execute on function auth.uid() to anon, authenticated;
  `);
  await db.exec(await readFile(new URL("../supabase/migrations/202609190001_marketplace.sql", import.meta.url), "utf8"));
  const creator = "00000000-0000-4000-8000-000000000001";
  const brand = "00000000-0000-4000-8000-000000000002";
  const otherBrand = "00000000-0000-4000-8000-000000000003";
  const otherCreator = "00000000-0000-4000-8000-000000000004";
  const unverified = "00000000-0000-4000-8000-000000000005";
  for (const [id, role, name] of [[creator, "creator", "Creator"], [brand, "brand", "Brand"], [otherBrand, "brand", "Other brand"], [otherCreator, "creator", "Other creator"], [unverified, "brand", "Unverified"]]) {
    await db.query("insert into auth.users values ($1, $2::jsonb, $3)", [id, JSON.stringify({ role, name }), id === unverified ? null : new Date().toISOString()]);
  }
  async function as(id, role = "authenticated") {
    await db.exec("reset role");
    await db.query("select set_config('request.jwt.claim.sub', $1, false)", [id || ""]);
    await db.exec(role === "anon" ? "set role anon" : "set role authenticated");
  }
  const details = JSON.stringify({ item: "Laptop", surface: "Laptop lid", dimensions: "10 × 7 cm", photoUrl: "https://example.com/laptop.jpg", itinerary: "Coworking space", visibility: "12 two-hour sessions", proof: "Dated photos", production: "Brand ships sticker", exclusivity: "One brand" });
  async function createListing(id = creator, name = "Creator") {
    return (await db.query(`insert into public.placements
      (creator_id,creator_name,title,category,handle,audience,followers,city,country,start_date,end_date,asking_price_minor,details)
      values ($1,$2,'Laptop placement','Laptops','@creator','Remote workers',0,'Lahore','Pakistan',current_date + 7,current_date + 14,12000,$3::jsonb) returning id`, [id, name, details])).rows[0].id;
  }
  async function bid(id, price = 10000) {
    return (await db.query("select public.submit_offer($1,$2,$3) as id", [id, price, "Our brand sticker; we supply and ship it."])).rows[0].id;
  }
  let placement, offer, competing;
  await t.test("verified creator publishes; identity spoofing and role edits fail", async () => {
    await as(creator);
    placement = await createListing();
    await assert.rejects(createListing(otherCreator, "Other creator"), /row-level security/);
    await assert.rejects(createListing(creator, "Impersonated name"), /row-level security/);
    await assert.rejects(db.query("update profiles set role = 'brand'"), /permission denied/);
    assert.equal((await db.query("select * from profiles")).rows.length, 1);
    await as(brand);
    await assert.rejects(createListing(brand, "Brand"), /row-level security/);
  });
  await t.test("anonymous visitors can browse but cannot read private offers or publish", async () => {
    await as(null, "anon");
    assert.equal((await db.query("select * from placements")).rows.length, 1);
    await assert.rejects(db.query("select * from offers"), /permission denied/);
    await assert.rejects(createListing(), /permission denied/);
    await assert.rejects(bid(placement), /permission denied/);
  });
  await t.test("offers require verified brands and valid money", async () => {
    await as(unverified);
    await assert.rejects(bid(placement), /Verified account required/);
    await as(creator);
    await assert.rejects(bid(placement), /Brand account required/);
    await as(brand);
    await assert.rejects(bid(placement, -1), /check constraint/);
    offer = await bid(placement, 10550);
    await assert.rejects(bid(placement), /unique constraint/);
    const row = (await db.query("select * from offers")).rows[0];
    assert.equal(row.brand_id, brand);
    assert.equal(row.creator_id, creator);
    assert.equal(row.amount_minor, 10550);
    assert.equal(row.placement_snapshot.details.surface, "Laptop lid");
    await assert.rejects(db.query("update offers set amount_minor = 1"), /permission denied/);
    await assert.rejects(db.query("insert into offers default values"), /permission denied/);
  });
  await t.test("unrelated accounts cannot view or decide an offer", async () => {
    await as(otherCreator);
    assert.equal((await db.query("select * from offers")).rows.length, 0);
    await assert.rejects(db.query("select respond_to_offer($1,'accepted')", [offer]), /Not authorized/);
    await as(otherBrand);
    assert.equal((await db.query("select * from offers")).rows.length, 0);
    await assert.rejects(db.query("select respond_to_offer($1,'withdrawn')", [offer]), /Not authorized/);
    competing = await bid(placement);
    assert.equal((await db.query("select * from offers")).rows.length, 1);
  });
  await t.test("acceptance reserves placement and declines competing bids atomically", async () => {
    await as(creator);
    assert.equal((await db.query("select * from offers")).rows.length, 2);
    await db.query("select respond_to_offer($1,'accepted')", [offer]);
    const rows = (await db.query("select id,status from offers")).rows;
    assert.equal(rows.find((row) => row.id === offer).status, "accepted");
    assert.equal(rows.find((row) => row.id === competing).status, "declined");
    assert.equal((await db.query("select status from placements")).rows[0].status, "paused");
    await assert.rejects(db.query("select respond_to_offer($1,'accepted')", [competing]), /already decided/);
    await as(null, "anon");
    assert.equal((await db.query("select * from placements")).rows.length, 0);
    await as(otherBrand);
    await assert.rejects(bid(placement), /Placement unavailable/);
  });
  await t.test("withdrawal and decline release a pending offer without reserving the listing", async () => {
    await as(creator);
    const next = await createListing();
    await as(brand);
    const withdrawn = await bid(next);
    await db.query("select respond_to_offer($1,'withdrawn')", [withdrawn]);
    const declined = await bid(next);
    await as(creator);
    await db.query("select respond_to_offer($1,'declined')", [declined]);
    assert.equal((await db.query("select status from placements where id=$1", [next])).rows[0].status, "published");
  });
});
