import { useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  Bell,
  ChevronRight,
  LocateFixed,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star
} from "lucide-react";
import { Link } from "react-router-dom";
import { CatalogCard } from "@/components/CatalogCard";
import { SectionHeading } from "@/components/SectionHeading";
import { catalog, categories, featured, guides } from "@/data/catalog";
import { useApp } from "@/context/AppContext";

export function DiscoverPage() {
  const { user, setAuthOpen, notify } = useApp();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [showAll, setShowAll] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return catalog.filter((item) => {
      const matchesCategory =
        category === "All" || item.category === category;
      const matchesQuery =
        !normalized ||
        [
          item.title,
          item.location,
          item.region,
          item.category,
          ...item.tags
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalized);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  const filtered = showAll ? results : results.slice(0, 6);
  const firstName = user?.displayName.split(" ")[0];

  return (
    <div className="page page--discover">
      <header className="mobile-topbar">
        <div>
          <p className="eyebrow">Hello{firstName ? `, ${firstName}` : ""}</p>
          <h1>Where to next?</h1>
        </div>
        <div className="mobile-topbar__actions">
          <button
            className="icon-button"
            aria-label="Notifications"
            onClick={() => notify("You're all caught up")}
          >
            <Bell size={20} />
            <span className="status-dot" />
          </button>
          <button
            className="avatar avatar--small"
            onClick={() => !user && setAuthOpen(true)}
            aria-label={user ? "Open profile" : "Sign in"}
          >
            {user?.initials || "GU"}
          </button>
        </div>
      </header>

      <section className="desktop-welcome">
        <div>
          <p className="eyebrow">Uganda, thoughtfully explored</p>
          <h1>
            Good morning{firstName ? `, ${firstName}` : ""}.
            <br />
            <em>Let's find your Uganda.</em>
          </h1>
        </div>
        <div className="desktop-welcome__weather">
          <span className="weather-sun" aria-hidden="true" />
          <span>
            <strong>24°C</strong>
            <small>Kampala · Clear</small>
          </span>
        </div>
      </section>

      <div className="search-bar">
        <Search size={20} />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search safaris, food, places…"
          aria-label="Search Uganda"
        />
        <button
          className="search-bar__filter"
          aria-label="Search filters"
          onClick={() => notify("Choose a category below to filter")}
        >
          <SlidersHorizontal size={19} />
        </button>
      </div>

      <div className="category-row" aria-label="Filter by category">
        {categories.map((item) => (
          <button
            key={item}
            className={category === item ? "is-active" : ""}
            onClick={() => {
              setCategory(item);
              resultsRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start"
              });
            }}
          >
            {item}
          </button>
        ))}
      </div>

      {!query && category === "All" && (
        <>
          <section className="featured-section" aria-labelledby="featured-title">
            <SectionHeading
              eyebrow="Handpicked now"
              title="Start with something remarkable"
            />
            <div className="featured-track">
              {featured.map((item, index) => (
                <Link
                  to={`/places/${item.id}`}
                  className="featured-card"
                  key={item.id}
                  style={{ backgroundImage: `url(${item.image})` }}
                >
                  <div className="featured-card__overlay" />
                  <div className="featured-card__top">
                    <span>
                      {index === 0
                        ? "Activity"
                        : index === 1
                          ? "Editor's pick"
                          : "Stay"}
                    </span>
                    {item.sponsored && <small>Sponsored</small>}
                  </div>
                  <div className="featured-card__body">
                    <p>{item.eyebrow}</p>
                    <h2>{item.title}</h2>
                    <div>
                      <span>
                        <Star size={14} fill="currentColor" />
                        {item.rating}
                      </span>
                      <span>{item.location}</span>
                    </div>
                  </div>
                  <span className="featured-card__arrow">
                    <ArrowUpRight size={20} />
                  </span>
                </Link>
              ))}
            </div>
            <div className="carousel-dots" aria-hidden="true">
              <span className="is-active" />
              <span />
              <span />
            </div>
          </section>

          <section className="nearby-strip">
            <span className="nearby-strip__icon">
              <LocateFixed size={22} />
            </span>
            <span>
              <strong>Explore near you</strong>
              <small>Beautiful places around Kampala</small>
            </span>
            <ChevronRight size={20} />
          </section>

          <section className="guide-callout">
            <div className="guide-callout__faces">
              {guides.slice(0, 3).map((guide) => (
                <img key={guide.id} src={guide.image} alt="" />
              ))}
            </div>
            <div>
              <p className="eyebrow eyebrow--light">Go with someone who knows</p>
              <h2>Meet trusted local guides.</h2>
              <p>
                Real people, verified by GoUG, ready to show you a richer side of
                home.
              </p>
            </div>
            <Link to="/guides" className="button button--cream">
              Find your guide
              <ArrowUpRight size={18} />
            </Link>
          </section>
        </>
      )}

      <section ref={resultsRef} className="content-section">
        <SectionHeading
          eyebrow={query || category !== "All" ? "Matching your search" : "Go deeper"}
          title={
            query || category !== "All"
              ? `${results.length} place${results.length === 1 ? "" : "s"} found`
              : "Uganda worth lingering over"
          }
          action={results.length > 6 ? (showAll ? "Show less" : "See all") : undefined}
          onAction={() => setShowAll((current) => !current)}
        />
        {filtered.length ? (
          <div className="catalog-grid">
            {filtered.map((item) => (
              <CatalogCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span>
              <Sparkles size={24} />
            </span>
            <h3>No places match that yet</h3>
            <p>Try another category or a broader search.</p>
            <button
              className="button button--dark"
              onClick={() => {
                setQuery("");
                setCategory("All");
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
