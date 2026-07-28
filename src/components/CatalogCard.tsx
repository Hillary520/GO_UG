import { Heart, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import type { CatalogItem } from "@/types";

type CatalogCardProps = {
  item: CatalogItem;
  compact?: boolean;
};

export function CatalogCard({ item, compact = false }: CatalogCardProps) {
  const { savedIds, toggleSaved } = useApp();
  const isSaved = savedIds.includes(item.id);

  return (
    <article className={`catalog-card ${compact ? "catalog-card--compact" : ""}`}>
      <Link to={`/places/${item.id}`} className="catalog-card__image-wrap">
        <img src={item.image} alt="" className="catalog-card__image" />
        <span className="catalog-card__category">{item.category}</span>
        {item.sponsored && (
          <span className="catalog-card__sponsored">Sponsored</span>
        )}
      </Link>
      <button
        className={`save-button ${isSaved ? "is-saved" : ""}`}
        onClick={() => toggleSaved(item.id)}
        aria-label={isSaved ? `Unsave ${item.title}` : `Save ${item.title}`}
      >
        <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
      </button>
      <Link to={`/places/${item.id}`} className="catalog-card__body">
        <div className="catalog-card__meta">
          <span>
            <MapPin size={14} />
            {item.location}
          </span>
          <span>
            <Star size={14} fill="currentColor" />
            {item.rating}
          </span>
        </div>
        <h3>{item.title}</h3>
        {!compact && <p>{item.description}</p>}
        <div className="catalog-card__foot">
          <strong>{item.priceLabel}</strong>
          {item.duration && <span>{item.duration}</span>}
        </div>
      </Link>
    </article>
  );
}
