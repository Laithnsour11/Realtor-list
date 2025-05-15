import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface Contact {
  _id: string;
  name: string;
  serviceAreaValue: string;
  location?: { lat: number; lng: number };
}

interface MapProps {
  contacts: Contact[];
}

export function Map({ contacts }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [-95.7129, 37.0902],
        zoom: 3,
        accessToken: import.meta.env.VITE_MAPBOX_PUBLIC_KEY,
      });
    }

    const markers: mapboxgl.Marker[] = [];
    const bounds = new mapboxgl.LngLatBounds();

    contacts.forEach((contact) => {
      if (!contact.location) return;

      const marker = new mapboxgl.Marker()
        .setLngLat([contact.location.lng, contact.location.lat])
        .setPopup(
          new mapboxgl.Popup().setHTML(
            `<h3 class="font-bold">${contact.name}</h3>
             <p>${contact.serviceAreaValue}</p>`
          )
        )
        .addTo(map.current!);

      markers.push(marker);
      bounds.extend([contact.location.lng, contact.location.lat]);
    });

    if (!bounds.isEmpty()) {
      map.current.fitBounds(bounds, { padding: 50 });
    }

    return () => {
      markers.forEach((marker) => marker.remove());
    };
  }, [contacts]);

  return <div ref={mapContainer} className="w-full h-[calc(100vh-64px)]" />;
}
