import { useMemo, useState } from "react";
import { BadgeCheck, MapPin, Search, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { guides } from "@/data/catalog";

export function GuidesPage() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    if (!normalized) return guides;
    return guides.filter((guide) =>
      [
        guide.name,
        guide.location,
        ...guide.specialties,
        ...guide.languages
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    );
  }, [query]);

  return (
    <div className="page page--guides">
      <header className="guide-hero">
        <div className="guide-hero__shade" />
        <div className="guide-hero__body">
          <p className="eyebrow eyebrow--light">Go beyond the guidebook</p>
          <h1>Uganda is better with someone who knows.</h1>
          <p>
            Meet trusted local guides chosen for their knowledge, warmth and
            care.
          </p>
          <div className="guide-hero__trust">
            <span>
              <BadgeCheck size={17} /> Identity checked
            </span>
            <span>•</span>
            <span>Local expertise</span>
          </div>
        </div>
      </header>

      <div className="search-bar search-bar--overlap">
        <Search size={20} />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by place, language or interest"
          aria-label="Search guides"
        />
      </div>

      <section className="content-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Verified by GoUG</p>
            <h2>{filtered.length} local guides</h2>
          </div>
        </div>
        <div className="guide-grid">
          {filtered.map((guide) => (
            <Link
              to={`/guides/${guide.id}`}
              className="guide-card"
              key={guide.id}
            >
              <div className="guide-card__visual">
                <img src={guide.coverImage} alt="" />
                {guide.sponsored && <span>Sponsored</span>}
                <div className="guide-card__portrait">
                  <img src={guide.image} alt="" />
                  {guide.verified && (
                    <BadgeCheck size={21} fill="var(--sun)" />
                  )}
                </div>
              </div>
              <div className="guide-card__body">
                <div className="guide-card__name">
                  <div>
                    <h3>{guide.name}</h3>
                    <span>
                      <MapPin size={14} />
                      {guide.location}
                    </span>
                  </div>
                  <span className="guide-card__rating">
                    <Star size={14} fill="currentColor" />
                    {guide.rating}
                  </span>
                </div>
                <p>{guide.bio}</p>
                <div className="tag-row">
                  {guide.specialties.map((specialty) => (
                    <span key={specialty}>{specialty}</span>
                  ))}
                </div>
                <div className="guide-card__foot">
                  <strong>{guide.priceLabel}</strong>
                  <span>View profile</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
