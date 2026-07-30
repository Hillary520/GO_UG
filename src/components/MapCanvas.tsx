import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Capacitor } from "@capacitor/core";
import { Geolocation } from "@capacitor/geolocation";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import type { ManagedPlace } from "@/types";

type MapCanvasProps = {
  places: ManagedPlace[];
  className?: string;
  compact?: boolean;
};

const UGANDA_CENTER: [number, number] = [32.35, 1.28];

export function MapCanvas({
  places,
  className = "",
  compact = false
}: MapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { notify } = useApp();

  useEffect(() => {
    if (!containerRef.current) return;

    const mapped = places.filter((place) => place.coordinates);
    const first = mapped[0]?.coordinates;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: first ? [first.lng, first.lat] : UGANDA_CENTER,
      zoom: first && (compact || mapped.length === 1) ? 10 : 5.6,
      attributionControl: {}
    });

    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      "top-right"
    );
    if (!compact && !Capacitor.isNativePlatform()) {
      map.addControl(
        new maplibregl.GeolocateControl({
          positionOptions: { enableHighAccuracy: true },
          trackUserLocation: true
        }),
        "top-right"
      );
    }
    if (!compact && Capacitor.isNativePlatform()) {
      const locationControl: maplibregl.IControl = {
        onAdd(controlMap) {
          const container = document.createElement("div");
          container.className = "maplibregl-ctrl maplibregl-ctrl-group";
          const button = document.createElement("button");
          button.type = "button";
          button.className = "goug-location-control";
          button.title = "Show my location";
          button.setAttribute("aria-label", "Show my location");
          button.textContent = "◎";
          button.addEventListener("click", () => {
            void (async () => {
              try {
                const permission = await Geolocation.requestPermissions({
                  permissions: ["coarseLocation"]
                });
                if (
                  permission.coarseLocation !== "granted" &&
                  permission.location !== "granted"
                ) {
                  notify("Location permission was not granted");
                  return;
                }
                const position = await Geolocation.getCurrentPosition({
                  enableHighAccuracy: false,
                  timeout: 10000,
                  maximumAge: 60000
                });
                const coordinates: [number, number] = [
                  position.coords.longitude,
                  position.coords.latitude
                ];
                controlMap.flyTo({ center: coordinates, zoom: 11 });
                new maplibregl.Marker({ color: "#0b6b44" })
                  .setLngLat(coordinates)
                  .addTo(controlMap);
              } catch {
                notify("We couldn't get your location");
              }
            })();
          });
          container.append(button);
          return container;
        },
        onRemove() {
          return;
        }
      };
      map.addControl(locationControl, "top-right");
    }

    const bounds = new maplibregl.LngLatBounds();
    for (const place of mapped) {
      const coordinates = place.coordinates!;
      const marker = document.createElement("button");
      marker.className = "goug-map-marker";
      marker.type = "button";
      marker.setAttribute("aria-label", `Open ${place.title}`);
      marker.append(document.createElement("span"));

      const popup = document.createElement("button");
      popup.className = "goug-map-popup";
      popup.type = "button";
      const title = document.createElement("strong");
      title.textContent = place.title;
      const location = document.createElement("small");
      location.textContent = place.location;
      popup.append(title, location);
      popup.addEventListener("click", () => navigate(`/places/${place.id}`));

      new maplibregl.Marker({ element: marker, anchor: "bottom" })
        .setLngLat([coordinates.lng, coordinates.lat])
        .setPopup(
          new maplibregl.Popup({ offset: 20, closeButton: false }).setDOMContent(
            popup
          )
        )
        .addTo(map);
      bounds.extend([coordinates.lng, coordinates.lat]);
    }

    if (!compact && mapped.length > 1) {
      map.once("load", () => {
        map.fitBounds(bounds, {
          padding: { top: 70, right: 45, bottom: 70, left: 45 },
          maxZoom: 7,
          duration: 0
        });
      });
    }

    return () => map.remove();
  }, [compact, navigate, notify, places]);

  return (
    <div
      ref={containerRef}
      className={`goug-map ${compact ? "goug-map--compact" : ""} ${className}`}
      aria-label="Interactive map"
    />
  );
}
