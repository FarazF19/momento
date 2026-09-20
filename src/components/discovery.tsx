"use client";

import { useMemo, useState } from "react";
import { MomentCard } from "@/components/moment-card";
import { SearchIcon } from "@/components/icons";
import { categories, industries, type Moment } from "@/lib/moments";

export default function Discovery({ placements, unavailable }: { placements: Moment[]; unavailable: boolean }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [industry, setIndustry] = useState<(typeof industries)[number]>("All");
  const [sort, setSort] = useState("soonest");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const result = placements.filter((moment) => {
      const categoryMatches = category === "All" || moment.category === category;
      const industryMatches = industry === "All" || moment.industry === industry;
      const searchMatches = !normalized || [moment.title, moment.city, moment.country, moment.creator.name, moment.creator.niche, moment.industry || "", moment.surface, moment.category]
        .join(" ").toLowerCase().includes(normalized);
      return categoryMatches && industryMatches && searchMatches;
    });

    if (sort === "price-low") {
      return [...result].sort((a, b) => Math.min(...a.inventory.map((i) => i.price)) - Math.min(...b.inventory.map((i) => i.price)));
    }
    if (sort === "audience") {
      return [...result].sort((a, b) => Number.parseFloat(b.creator.followers) - Number.parseFloat(a.creator.followers));
    }
    return [...result].sort((a, b) => a.startDate.localeCompare(b.startDate));
  }, [query, category, industry, sort, placements]);

  return (
    <>
      <main className="discover-page shell">
        <div className="page-hero compact">
          <div className="eyebrow"><span /> People with slots</div>
          <div className="page-hero-row">
            <h1>Find a person.<br />Pick a zone.</h1>
            <p>Every campaign is a Momento page: photo, numbered slots, offer box. Nothing sends you off-site.</p>
          </div>
        </div>

        <div className="discovery-tools">
          <label className="search-field">
            <SearchIcon />
            <input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search ad spaces" placeholder="Search a person, city, or slot — try “Marc” or “dress”" />
          </label>
          <div className="filter-row niche-row">
            <span className="filter-label">Niche</span>
            <div className="category-tabs" role="group" aria-label="Creator niches">
              {industries.map((item) => (
                <button key={item} type="button" aria-pressed={industry === item} className={industry === item ? "active" : ""} onClick={() => setIndustry(item)}>{item}</button>
              ))}
            </div>
          </div>
          <div className="filter-row">
            <span className="filter-label">Surface</span>
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
        <div className="results-row"><b>{filtered.length} {placements[0]?.campaignUrl ? "public campaigns" : placements[0]?.isDemo ? "example slots" : "ad spaces"}</b><span>{placements[0]?.campaignUrl ? "Structure examples · buy on their sites" : placements[0]?.isDemo ? "Examples · not bookable here" : "Choose a slot, then propose a price"}</span></div>
        {filtered.length ? (
          <div className="moment-grid discover-grid">
            {filtered.map((moment) => <MomentCard key={moment.slug} moment={moment} />)}
          </div>
        ) : (
          <div className="empty-state"><b>No ad spaces found.</b><p>Try a broader niche or surface, or another city.</p><button type="button" className="button button-outline" onClick={() => { setQuery(""); setCategory("All"); setIndustry("All"); }}>Clear filters</button></div>
        )}
      </main>
    </>
  );
}
