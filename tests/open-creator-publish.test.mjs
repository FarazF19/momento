import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";

test("MVP creators can publish without bio verification and use local campaign photos", async () => {
  const db = new PGlite();
  try {
    await db.exec(`
      create role anon; create role authenticated;
      create schema auth;
      create table auth.users (id uuid primary key, raw_user_meta_data jsonb, email_confirmed_at timestamptz);
      create function auth.uid() returns uuid language sql stable as
        $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
      grant usage on schema public, auth to anon, authenticated;
      grant execute on function auth.uid() to anon, authenticated;
    `);
    for (const file of [
      "202609190001_marketplace.sql",
      "20260920111343_creator_brand_verification.sql",
      "20260920150000_smooth_onboarding.sql",
      "20260920200000_open_creator_publish.sql",
    ]) {
      await db.exec(await readFile(new URL(`../supabase/migrations/${file}`, import.meta.url), "utf8"));
    }
    const creator = "00000000-0000-4000-8000-000000000001";
    const brand = "00000000-0000-4000-8000-000000000002";
    for (const [id, role] of [[creator, "creator"], [brand, "brand"]]) {
      await db.query("insert into auth.users values ($1, $2::jsonb, now())", [id, JSON.stringify({ name: role, role })]);
    }
    const as = async (id, role = "authenticated") => {
      await db.exec("reset role");
      await db.query("select set_config('request.jwt.claim.sub', $1, false)", [id || ""]);
      await db.exec(role === "anon" ? "set role anon" : "set role authenticated");
    };
    const details = (photoUrl) => JSON.stringify({
      item: "Race kit", surface: "Chest", dimensions: "12 cm", photoUrl,
      itinerary: "Berlin marathon", visibility: "Worn during the full event",
      proof: "Dated photos on this page", production: "Brand sends artwork", exclusivity: "One brand per slot",
      slots: [{ id: "s1", name: "Left chest", brand: "Open", price: 200, color: "#ffe04d" }],
      template: "body", bodyKind: "body", priceMode: "fixed", industry: "Fitness",
    });
    await as(creator);
    const local = (await db.query(`insert into public.placements
      (creator_id,creator_name,title,category,handle,audience,followers,city,country,start_date,end_date,asking_price_minor,details)
      values ($1,'creator','Berlin marathon kit','Clothing','@runner','Lifestyle',0,'Berlin','Germany',current_date+1,current_date+2,20000,$2::jsonb)
      returning id`, [creator, details("/campaigns/body-placeholder.svg")])).rows[0].id;
    const dataUri = (await db.query(`insert into public.placements
      (creator_id,creator_name,title,category,handle,audience,followers,city,country,start_date,end_date,asking_price_minor,details)
      values ($1,'creator','Data uri kit','Clothing','@runner','Lifestyle',0,'Berlin','Germany',current_date+1,current_date+2,10000,$2::jsonb)
      returning id`, [creator, details("data:image/png;base64,abc")])).rows[0].id;
    await assert.rejects(db.query(`insert into public.placements
      (creator_id,creator_name,title,category,handle,audience,followers,city,country,start_date,end_date,asking_price_minor,details)
      values ($1,'creator','Bad photo','Clothing','@runner','Lifestyle',0,'Berlin','Germany',current_date+1,current_date+2,10000,$2::jsonb)`,
    [creator, details("http://example.com/kit.jpg")]), /check constraint/);
    await as(null, "anon");
    const visible = (await db.query("select id from public.placements where status='published'")).rows.map((row) => row.id);
    assert.ok(visible.includes(local));
    assert.ok(visible.includes(dataUri));
    await as(brand);
    const offer = await db.query("select public.submit_offer($1,$2,$3) as id", [local, 15000, "Logo on the left chest for race day."]);
    assert.ok(offer.rows[0].id);
  } finally {
    await db.close();
  }
});
