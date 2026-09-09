'use client';
import { useI18n } from "@/hooks/useI18n";
import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ZoomIn, ZoomOut, Navigation, MapPin, ChevronRight, Star } from 'lucide-react';
import Link from 'next/link';

// Fix Leaflet's default icon path issues with Next.js
type DefaultIconPrototype = L.Icon.Default & { _getIconUrl?: string };
delete (L.Icon.Default.prototype as DefaultIconPrototype)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export interface Venue {
  id: string;
  name: string;
  rating: number;
  coordinates?: { x: number; y: number } | [number, number];
  address?: string;
  image?: string;
  category?: string;
  reviews?: number;
}

interface MapProps {
  venues: Venue[];
  center?: [number, number];
  zoom?: number;
  activeVenueId?: string;
  onVenueClick?: (id: string) => void;
}

const MapControls = () => {
  const map = useMap();
  const [locating, setLocating] = useState(false);
  const [userPos, setUserPos] = useState<L.LatLng | null>(null);

  useEffect(() => {
    const onLocationFound = (e: L.LocationEvent) => {
      setUserPos(e.latlng);
      setLocating(false);
      map.flyTo(e.latlng, 14, { animate: true, duration: 1.5 });
    };
    const onLocationError = (e: L.ErrorEvent) => {
      setLocating(false);
      alert("Не удалось получить доступ к геолокации. Пожалуйста, разрешите доступ в настройках браузера. (" + e.message + ")");
    };

    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);
    return () => {
      map.off('locationfound', onLocationFound);
      map.off('locationerror', onLocationError);
    };
  }, [map]);

  return (
    <>
      <div className="absolute top-5 right-5 flex flex-col gap-2 z-[400]">
        <button
          onClick={(e) => { e.stopPropagation(); map.zoomIn(); }}
          className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full border border-[#DCDCDA] flex items-center justify-center text-[#121415] hover:text-[#8A2532] hover:bg-[#F5F5F4] transition-colors duration-300 shadow-sm hover:shadow-md active:scale-95 shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#121415]"
          title="Приблизить"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); map.zoomOut(); }}
          className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full border border-[#DCDCDA] flex items-center justify-center text-[#121415] hover:text-[#8A2532] hover:bg-[#F5F5F4] transition-colors duration-300 shadow-sm hover:shadow-md active:scale-95 shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#121415]"
          title="Отдалить"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => { 
            e.stopPropagation(); 
            setLocating(true);
            map.locate({ setView: false, maxZoom: 16, enableHighAccuracy: false, timeout: 15000 }); 
          }}
          className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full border border-[#DCDCDA] flex items-center justify-center text-[#121415] hover:text-[#8A2532] hover:bg-[#F5F5F4] transition-colors duration-300 shadow-sm hover:shadow-md active:scale-95 shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#121415]"
          title="Мое местоположение"
        >
          {locating ? (
            <div className="w-5 h-5 border-2 border-[#8A2532] border-t-transparent rounded-full animate-spin" />
          ) : (
            <Navigation className="w-5 h-5" />
          )}
        </button>
      </div>
      {userPos && (
        <Marker 
          position={userPos} 
          icon={L.divIcon({
            html: `<div class="relative flex items-center justify-center w-6 h-6">
                     <div class="absolute w-full h-full bg-[#8A2532] rounded-full animate-ping opacity-75"></div>
                     <div class="relative w-3 h-3 bg-[#8A2532] border-2 border-white rounded-full shadow"></div>
                   </div>`,
            className: 'custom-user-icon',
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          })} 
        />
      )}
    </>
  );
};

const ActiveVenuePanner = ({ activeId, coordinates }: { activeId?: string, coordinates: Record<string, [number, number]> }) => {
  const map = useMap();
  useEffect(() => {
    if (activeId && coordinates[activeId]) {
      // Don't interrupt user interaction if they are dragging
      map.flyTo(coordinates[activeId], 15, { animate: true, duration: 1.2 });
    }
  }, [activeId, coordinates, map]);
  return null;
};

const MapBoundsFitter = ({ coordinates }: { coordinates: Record<string, [number, number]> }) => {
  const map = useMap();
  const isFirstRender = useRef(true);

  useEffect(() => {
    const coordsArray = Object.values(coordinates);
    if (coordsArray.length > 0 && isFirstRender.current) {
      const bounds = L.latLngBounds(coordsArray);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
      isFirstRender.current = false;
    }
  }, [coordinates, map]);
  return null;
};


// Create a custom icon for venues similar to the existing UI
const createCustomIcon = (rating: number, isActive: boolean, name: string) => {
  const html = `
    <div class="group flex flex-col items-center cursor-pointer transition-all duration-300 ease-out hover:z-20 active:scale-95 outline-none" style="transform: translate(-50%, -100%);">
      <div class="px-4 py-2.5 rounded-[20px] font-semibold text-sm flex flex-col items-center shadow-md overflow-hidden transition-all duration-300 ${isActive ? "bg-[#121415] text-white scale-110" : "bg-white text-[#121415] border border-[#DCDCDA]"}" style="box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);">
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
  const { t } = useI18n();

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
          // Scatter across Uzbekistan territory if no coordinates exist (Fallback)
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
          attribution={`&copy; <a href="https://www.openstreetmap.org/copyright">${t("extra.t330")}</a>`}
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapControls />
        <MapBoundsFitter coordinates={venueCoordinates} />
        <ActiveVenuePanner activeId={activeVenueId} coordinates={venueCoordinates} />

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
              zIndexOffset={isActive ? 1000 : 0}
            >
              <Popup closeButton={false} offset={[0, -45]} className="custom-popup">
                <div className="w-[240px] flex flex-col bg-white rounded-2xl overflow-hidden shadow-lg border border-[#DCDCDA]">
                  {venue.image && (
                    <div className="w-full h-[120px] bg-[#F5F5F4] relative">
                      <img src={venue.image} alt={venue.name} className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg flex items-center gap-1 shadow-sm">
                        <Star className="w-3 h-3 fill-[#8A2532] text-[#8A2532]" />
                        <span className="text-xs font-bold text-[#121415]">{venue.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  )}
                  <div className="p-3">
                    <h4 className="font-semibold text-[#121415] text-[15px] leading-tight mb-1 truncate">{venue.name}</h4>
                    <p className="text-xs text-[#4A4E51] flex items-center gap-1 mb-3 truncate">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">{venue.address || venue.category}</span>
                    </p>
                    <Link href={`/booking?id=${venue.id}`} className="w-full block">
                      <button className="w-full bg-[#121415] hover:bg-[#8A2532] text-white text-sm font-semibold py-2 rounded-xl transition-colors duration-300 flex items-center justify-center gap-1">
                        К бронированию
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <style jsx global>{`
        .custom-venue-icon {
          background: transparent;
          border: none;
        }
        .custom-user-icon {
          background: transparent;
          border: none;
        }
        .leaflet-container {
          font-family: inherit;
        }
        
        /* Overrides for Leaflet default popup to make it blend with our design */
        .custom-popup .leaflet-popup-content-wrapper {
          padding: 0;
          border-radius: 1rem;
          background: transparent;
          box-shadow: none;
        }
        .custom-popup .leaflet-popup-content {
          margin: 0;
          width: 240px !important;
        }
        .custom-popup .leaflet-popup-tip-container {
          display: none;
        }
      `}</style>
    </div>
  );
}
