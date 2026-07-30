import { MapPinned, Search } from "lucide-react";
import { lazy, Suspense, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useApp } from "@/context/AppContext";

const MapCanvas = lazy(() =>
  import("@/components/MapCanvas").then((module) => ({
    default: module.MapCanvas
  }))
);

export function MapPage() {
  const { catalogItems } = useApp();
  const [searchParams] = useSearchParams();
  const selectedId = searchParams.get("place");
  const [query, setQuery] = useState("");
  const places = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return catalogItems.filter(
      (item) =>
        item.status === "published" &&
        item.coordinates &&
        (!selectedId || item.id === selectedId) &&
        (!normalized ||
          `${item.title} ${item.location} ${item.region} ${item.category}`
            .toLowerCase()
            .includes(normalized))
    );
  }, [catalogItems, query, selectedId]);
  const selectedPlace = selectedId
    ? catalogItems.find((item) => item.id === selectedId)
    : undefined;

  return (
    <div className="page map-page">
      <header className="page-header">
        <p className="eyebrow">
          {selectedPlace ? "Mapped in GoUG" : "See the whole journey"}
        </p>
        <h1>{selectedPlace?.title || "Explore Uganda by map"}</h1>
        <p>
          {selectedPlace
            ? `${selectedPlace.location} · zoom and explore nearby Uganda.`
            : "Zoom, use your location and tap any GoUG marker."}
        </p>
      </header>
      {selectedPlace && (
        <Link to="/map" replace className="map-page__all">
          Show every mapped place
        </Link>
      )}
      <div className="search-bar map-page__search">
        <Search size={20} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={selectedPlace ? "Search this place" : "Search the map"}
          aria-label="Search the map"
        />
        <span>{places.length}</span>
      </div>
      <Suspense
        fallback={<div className="goug-map map-loading">Loading map…</div>}
      >
        <MapCanvas places={places} />
      </Suspense>
      <section className="map-place-list">
        <p className="eyebrow">On this map</p>
        <div>
          {places.map((place) => (
            <Link to={`/places/${place.id}`} key={place.id}>
              <img src={place.image} alt="" />
              <span>
                <strong>{place.title}</strong>
                <small>{place.location}</small>
              </span>
              <MapPinned size={18} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
