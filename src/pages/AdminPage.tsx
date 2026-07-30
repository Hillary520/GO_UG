import { useMemo, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  BarChart3,
  CalendarCheck,
  Check,
  CheckCircle2,
  Eye,
  FileText,
  ImagePlus,
  LayoutDashboard,
  Megaphone,
  Menu,
  Plus,
  Search,
  ShieldCheck,
  Star,
  Trash2,
  Users,
  X
} from "lucide-react";
import { Link } from "react-router-dom";
import { Brand } from "@/components/Brand";
import { useApp } from "@/context/AppContext";
import type { Category, ManagedPlace } from "@/types";

const adminNav = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Bookings", icon: CalendarCheck },
  { label: "Places", icon: FileText },
  { label: "Guides", icon: Users },
  { label: "Featured", icon: ImagePlus },
  { label: "Sponsored", icon: Megaphone },
  { label: "Moderation", icon: ShieldCheck }
] as const;

type AdminSection = (typeof adminNav)[number]["label"];

const categories: Category[] = [
  "Destination",
  "Safari",
  "Culture",
  "Food",
  "Stay",
  "Adventure"
];

export function AdminPage() {
  const {
    catalogItems,
    guideItems,
    customPlaces,
    bookings,
    reviews,
    featuredIds,
    sponsoredIds,
    addCustomPlace,
    updateCustomPlace,
    removeCustomPlace,
    toggleFeatured,
    toggleSponsored,
    toggleGuideVerified,
    updateBookingStatus,
    moderateReview
  } = useApp();
  const [active, setActive] = useState<AdminSection>("Overview");
  const [navOpen, setNavOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [region, setRegion] = useState("");
  const [category, setCategory] = useState<Category>("Destination");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const filtered = useMemo(
    () =>
      catalogItems.filter((item) =>
        `${item.title} ${item.location} ${item.category}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [catalogItems, query]
  );
  const pendingReviews = reviews.filter((review) => review.status === "pending");

  const openSection = (section: AdminSection) => {
    setActive(section);
    setNavOpen(false);
  };

  const addPlace = (event: FormEvent) => {
    event.preventDefault();
    const id = `${title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")}-${Date.now().toString().slice(-5)}`;
    const place: ManagedPlace = {
      id,
      title,
      eyebrow: `Explore ${region || location}`,
      category,
      location,
      region: region || location,
      image:
        image ||
        "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1400&q=85",
      description,
      longDescription: description,
      rating: 0,
      reviewCount: 0,
      priceLabel: "Request details",
      tags: [category, region || location],
      highlights: ["Locally curated", "Flexible planning", "Uganda experience"],
      coordinates:
        latitude !== "" && longitude !== ""
          ? { lat: Number(latitude), lng: Number(longitude) }
          : undefined,
      status: "draft"
    };
    addCustomPlace(place);
    setEditorOpen(false);
    setTitle("");
    setLocation("");
    setRegion("");
    setDescription("");
    setImage("");
    setLatitude("");
    setLongitude("");
    setActive("Places");
  };

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${navOpen ? "is-open" : ""}`}>
        <div className="admin-sidebar__head">
          <Brand />
          <button
            className="icon-button admin-sidebar__close"
            onClick={() => setNavOpen(false)}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>
        <span className="admin-sidebar__label">Content studio</span>
        <nav>
          {adminNav.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={active === label ? "is-active" : ""}
              onClick={() => openSection(label)}
            >
              <Icon size={19} />
              {label}
              {label === "Moderation" && pendingReviews.length > 0 && (
                <small>{pendingReviews.length}</small>
              )}
            </button>
          ))}
        </nav>
        <Link to="/" replace className="admin-sidebar__back">
          <ArrowLeft size={17} />
          Back to GoUG
        </Link>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <button
            className="icon-button admin-menu"
            onClick={() => setNavOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div>
            <p className="eyebrow">Content studio</p>
            <h1>{active}</h1>
          </div>
          {(active === "Overview" || active === "Places") && (
            <button
              className="button button--dark"
              onClick={() => setEditorOpen(true)}
            >
              <Plus size={17} />
              Add place
            </button>
          )}
        </header>

        {active === "Overview" && (
          <>
            <section className="admin-stats">
              <article>
                <span className="admin-stats__icon admin-stats__icon--green">
                  <Eye size={21} />
                </span>
                <div>
                  <small>Published places</small>
                  <strong>
                    {catalogItems.filter((item) => item.status === "published").length}
                  </strong>
                  <em>Visible in Discover</em>
                </div>
              </article>
              <article>
                <span className="admin-stats__icon admin-stats__icon--cream">
                  <CalendarCheck size={21} />
                </span>
                <div>
                  <small>Pending requests</small>
                  <strong>
                    {bookings.filter((booking) => booking.status === "pending").length}
                  </strong>
                  <em>Awaiting confirmation</em>
                </div>
              </article>
              <article>
                <span className="admin-stats__icon admin-stats__icon--sun">
                  <FileText size={21} />
                </span>
                <div>
                  <small>Draft places</small>
                  <strong>
                    {customPlaces.filter((item) => item.status === "draft").length}
                  </strong>
                  <em>Ready for editing</em>
                </div>
              </article>
              <article>
                <span className="admin-stats__icon admin-stats__icon--cream">
                  <Users size={21} />
                </span>
                <div>
                  <small>Verified guides</small>
                  <strong>
                    {guideItems.filter((guide) => guide.verified).length}
                  </strong>
                  <em>{guideItems.length} profiles total</em>
                </div>
              </article>
              <article>
                <span className="admin-stats__icon admin-stats__icon--orange">
                  <BarChart3 size={21} />
                </span>
                <div>
                  <small>Pending reviews</small>
                  <strong>{pendingReviews.length}</strong>
                  <em>Moderation queue</em>
                </div>
              </article>
            </section>
            <section className="admin-bottom-grid">
              <article>
                <div>
                  <p className="eyebrow">Needs attention</p>
                  <h2>Moderation queue</h2>
                </div>
                <strong>{pendingReviews.length}</strong>
                <p>Review traveller notes before they appear publicly.</p>
                <button
                  className="text-button"
                  onClick={() => openSection("Moderation")}
                >
                  Review queue
                </button>
              </article>
              <article className="admin-feature-card">
                <div>
                  <p className="eyebrow eyebrow--light">Featured carousel</p>
                  <h2>{featuredIds.length} stories are live.</h2>
                  <p>{sponsoredIds.length} sponsored placements disclosed</p>
                </div>
                <span>Healthy</span>
              </article>
            </section>
          </>
        )}

        {active === "Bookings" && (
          <section className="admin-panel-list booking-admin-list">
            <div className="admin-workspace__head">
              <div>
                <p className="eyebrow">Traveller requests</p>
                <h2>Booking confirmations</h2>
              </div>
            </div>
            {bookings.length ? (
              bookings.map((booking) => (
                <article key={booking.id}>
                  <div>
                    <strong>{booking.title}</strong>
                    <small>
                      {new Date(`${booking.date}T12:00:00`).toLocaleDateString(
                        "en-UG",
                        { day: "numeric", month: "short", year: "numeric" }
                      )}{" "}
                      · {booking.guests} traveller
                      {booking.guests === 1 ? "" : "s"} · {booking.kind}
                    </small>
                    {booking.notes && <small>{booking.notes}</small>}
                  </div>
                  {booking.status === "pending" ? (
                    <div className="admin-row-actions">
                      <button
                        className="button button--small button--dark"
                        onClick={() =>
                          updateBookingStatus(booking.id, "confirmed")
                        }
                      >
                        Confirm
                      </button>
                      <button
                        className="button button--small button--outline"
                        onClick={() =>
                          updateBookingStatus(booking.id, "cancelled")
                        }
                      >
                        Decline
                      </button>
                    </div>
                  ) : (
                    <span className={`request-status request-status--${booking.status}`}>
                      {booking.status}
                    </span>
                  )}
                </article>
              ))
            ) : (
              <div className="trip-empty trip-empty--small">
                <CalendarCheck size={26} />
                <p>No traveller requests have been submitted yet.</p>
              </div>
            )}
          </section>
        )}

        {active === "Places" && (
          <section className="admin-workspace">
            <div className="admin-workspace__head">
              <div>
                <p className="eyebrow">Catalogue</p>
                <h2>Places and experiences</h2>
              </div>
              <div className="admin-search">
                <Search size={17} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search content"
                />
              </div>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Place</th>
                    <th>Category</th>
                    <th>Region</th>
                    <th>Status</th>
                    <th>Featured</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => {
                    const managed = customPlaces.some((place) => place.id === item.id);
                    return (
                      <tr key={item.id}>
                        <td>
                          <img src={item.image} alt="" />
                          <span>
                            <strong>{item.title}</strong>
                            <small>{item.location}</small>
                          </span>
                        </td>
                        <td>{item.category}</td>
                        <td>{item.region}</td>
                        <td>
                          <span className="status-pill">
                            <CheckCircle2 size={13} />
                            {item.status}
                          </span>
                        </td>
                        <td>{featuredIds.includes(item.id) ? "Yes" : "—"}</td>
                        <td>
                          <div className="admin-row-actions">
                            <button
                              className="icon-button"
                              onClick={() => toggleFeatured(item.id)}
                              aria-label={`Toggle featured for ${item.title}`}
                            >
                              <Star size={16} />
                            </button>
                            {managed && (
                              <>
                                <button
                                  className="icon-button"
                                  onClick={() =>
                                    updateCustomPlace(item.id, {
                                      status:
                                        item.status === "draft"
                                          ? "published"
                                          : "draft"
                                    })
                                  }
                                  aria-label={`Toggle publish status for ${item.title}`}
                                >
                                  <Check size={16} />
                                </button>
                                <button
                                  className="icon-button"
                                  onClick={() => removeCustomPlace(item.id)}
                                  aria-label={`Remove ${item.title}`}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {active === "Guides" && (
          <section className="admin-panel-list">
            <div className="admin-workspace__head">
              <div>
                <p className="eyebrow">People</p>
                <h2>Guide verification</h2>
              </div>
            </div>
            {guideItems.map((guide) => (
              <article key={guide.id}>
                <img src={guide.image} alt="" />
                <div>
                  <strong>{guide.name}</strong>
                  <small>{guide.location} · {guide.languages.join(", ")}</small>
                </div>
                <button
                  className={`preference-toggle compact ${
                    guide.verified ? "is-active" : ""
                  }`}
                  onClick={() => toggleGuideVerified(guide.id)}
                  aria-label={`Toggle verification for ${guide.name}`}
                >
                  <i aria-hidden="true" />
                </button>
              </article>
            ))}
          </section>
        )}

        {(active === "Featured" || active === "Sponsored") && (
          <section className="admin-panel-list">
            <div className="admin-workspace__head">
              <div>
                <p className="eyebrow">Homepage curation</p>
                <h2>{active} placements</h2>
              </div>
            </div>
            {catalogItems
              .filter((item) => item.status === "published")
              .map((item) => {
                const selected =
                  active === "Featured"
                    ? featuredIds.includes(item.id)
                    : sponsoredIds.includes(item.id);
                return (
                  <article key={item.id}>
                    <img src={item.image} alt="" />
                    <div>
                      <strong>{item.title}</strong>
                      <small>{item.category} · {item.location}</small>
                    </div>
                    <button
                      className={`preference-toggle compact ${
                        selected ? "is-active" : ""
                      }`}
                      onClick={() =>
                        active === "Featured"
                          ? toggleFeatured(item.id)
                          : toggleSponsored(item.id)
                      }
                      aria-label={`Toggle ${active.toLowerCase()} for ${item.title}`}
                    >
                      <i aria-hidden="true" />
                    </button>
                  </article>
                );
              })}
          </section>
        )}

        {active === "Moderation" && (
          <section className="admin-panel-list moderation-list">
            <div className="admin-workspace__head">
              <div>
                <p className="eyebrow">Community quality</p>
                <h2>Traveller reviews</h2>
              </div>
            </div>
            {reviews.length ? (
              reviews.map((review) => (
                <article key={review.id}>
                  <div>
                    <strong>{review.author} · {"★".repeat(review.rating)}</strong>
                    <small>{review.text}</small>
                  </div>
                  {review.status === "pending" ? (
                    <div className="admin-row-actions">
                      <button
                        className="button button--small button--dark"
                        onClick={() => moderateReview(review.id, "published")}
                      >
                        Publish
                      </button>
                      <button
                        className="button button--small button--outline"
                        onClick={() => moderateReview(review.id, "rejected")}
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="status-pill">{review.status}</span>
                  )}
                </article>
              ))
            ) : (
              <div className="trip-empty trip-empty--small">
                <ShieldCheck size={26} />
                <p>No reviews are waiting for moderation.</p>
              </div>
            )}
          </section>
        )}
      </main>

      {editorOpen && (
        <div className="confirm-card admin-editor" role="dialog" aria-modal="true">
          <form onSubmit={addPlace}>
            <button
              type="button"
              className="icon-button auth-sheet__close"
              onClick={() => setEditorOpen(false)}
              aria-label="Close editor"
            >
              <X size={18} />
            </button>
            <p className="eyebrow">New catalogue entry</p>
            <h2>Add a place</h2>
            <div className="admin-editor__grid">
              <label className="field">
                <span>Title</span>
                <input value={title} onChange={(event) => setTitle(event.target.value)} required />
              </label>
              <label className="field">
                <span>Category</span>
                <select value={category} onChange={(event) => setCategory(event.target.value as Category)}>
                  {categories.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label className="field">
                <span>Location</span>
                <input value={location} onChange={(event) => setLocation(event.target.value)} required />
              </label>
              <label className="field">
                <span>Region</span>
                <input value={region} onChange={(event) => setRegion(event.target.value)} />
              </label>
              <label className="field">
                <span>Latitude</span>
                <input
                  type="number"
                  step="any"
                  min="-90"
                  max="90"
                  value={latitude}
                  onChange={(event) => setLatitude(event.target.value)}
                />
              </label>
              <label className="field">
                <span>Longitude</span>
                <input
                  type="number"
                  step="any"
                  min="-180"
                  max="180"
                  value={longitude}
                  onChange={(event) => setLongitude(event.target.value)}
                />
              </label>
            </div>
            <label className="field">
              <span>Image URL</span>
              <input value={image} onChange={(event) => setImage(event.target.value)} placeholder="Optional" />
            </label>
            <label className="field">
              <span>Description</span>
              <textarea value={description} onChange={(event) => setDescription(event.target.value)} required />
            </label>
            <button className="button button--dark button--full">Save draft</button>
          </form>
        </div>
      )}
    </div>
  );
}
