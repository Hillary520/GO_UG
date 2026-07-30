import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  Languages,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Star
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { useSmartBack } from "@/lib/useSmartBack";

export function GuideDetailPage() {
  const { id } = useParams();
  const goBack = useSmartBack("/guides");
  const { guideItems } = useApp();
  const guide = guideItems.find((entry) => entry.id === id);

  if (!guide) {
    return (
      <div className="not-found">
        <h1>We couldn't find that guide.</h1>
        <Link to="/guides" className="button button--dark">
          Browse guides
        </Link>
      </div>
    );
  }

  return (
    <article className="detail-page guide-detail">
      <header
        className="detail-hero guide-detail__hero"
        style={{ backgroundImage: `url(${guide.coverImage})` }}
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
        </div>
      </header>

      <div className="guide-profile">
        <div className="guide-profile__identity">
          <div className="guide-profile__portrait">
            <img src={guide.image} alt={guide.name} />
            {guide.verified && <BadgeCheck size={25} fill="var(--sun)" />}
          </div>
          <div>
            <p className="eyebrow">
              {guide.verified ? "GoUG verified guide" : "Guide profile"}
            </p>
            <h1>{guide.name}</h1>
            <span>
              <MapPin size={15} />
              {guide.location}
            </span>
          </div>
          <div className="guide-profile__rating">
            <strong>
              <Star size={16} fill="currentColor" />
              {guide.rating}
            </strong>
            <small>{guide.reviewCount} reviews</small>
          </div>
        </div>

        <div className="guide-profile__layout">
          <div className="guide-profile__main">
            <section>
              <p className="detail-lead">{guide.bio}</p>
            </section>
            <section className="guide-facts">
              <div>
                <span>
                  <ShieldCheck size={20} />
                </span>
                <strong>{guide.yearsExperience} years</strong>
                <small>Local guiding</small>
              </div>
              <div>
                <span>
                  <Languages size={20} />
                </span>
                <strong>{guide.languages.length} languages</strong>
                <small>{guide.languages.join(", ")}</small>
              </div>
              <div>
                <span>
                  <Star size={20} />
                </span>
                <strong>{guide.specialties[0]}</strong>
                <small>Top specialty</small>
              </div>
            </section>
            <section className="detail-section">
              <p className="eyebrow">Explore together</p>
              <h2>Specialties</h2>
              <div className="tag-row tag-row--large">
                {guide.specialties.map((specialty) => (
                  <span key={specialty}>{specialty}</span>
                ))}
              </div>
            </section>
            {guide.verified && (
              <section className="verified-note">
                <ShieldCheck size={23} />
                <div>
                  <strong>Verified by the GoUG team</strong>
                  <p>
                    Identity, references and local guiding experience have been
                    checked.
                  </p>
                </div>
              </section>
            )}
          </div>

          <aside className="detail-booking guide-profile__booking">
            <p className="eyebrow">Plan a day together</p>
            <h2>{guide.priceLabel}</h2>
            <p>Tell us your dates and interests. No payment is taken yet.</p>
            <Link
              className="button button--sun button--full"
              to={`/request/guide/${guide.id}`}
            >
              <CalendarDays size={18} />
              Request dates
            </Link>
            <Link
              className="button button--outline button--full"
              to={`/messages/${guide.id}`}
            >
              <MessageCircle size={18} />
              Ask a question
            </Link>
          </aside>
        </div>
      </div>
    </article>
  );
}
