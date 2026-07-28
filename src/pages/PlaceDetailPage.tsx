import {
  ArrowLeft,
  CalendarPlus,
  Check,
  Clock,
  ExternalLink,
  Heart,
  MapPin,
  Navigation,
  Share2,
  Star
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { catalog } from "@/data/catalog";
import { useApp } from "@/context/AppContext";

export function PlaceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { savedIds, toggleSaved, addToTrip, notify } = useApp();
  const item = catalog.find((entry) => entry.id === id);

  if (!item) {
    return (
      <div className="not-found">
        <h1>That place wandered off.</h1>
        <Link to="/" className="button button--dark">
          Back to Discover
        </Link>
      </div>
    );
  }

  const isSaved = savedIds.includes(item.id);
  const mapsUrl = item.coordinates
    ? `https://www.google.com/maps/search/?api=1&query=${item.coordinates.lat},${item.coordinates.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${item.title}, Uganda`
      )}`;

  const share = async () => {
    const data = {
      title: item.title,
      text: `Take a look at ${item.title} on GoUG`,
      url: window.location.href
    };
    if (navigator.share) {
      await navigator.share(data).catch(() => undefined);
    } else {
      await navigator.clipboard?.writeText(window.location.href);
      notify("Link copied");
    }
  };

  return (
    <article className="detail-page">
      <header
        className="detail-hero"
        style={{ backgroundImage: `url(${item.image})` }}
      >
        <div className="detail-hero__shade" />
        <div className="detail-hero__nav">
          <button
            className="icon-button icon-button--glass"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <ArrowLeft size={21} />
          </button>
          <div>
            <button
              className="icon-button icon-button--glass"
              onClick={share}
              aria-label="Share this place"
            >
              <Share2 size={19} />
            </button>
            <button
              className={`icon-button icon-button--glass ${
                isSaved ? "is-saved" : ""
              }`}
              onClick={() => toggleSaved(item.id)}
              aria-label={isSaved ? "Remove from saved" : "Save this place"}
            >
              <Heart size={19} fill={isSaved ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
        <div className="detail-hero__body">
          <span className="detail-hero__category">{item.category}</span>
          <p>{item.eyebrow}</p>
          <h1>{item.title}</h1>
          <div>
            <span>
              <MapPin size={15} />
              {item.location}
            </span>
            <span>
              <Star size={15} fill="currentColor" />
              {item.rating} ({item.reviewCount})
            </span>
          </div>
        </div>
      </header>

      <div className="detail-content">
        <div className="detail-content__main">
          <section>
            <p className="detail-lead">{item.description}</p>
            <p className="detail-copy">{item.longDescription}</p>
          </section>

          <section className="detail-section">
            <p className="eyebrow">Why it stays with you</p>
            <h2>Experience highlights</h2>
            <div className="highlight-list">
              {item.highlights.map((highlight) => (
                <div key={highlight}>
                  <span>
                    <Check size={17} />
                  </span>
                  {highlight}
                </div>
              ))}
            </div>
          </section>

          <section className="detail-section">
            <div className="detail-map">
              <div className="detail-map__pattern" />
              <span className="detail-map__pin">
                <MapPin size={22} fill="currentColor" />
              </span>
              <div>
                <p className="eyebrow">Find your way</p>
                <h2>{item.region}</h2>
                <a href={mapsUrl} target="_blank" rel="noreferrer">
                  Open in Maps <ExternalLink size={15} />
                </a>
              </div>
            </div>
          </section>

          <section className="detail-section detail-review">
            <div className="detail-review__score">
              <strong>{item.rating}</strong>
              <span>
                <span className="stars">★★★★★</span>
                <small>{item.reviewCount} traveller notes</small>
              </span>
            </div>
            <blockquote>
              “GoUG's picks are still being gathered from trusted local
              travellers. Reviews will open with moderation in the next phase.”
            </blockquote>
          </section>
        </div>

        <aside className="detail-booking">
          <div>
            <span className="detail-booking__icon">
              {item.category === "Stay" ? (
                <ExternalLink size={20} />
              ) : (
                <CalendarPlus size={20} />
              )}
            </span>
            <span>
              <small>Plan from</small>
              <strong>{item.priceLabel}</strong>
            </span>
          </div>
          {item.duration && (
            <p>
              <Clock size={16} /> Suggested time: {item.duration}
            </p>
          )}
          <button
            className="button button--dark button--full"
            onClick={() => {
              addToTrip(item.id);
            }}
          >
            <CalendarPlus size={18} />
            Add to my trip
          </button>
          <button
            className="button button--sun button--full"
            onClick={() =>
              notify(
                item.category === "Stay"
                  ? "Partner stays are being verified"
                  : "Booking requests are coming in the next release"
              )
            }
          >
            <Navigation size={18} />
            {item.category === "Stay"
              ? "Check partner options"
              : "Request availability"}
          </button>
          <small>No payment will be taken yet.</small>
        </aside>
      </div>
    </article>
  );
}
