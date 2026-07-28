import { CalendarDays, MapPin, Plus, Route, Sparkles, X } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionHeading } from "@/components/SectionHeading";
import { catalog, tripTemplates } from "@/data/catalog";
import { useApp } from "@/context/AppContext";

export function TripsPage() {
  const {
    tripIds,
    addTemplateToTrip,
    removeFromTrip,
    user,
    setAuthOpen
  } = useApp();
  const tripItems = tripIds
    .map((id) => catalog.find((item) => item.id === id))
    .filter(Boolean);

  return (
    <div className="page">
      <header className="page-header">
        <p className="eyebrow">Make it yours</p>
        <h1>My Uganda trip</h1>
        <p>Collect places, shape the days, leave room for surprise.</p>
      </header>

      {!user && (
        <section className="sync-banner">
          <span className="sync-banner__icon">
            <Sparkles size={20} />
          </span>
          <div>
            <strong>Keep this trip wherever you go</strong>
            <p>Sign in to sync your plans across devices.</p>
          </div>
          <button className="button button--small" onClick={() => setAuthOpen(true)}>
            Sign in
          </button>
        </section>
      )}

      <section className="trip-builder">
        <div className="trip-builder__heading">
          <span>
            <Route size={22} />
          </span>
          <div>
            <p className="eyebrow">Your itinerary</p>
            <h2>
              {tripItems.length
                ? `${tripItems.length} stop${tripItems.length === 1 ? "" : "s"}`
                : "Start shaping a route"}
            </h2>
          </div>
        </div>

        {tripItems.length ? (
          <div className="trip-list">
            {tripItems.map((item, index) =>
              item ? (
                <article className="trip-stop" key={item.id}>
                  <span className="trip-stop__number">{index + 1}</span>
                  <img src={item.image} alt="" />
                  <Link to={`/places/${item.id}`}>
                    <small>Day {index + 1}</small>
                    <h3>{item.title}</h3>
                    <span>
                      <MapPin size={13} />
                      {item.location}
                    </span>
                  </Link>
                  <button
                    className="icon-button"
                    aria-label={`Remove ${item.title}`}
                    onClick={() => removeFromTrip(item.id)}
                  >
                    <X size={17} />
                  </button>
                </article>
              ) : null
            )}
            <Link to="/" className="trip-list__add">
              <Plus size={18} /> Add another place
            </Link>
          </div>
        ) : (
          <div className="trip-empty">
            <span>
              <MapPin size={25} />
            </span>
            <h3>Your map is wide open</h3>
            <p>Add a ready-made itinerary below or save places as you explore.</p>
            <Link to="/" className="button button--dark">
              Discover places
            </Link>
          </div>
        )}
      </section>

      <section className="content-section">
        <SectionHeading
          eyebrow="Curated routes"
          title="A thoughtful head start"
        />
        <div className="template-grid">
          {tripTemplates.map((template) => (
            <article className="template-card" key={template.id}>
              <div
                className="template-card__image"
                style={{ backgroundImage: `url(${template.image})` }}
              >
                <span>{template.tag}</span>
                <small>
                  <CalendarDays size={15} /> {template.days} days
                </small>
              </div>
              <div className="template-card__body">
                <div>
                  <h3>{template.title}</h3>
                  <p>{template.subtitle}</p>
                </div>
                <button
                  className="icon-button icon-button--dark"
                  aria-label={`Add ${template.title} to trip`}
                  onClick={() => addTemplateToTrip(template.itemIds)}
                >
                  <Plus size={19} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="coming-soon-card">
        <div>
          <p className="eyebrow eyebrow--light">Bookings</p>
          <h2>A calmer way to keep track.</h2>
          <p>
            Booking requests and payment confirmations will live here when the
            next phase opens.
          </p>
        </div>
        <span>Coming next</span>
      </section>
    </div>
  );
}
