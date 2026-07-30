import {
  ChevronRight,
  CircleHelp,
  Globe2,
  Heart,
  LogOut,
  Map,
  Shield,
  SlidersHorizontal,
  Trash2,
  UserRound,
  Wrench
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { CatalogCard } from "@/components/CatalogCard";
import { SectionHeading } from "@/components/SectionHeading";
import { useApp } from "@/context/AppContext";

export function ProfilePage() {
  const {
    user,
    setAuthOpen,
    signOut,
    deleteAccount,
    savedIds,
    tripIds,
    catalogItems
  } = useApp();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const savedItems = savedIds
    .map((id) => catalogItems.find((item) => item.id === id))
    .filter(Boolean);

  return (
    <div className="page">
      <header className="profile-header">
        <div className="profile-header__identity">
          <div className="avatar avatar--large">
            {user?.initials || <UserRound size={28} />}
          </div>
          <div>
            <p className="eyebrow">{user ? "Explorer profile" : "Travel as a guest"}</p>
            <h1>{user?.displayName || "Your Uganda awaits"}</h1>
            <p>{user?.email || "Sign in to keep plans across devices."}</p>
          </div>
        </div>
        {user ? (
          <button className="button button--outline" onClick={signOut}>
            <LogOut size={17} />
            Sign out
          </button>
        ) : (
          <button className="button button--sun" onClick={() => setAuthOpen(true)}>
            Sign in
          </button>
        )}
      </header>

      <section className="profile-stats">
        <div>
          <span>
            <Heart size={18} />
          </span>
          <strong>{savedIds.length}</strong>
          <small>Saved</small>
        </div>
        <div>
          <span>
            <Map size={18} />
          </span>
          <strong>{tripIds.length}</strong>
          <small>Trip stops</small>
        </div>
        <div>
          <span>
            <Globe2 size={18} />
          </span>
          <strong>UG</strong>
          <small>Exploring</small>
        </div>
      </section>

      {savedItems.length > 0 && (
        <section className="content-section">
          <SectionHeading eyebrow="Your shortlist" title="Saved for later" />
          <div className="catalog-grid catalog-grid--saved">
            {savedItems.slice(0, 3).map((item) =>
              item ? <CatalogCard key={item.id} item={item} compact /> : null
            )}
          </div>
        </section>
      )}

      <section className="settings-section">
        <p className="eyebrow">Preferences</p>
        <div className="settings-list">
          <Link to="/preferences">
            <span className="settings-list__icon">
              <SlidersHorizontal size={19} />
            </span>
            <span>
              <strong>Travel preferences</strong>
              <small>Language, currency, interests and reminders</small>
            </span>
            <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      <section className="settings-section">
        <p className="eyebrow">GoUG</p>
        <div className="settings-list">
          <Link to="/support">
            <span className="settings-list__icon">
              <CircleHelp size={19} />
            </span>
            <span>
              <strong>Help and support</strong>
              <small>Questions, safety and contacts</small>
            </span>
            <ChevronRight size={18} />
          </Link>
          <Link to="/privacy">
            <span className="settings-list__icon">
              <Shield size={19} />
            </span>
            <span>
              <strong>Privacy and legal</strong>
              <small>How GoUG looks after your data</small>
            </span>
            <ChevronRight size={18} />
          </Link>
          <Link to="/admin">
            <span className="settings-list__icon">
              <Wrench size={19} />
            </span>
            <span>
              <strong>Content studio</strong>
              <small>Manage places, guides and moderation</small>
            </span>
            <ChevronRight size={18} />
          </Link>
          {user && (
            <button
              className="settings-list__danger"
              onClick={() => setConfirmDelete(true)}
            >
              <span className="settings-list__icon">
                <Trash2 size={19} />
              </span>
              <span>
                <strong>Delete account</strong>
                <small>Permanently remove your data</small>
              </span>
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      </section>

      <footer className="profile-footer">
        <strong>GoUG</strong>
        <span>Version 1.0 · Built with care in Uganda</span>
      </footer>
      {confirmDelete && (
        <div className="confirm-card" role="dialog" aria-modal="true">
          <div>
            <h2>Delete your account?</h2>
            <p>
              This removes your saved places, trips, requests, messages and
              reviews from this device and deletes the Firebase account.
            </p>
            <div>
              <button
                className="button button--outline"
                onClick={() => setConfirmDelete(false)}
              >
                Keep account
              </button>
              <button
                className="button button--dark"
                onClick={async () => {
                  const deleted = await deleteAccount();
                  if (deleted) setConfirmDelete(false);
                }}
              >
                Delete account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
