import { useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Eye,
  FileText,
  ImagePlus,
  LayoutDashboard,
  Megaphone,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  ShieldCheck,
  Users,
  X
} from "lucide-react";
import { Link } from "react-router-dom";
import { Brand } from "@/components/Brand";
import { catalog, guides } from "@/data/catalog";
import { useApp } from "@/context/AppContext";

const adminNav = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Places", icon: FileText },
  { label: "Guides", icon: Users },
  { label: "Featured", icon: ImagePlus },
  { label: "Sponsored", icon: Megaphone },
  { label: "Moderation", icon: ShieldCheck }
];

export function AdminPage() {
  const [navOpen, setNavOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { notify } = useApp();
  const filtered = catalog.filter((item) =>
    `${item.title} ${item.location} ${item.category}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${navOpen ? "is-open" : ""}`}>
        <div className="admin-sidebar__head">
          <Brand />
          <button
            className="icon-button admin-sidebar__close"
            onClick={() => setNavOpen(false)}
          >
            <X size={18} />
          </button>
        </div>
        <span className="admin-sidebar__label">Content studio</span>
        <nav>
          {adminNav.map(({ label, icon: Icon }, index) => (
            <button
              key={label}
              className={index === 0 ? "is-active" : ""}
              onClick={() => notify(`${label} workspace is being prepared`)}
            >
              <Icon size={19} />
              {label}
              {label === "Moderation" && <small>3</small>}
            </button>
          ))}
        </nav>
        <Link to="/" className="admin-sidebar__back">
          <ArrowLeft size={17} />
          Back to GoUG
        </Link>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <button
            className="icon-button admin-menu"
            onClick={() => setNavOpen(true)}
          >
            <Menu size={20} />
          </button>
          <div>
            <p className="eyebrow">Monday, 28 July</p>
            <h1>Good morning, GoUG team.</h1>
          </div>
          <button
            className="button button--dark"
            onClick={() => notify("The new place editor is coming next")}
          >
            <Plus size={17} />
            Add place
          </button>
        </header>

        <section className="admin-stats">
          <article>
            <span className="admin-stats__icon admin-stats__icon--green">
              <Eye size={21} />
            </span>
            <div>
              <small>Catalogue views</small>
              <strong>12.4k</strong>
              <em>+18% this month</em>
            </div>
          </article>
          <article>
            <span className="admin-stats__icon admin-stats__icon--sun">
              <FileText size={21} />
            </span>
            <div>
              <small>Published places</small>
              <strong>{catalog.length}</strong>
              <em>3 drafts waiting</em>
            </div>
          </article>
          <article>
            <span className="admin-stats__icon admin-stats__icon--cream">
              <Users size={21} />
            </span>
            <div>
              <small>Verified guides</small>
              <strong>{guides.length}</strong>
              <em>2 checks pending</em>
            </div>
          </article>
          <article>
            <span className="admin-stats__icon admin-stats__icon--orange">
              <BarChart3 size={21} />
            </span>
            <div>
              <small>Save rate</small>
              <strong>8.6%</strong>
              <em>+2.1% this month</em>
            </div>
          </article>
        </section>

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
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
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
                        Published
                      </span>
                    </td>
                    <td>{item.featured ? "Yes" : "—"}</td>
                    <td>
                      <button
                        className="icon-button"
                        onClick={() => notify(`Actions for ${item.title}`)}
                      >
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="admin-bottom-grid">
          <article>
            <div>
              <p className="eyebrow">Needs attention</p>
              <h2>Moderation queue</h2>
            </div>
            <strong>3</strong>
            <p>Traveller reviews will appear here when community features open.</p>
            <button
              className="text-button"
              onClick={() => notify("Moderation queue is empty in demo mode")}
            >
              Review queue
            </button>
          </article>
          <article className="admin-feature-card">
            <div>
              <p className="eyebrow eyebrow--light">Featured carousel</p>
              <h2>Three stories are live.</h2>
              <p>Activity · Editor's pick · Sponsored stay</p>
            </div>
            <span>Healthy</span>
          </article>
        </section>
      </main>
    </div>
  );
}
