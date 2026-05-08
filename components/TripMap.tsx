"use client";

import { useEffect, useState } from "react";
import { Day } from "@/lib/types";

const DAY_COLORS = ["#ffc2f7", "#ec542d", "#ebb70b", "#0b50b8", "#fe5c5d"];

function getColor(dayIndex: number) {
  return DAY_COLORS[dayIndex % DAY_COLORS.length];
}

export default function TripMap({ days }: { days: Day[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[400px] bg-card border border-canvas/10 flex items-center justify-center">
        <p className="font-condensed text-[13px] text-placeholder uppercase tracking-[0.1em]">Loading map...</p>
      </div>
    );
  }

  return <MapInner days={days} />;
}

function MapInner({ days }: { days: Day[] }) {
  const [leaflet, setLeaflet] = useState<{
    MapContainer: typeof import("react-leaflet").MapContainer;
    TileLayer: typeof import("react-leaflet").TileLayer;
    CircleMarker: typeof import("react-leaflet").CircleMarker;
    Popup: typeof import("react-leaflet").Popup;
  } | null>(null);

  useEffect(() => {
    import("react-leaflet").then((mod) => {
      setLeaflet({
        MapContainer: mod.MapContainer,
        TileLayer: mod.TileLayer,
        CircleMarker: mod.CircleMarker,
        Popup: mod.Popup,
      });
    });

    import("leaflet/dist/leaflet.css");
  }, []);

  if (!leaflet) {
    return (
      <div className="w-full h-[400px] bg-card border border-canvas/10 flex items-center justify-center">
        <p className="font-condensed text-[13px] text-placeholder uppercase tracking-[0.1em]">Loading map...</p>
      </div>
    );
  }

  const { MapContainer, TileLayer, CircleMarker, Popup } = leaflet;

  const allSpots = days.flatMap((day, dayIdx) => {
    const spots = [...day.morning, ...day.afternoon, ...day.evening];
    return spots.map((spot) => ({ ...spot, dayIndex: dayIdx }));
  });

  if (allSpots.length === 0) return null;

  const avgLat = allSpots.reduce((s, sp) => s + sp.lat, 0) / allSpots.length;
  const avgLng = allSpots.reduce((s, sp) => s + sp.lng, 0) / allSpots.length;

  return (
    <MapContainer
      center={[avgLat, avgLng]}
      zoom={12}
      className="w-full h-[400px] z-0"
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {allSpots.map((spot, i) => (
        <CircleMarker
          key={i}
          center={[spot.lat, spot.lng]}
          radius={6}
          pathOptions={{
            color: getColor(spot.dayIndex),
            fillColor: getColor(spot.dayIndex),
            fillOpacity: 0.7,
            weight: 1.5,
          }}
        >
          <Popup>
            <div className="text-black">
              <strong>{spot.name}</strong>
              <br />
              <a
                href={spot.google_maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline text-xs"
              >
                Open in Google Maps
              </a>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
