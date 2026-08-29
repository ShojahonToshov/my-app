'use client';
import { useI18nStore } from "@/stores/i18nStore";


import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Star, ZoomIn, ZoomOut } from 'lucide-react';

// Fix Leaflet's default icon path issues with Next.js
type DefaultIconPrototype = L.Icon.Default & { _getIconUrl?: string };
delete (L.Icon.Default.prototype as DefaultIconPrototype)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Venue {
  id: string;
  name: string;
  rating: number;
  coordinates?: { x: number; y: number } | [number, number];
}

interface MapProps {
  venues: Venue[];
  center?: [number, number];
  zoom?: number;
  activeVenueId?: string;
  onVenueClick?: (id: string) => void;
}

const CustomZoomControl = () => {
  const map = useMap();
  
  return (
    <div className="absolute top-5 right-5 flex flex-col gap-2 z-[400]">
      <button
        onClick={(e) => { e.stopPropagation(); map.zoomIn(); }}
        className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full border border-[#DCDCDA] flex items-center justify-center text-[#121415] hover:text-[#8A2532] hover:bg-[#F5F5F4] transition-colors duration-300 shadow-sm hover:shadow-md active:scale-95 shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#121415]"
      >
        <ZoomIn className="w-5 h-5" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); map.zoomOut(); }}
        className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full border border-[#DCDCDA] flex items-center justify-center text-[#121415] hover:text-[#8A2532] hover:bg-[#F5F5F4] transition-colors duration-300 shadow-sm hover:shadow-md active:scale-95 shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#121415]"
      >
        <ZoomOut className="w-5 h-5" />
      </button>
    </div>
  );
};

// Create a custom icon for venues similar to the existing UI
const createCustomIcon = (rating: number, isActive: boolean, name: string) => {
  const html = `
    <div class="group flex flex-col items-center cursor-pointer transition-all duration-300 ease-out hover:z-20 active:scale-95 outline-none" style="transform: translate(-50%, -100%);">
      <div class="px-4 py-2.5 rounded-[20px] font-semibold text-sm flex flex-col items-center shadow-md overflow-hidden transition-all duration-300 ${isActive ? "bg-[#121415] text-white" : "bg-white text-[#121415] border border-[#DCDCDA]"}" style="box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);">
        <div class="max-h-0 max-w-0 opacity-0 group-hover:max-h-[40px] group-hover:max-w-[300px] group-hover:opacity-100 group-hover:mb-1 whitespace-nowrap overflow-hidden transition-all duration-300 ease-out text-center">
          ${name}
        </div>
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5 fill-[#8A2532] text-[#8A2532] shrink-0 mr-1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          <span>${rating.toFixed(1)}</span>
        </div>
      </div>
      <div class="w-3 h-3 rotate-45 -mt-1.5 transition-colors duration-300 ${isActive ? "bg-[#121415]" : "bg-white border-b border-r border-[#DCDCDA]"}" ></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-venue-icon', // Need to override default leaflet-div-icon styles
    iconSize: [0, 0], 
    iconAnchor: [0, 0], 
  });
};


const DEFAULT_CENTER: [number, number] = [41.3775, 64.5853]; // Center of Uzbekistan

export default function Map({ venues, center = DEFAULT_CENTER, zoom = 6, activeVenueId, onVenueClick }: MapProps) {
  // Fix for Next.js SSR and client-side mismatch in generating random points
  const [mounted, setMounted] = useState(false);
  const [venueCoordinates, setVenueCoordinates] = useState<Record<string, [number, number]>>({});

  useEffect(() => {
    setVenueCoordinates(prev => {
      let changed = false;
      const newCoords = { ...prev };
      
      venues.forEach(venue => {
        if (!newCoords[venue.id]) {
          changed = true;
          // Scatter across Uzbekistan territory if no coordinates exist
          let lat = 41.3775 + (Math.random() - 0.5) * 6; // Latitude spread for UZB
          let lng = 64.5853 + (Math.random() - 0.5) * 14; // Longitude spread for UZB
          
          if (venue.coordinates) {
            if (Array.isArray(venue.coordinates)) {
               lat = venue.coordinates[0];
               lng = venue.coordinates[1];
            } else if ('x' in venue.coordinates && 'y' in venue.coordinates && (venue.coordinates.x !== 0 || venue.coordinates.y !== 0)) {
               lat = venue.coordinates.y; // usually y is lat
               lng = venue.coordinates.x;
            }
          }
          newCoords[venue.id] = [lat, lng];
        }
      });
      
      return changed ? newCoords : prev;
    });
    
    setMounted(true);
  }, [venues, center]);

  if (!mounted) return <div className="w-full h-full bg-[#F5F5F4] animate-pulse rounded-2xl" />;

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden border border-[#DCDCDA] shadow-inner">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">{useI18nStore.getState().t("extra.t330")}</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <CustomZoomControl />
        {venues.map((venue) => {
          const isActive = venue.id === activeVenueId;
          const pos = venueCoordinates[venue.id];
          
          if (!pos) return null;

          return (
            <Marker 
              key={venue.id} 
              position={pos} 
              icon={createCustomIcon(venue.rating, isActive, venue.name)}
              eventHandlers={{
                click: () => onVenueClick?.(venue.id)
              }}
            />
          );
        })}
      </MapContainer>
      <style jsx global>{`
        .custom-venue-icon {
          background: transparent;
          border: none;
        }
        .leaflet-container {
          font-family: inherit;
        }
      `}</style>
    </div>
  );
}
