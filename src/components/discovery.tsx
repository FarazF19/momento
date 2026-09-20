"use client";

import { useMemo, useState } from "react";
import { MomentCard } from "@/components/moment-card";
import { SearchIcon } from "@/components/icons";
import { categories, type Moment } from "@/lib/moments";

export default function Discovery({ placements, unavailable }: { placements: Moment[]; unavailable: boolean }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [sort, setSort] = useState("soonest");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const result = placements.filter((moment) => {
      const categoryMatches = category === "All" || moment.category === category;
      const searchMatches = !normalized || [moment.title, moment.city, moment.country, moment.creator.name, moment.creator.niche, moment.surface, moment.category]
        .join(" ").toLowerCase().includes(normalized);
      return categoryMatches && searchMatches;
    });

    if (sort === "price-low") {
      return [...result].sort((a, b) => Math.min(...a.inventory.map((i) => i.price)) - Math.min(...b.inventory.map((i) => i.price)));
    }
    if (sort === "audience") {
      return [...result].sort((a, b) => Number.parseFloat(b.creator.followers) - Number.parseFloat(a.creator.followers));
    }
    return [...result].sort((a, b) => a.startDate.localeCompare(b.startDate));
  }, [query, category, sort, placements]);

  return (
    <>
      <main className="discover-page shell">
        <div className="page-hero compact">
          <div className="eyebrow"><span /> Ad space in real life</div>
          <div className="page-hero-row">
            <h1>Find your brand’s<br />next companion.</h1>
            <p>Meet the creator, explore their plans, and choose a space for your brand. Send an offer when you find the right fit.</p>
          </div>
        </div>

        <div className="discovery-tools">
          <label className="search-field">
            <SearchIcon />
            <input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search ad spaces" placeholder="Search hoodies, laptops, cities, or creators" />
          </label>
          <div className="filter-row">
            <div className="category-tabs" role="group" aria-label="Placement categories">
              {categories.map((item) => (
                <button key={item} type="button" aria-pressed={category === item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>
              ))}
            </div>
            <label className="sort-control">
              <span>Sort</span>
              <select value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="soonest">Soonest first</option>
                <option value="price-low">Lowest price</option>
                <option value="audience">Largest audience</option>
              </select>
            </label>
          </div>
        </div>

        {unavailable && <p role="alert" className="form-message">Live listings are temporarily unavailable. Please try again shortly.</p>}
        <div className="results-row"><b>{filtered.length} {placements[0]?.isDemo ? "example ad spaces" : "ad spaces"}</b><span>{placements[0]?.isDemo ? "Fictional examples · Illustrative prices · Not bookable" : "Choose a space, then propose your price"}</span></div>
        {filtered.length ? (
          <div className="moment-grid discover-grid">
            {filtered.map((moment) => <MomentCard key={moment.slug} moment={moment} />)}
          </div>
        ) : (
          <div className="empty-state"><b>No ad spaces found.</b><p>Try a broader category or another city.</p><button type="button" className="button button-outline" onClick={() => { setQuery(""); setCategory("All"); }}>Clear filters</button></div>
        )}
      </main>
    </>
  );
}
