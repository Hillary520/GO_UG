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
import { lazy, Suspense, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { useSmartBack } from "@/lib/useSmartBack";

const MapCanvas = lazy(() =>
  import("@/components/MapCanvas").then((module) => ({
    default: module.MapCanvas
  }))
);

export function PlaceDetailPage() {
  const { id } = useParams();
  const goBack = useSmartBack("/");
  const {
    user,
    setAuthOpen,
    savedIds,
    catalogItems,
    reviews,
    toggleSaved,
    addToTrip,
    addReview,
    notify
  } = useApp();
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const item = catalogItems.find((entry) => entry.id === id);
  const itemReviews = reviews.filter(
    (review) =>
      review.entityId === id &&
      (review.status === "published" ||
        (user && review.author === user.displayName))
  );

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

  const submitReview = async (event: FormEvent) => {
    event.preventDefault();
    if (!user) {
      setAuthOpen(true);
      return;
    }
    if (reviewText.trim().length < 10) {
      notify("Share at least a sentence");
      return;
    }
    await addReview({
      entityId: item.id,
      rating,
      text: reviewText.trim()
    });
    setReviewText("");
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
            onClick={goBack}
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
            <div className="detail-map-live">
              <Suspense
                fallback={<div className="goug-map map-loading">Loading map…</div>}
              >
                <MapCanvas places={[item]} compact />
              </Suspense>
              <div>
                <span>
                  <p className="eyebrow">Find your way</p>
                  <strong>{item.region}</strong>
                </span>
                <Link to={`/map?place=${item.id}`}>
                  View full map <Navigation size={15} />
                </Link>
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
              “A standout GoUG pick for travellers who want a deeper sense of
              place, with enough time to experience it unhurried.”
            </blockquote>
            {itemReviews.length > 0 && (
              <div className="review-list">
                {itemReviews.map((review) => (
                  <article key={review.id}>
                    <div>
                      <strong>{review.author}</strong>
                      <span>{"★".repeat(review.rating)}</span>
                    </div>
                    <p>{review.text}</p>
                    {review.status === "pending" && <small>Under review</small>}
                  </article>
                ))}
              </div>
            )}
            <form
              className="review-form"
              onSubmit={(event) => void submitReview(event)}
            >
              <strong>Share your experience</strong>
              <div className="review-form__stars" aria-label="Rating">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={value <= rating ? "is-active" : ""}
                    onClick={() => setRating(value)}
                    aria-label={`${value} star${value === 1 ? "" : "s"}`}
                  >
                    <Star size={19} fill="currentColor" />
                  </button>
                ))}
              </div>
              <textarea
                value={reviewText}
                onChange={(event) => setReviewText(event.target.value)}
                placeholder="What should another traveller know?"
              />
              <button className="button button--outline">
                {user ? "Submit review" : "Sign in to review"}
              </button>
            </form>
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
          <Link
            className="button button--sun button--full"
            to={`/request/place/${item.id}`}
          >
            <Navigation size={18} />
            Request availability
          </Link>
          <small>No payment will be taken yet.</small>
        </aside>
      </div>
    </article>
  );
}
