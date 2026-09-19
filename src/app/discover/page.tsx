"use client";

import { useMemo, useState } from "react";
import { Header } from "@/components/header";
import { MomentCard } from "@/components/moment-card";
import { SearchIcon } from "@/components/icons";
import { categories, moments } from "@/lib/moments";

export default function DiscoverPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [sort, setSort] = useState("soonest");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const result = moments.filter((moment) => {
      const categoryMatches = category === "All" || moment.category === category;
      const searchMatches = !normalized || [moment.event, moment.city, moment.country, moment.creator.name, moment.creator.niche]
        .join(" ").toLowerCase().includes(normalized);
      return categoryMatches && searchMatches;
    });

    if (sort === "price-low") {
      return [...result].sort((a, b) => Math.min(...a.inventory.map((i) => i.price)) - Math.min(...b.inventory.map((i) => i.price)));
    }
    if (sort === "audience") {
      return [...result].sort((a, b) => Number.parseFloat(b.creator.followers) - Number.parseFloat(a.creator.followers));
    }
    return result;
  }, [query, category, sort]);

  return (
    <>
      <Header />
      <main className="discover-page shell">
        <div className="page-hero compact">
          <div className="eyebrow"><span /> Sponsor real moments</div>
          <div className="page-hero-row">
            <h1>Find the moment<br />before it happens.</h1>
            <p>Search the creator calendar. Choose the audience, place, and deliverable that fit the campaign.</p>
          </div>
        </div>

        <div className="discovery-tools">
          <label className="search-field">
            <SearchIcon />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search events, cities, or creators" />
          </label>
          <div className="filter-row">
            <div className="category-tabs" role="tablist" aria-label="Moment categories">
              {categories.map((item) => (
                <button key={item} type="button" className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>
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

        <div className="results-row"><b>{filtered.length} moments</b><span>Sample listings for MVP testing</span></div>
        {filtered.length ? (
          <div className="moment-grid discover-grid">
            {filtered.map((moment) => <MomentCard key={moment.slug} moment={moment} />)}
          </div>
        ) : (
          <div className="empty-state"><b>No moments found.</b><p>Try a broader category or another city.</p><button type="button" className="button button-outline" onClick={() => { setQuery(""); setCategory("All"); }}>Clear filters</button></div>
        )}
      </main>
    </>
  );
}
