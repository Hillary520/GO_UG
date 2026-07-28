import {
  Compass,
  Heart,
  Map,
  ShieldCheck,
  UserRound
} from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Brand } from "@/components/Brand";
import { useApp } from "@/context/AppContext";

const navItems = [
  { to: "/", label: "Discover", icon: Compass },
  { to: "/trips", label: "Trips", icon: Map },
  { to: "/guides", label: "Guide", icon: ShieldCheck },
  { to: "/profile", label: "Profile", icon: UserRound }
];

export function AppShell() {
  const location = useLocation();
  const { savedIds } = useApp();
  const isDetail =
    location.pathname.startsWith("/places/") ||
    location.pathname.startsWith("/guides/");
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <div className={`app-layout ${isAdmin ? "app-layout--admin" : ""}`}>
      <aside className="desktop-rail">
        <Brand />
        <nav aria-label="Primary navigation">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `desktop-rail__link ${isActive ? "is-active" : ""}`
              }
            >
              <Icon size={20} strokeWidth={1.8} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <NavLink to="/profile" className="saved-rail-card">
          <span className="icon-button icon-button--cream">
            <Heart size={18} />
          </span>
          <span>
            <strong>{savedIds.length} saved</strong>
            <small>Your Uganda shortlist</small>
          </span>
        </NavLink>
        <p className="desktop-rail__foot">Made thoughtfully in Uganda</p>
      </aside>

      <main className="app-main">
        <Outlet />
      </main>

      {!isDetail && !isAdmin && (
        <nav className="bottom-nav" aria-label="Primary navigation">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              aria-label={label}
              className={({ isActive }) =>
                `bottom-nav__item ${isActive ? "is-active" : ""}`
              }
            >
              <Icon size={21} strokeWidth={1.8} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  );
}
