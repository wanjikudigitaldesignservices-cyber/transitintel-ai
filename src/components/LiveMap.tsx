'use client';

import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useSocket } from '@/lib/socket-provider';

// Custom Map Controller to center map dynamically when PC GPS updates
function MapRecenter({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 15, { animate: true, duration: 1.5 });
    }
  }, [center, map]);
  return null;
}

// Fix for default Leaflet icon issues in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface VehicleLocation {
  id: string;
  plate: string;
  lat: number;
  lng: number;
  speed?: number;
  status?: string;
  route?: string;
  lastUpdated?: string;
  isMyPc?: boolean;
}

const initialFleet: Record<string, VehicleLocation> = {
  v1: {
    id: "v1",
    plate: "KBX 234R",
    lat: -1.2921,
    lng: 36.8219,
    speed: 45,
    status: "moving",
    route: "R001 CBD → Eastleigh",
    lastUpdated: "Just now",
  },
  v2: {
    id: "v2",
    plate: "KCA 891J",
    lat: -1.2800,
    lng: 36.8100,
    speed: 32,
    status: "moving",
    route: "R002 CBD → Rongai",
    lastUpdated: "Just now",
  },
  v3: {
    id: "v3",
    plate: "KDA 102K",
    lat: -1.3000,
    lng: 36.8300,
    speed: 0,
    status: "stopped",
    route: "R003 CBD → Kikuyu",
    lastUpdated: "1 min ago",
  },
};

export default function LiveMap() {
  const { socket, isConnected } = useSocket();
  const [vehicles, setVehicles] = useState<Record<string, VehicleLocation>>(initialFleet);

  // PC Geolocation State
  const [pcGpsActive, setPcGpsActive] = useState(false);
  const [pcCoords, setPcCoords] = useState<{ lat: number; lng: number; accuracy?: number } | null>(null);
  const [flyToCenter, setFlyToCenter] = useState<[number, number] | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);

  // 1. Listen for WebSocket real-time GPS streams
  useEffect(() => {
    if (!socket) return;

    socket.on('gps_update', (data: VehicleLocation) => {
      setVehicles((prev) => ({
        ...prev,
        [data.id]: {
          ...prev[data.id],
          ...data,
          lastUpdated: new Date().toLocaleTimeString(),
        },
      }));
    });

    return () => {
      socket.off('gps_update');
    };
  }, [socket]);

  // 2. Start / Stop PC Real-Time GPS Tracking via Browser HTML5 Geolocation API
  const togglePcGps = () => {
    if (pcGpsActive) {
      // Stop tracking
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setPcGpsActive(false);
      setGpsError(null);
    } else {
      // Start tracking
      if (!navigator.geolocation) {
        setGpsError("Geolocation is not supported by your browser.");
        return;
      }

      setGpsError("Requesting PC GPS permission...");

      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const speed = Math.round((position.coords.speed || 0) * 3.6); // m/s to km/h
          const accuracy = Math.round(position.coords.accuracy);

          setPcCoords({ lat, lng, accuracy });
          setFlyToCenter([lat, lng]);
          setPcGpsActive(true);
          setGpsError(null);

          const myPcVehicle: VehicleLocation = {
            id: "my-pc-gps",
            plate: "💻 MY PC GPS (KBX 234R)",
            lat,
            lng,
            speed,
            status: speed > 2 ? "moving" : "stopped",
            route: "Live Demo Stream",
            lastUpdated: new Date().toLocaleTimeString(),
            isMyPc: true,
          };

          // Update local map state
          setVehicles((prev) => ({
            ...prev,
            "my-pc-gps": myPcVehicle,
          }));

          // Emit to Socket.io server to stream live to fleet network
          if (socket && isConnected) {
            socket.emit("gps_update", myPcVehicle);
          }
        },
        (err) => {
          console.error("PC GPS Error:", err);
          setGpsError(`GPS Error: ${err.message}. Please allow location access in your browser.`);
          setPcGpsActive(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }
  };

  return (
    <div className="relative h-[600px] w-full rounded-xl overflow-hidden border border-surface-200 dark:border-surface-800">
      {/* Live Connection & PC GPS Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="bg-white/90 dark:bg-surface-900/90 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-surface-200 dark:border-white/10 flex items-center gap-3 pointer-events-auto">
          <div className={`w-3 h-3 rounded-full ${pcGpsActive ? 'bg-emerald-500 animate-ping' : isConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          <div>
            <p className="text-xs font-bold text-surface-900 dark:text-white">
              {pcGpsActive ? '💻 LIVE PC GPS DEMO ACTIVE' : isConnected ? 'Real-Time WebSocket Stream ACTIVE' : 'Simulated GPS Stream Active'}
            </p>
            <p className="text-[10px] text-surface-500 dark:text-white/50">
              {pcGpsActive && pcCoords
                ? `Position: ${pcCoords.lat.toFixed(5)}, ${pcCoords.lng.toFixed(5)} (±${pcCoords.accuracy}m)`
                : `${Object.keys(vehicles).length} Active Vehicles Tracking Live`}
            </p>
          </div>
        </div>

        <div className="flex gap-2 pointer-events-auto">
          {pcGpsActive && pcCoords && (
            <button
              onClick={() => setFlyToCenter([pcCoords.lat, pcCoords.lng])}
              className="rounded-xl bg-surface-900/90 dark:bg-white/10 hover:bg-black text-white text-xs font-bold px-3 py-2.5 backdrop-blur-md border border-white/20 shadow-xl cursor-pointer"
            >
              🎯 Re-center On My Location
            </button>
          )}

          <button
            onClick={togglePcGps}
            className={`rounded-xl px-4 py-2.5 text-xs font-bold transition-all shadow-xl cursor-pointer flex items-center gap-2 ${
              pcGpsActive
                ? "bg-emerald-600 hover:bg-emerald-500 text-white animate-pulse"
                : "bg-brand-600 hover:bg-brand-500 text-white"
            }`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            {pcGpsActive ? "Stop PC GPS Stream" : "💻 Stream My PC Real-Time GPS"}
          </button>
        </div>
      </div>

      {/* GPS Error Alert */}
      {gpsError && (
        <div className="absolute top-20 left-4 z-[1000] bg-red-950/90 text-red-200 border border-red-500/40 text-xs px-4 py-2 rounded-xl backdrop-blur-md shadow-xl">
          {gpsError}
        </div>
      )}

      <MapContainer 
        center={[-1.2921, 36.8219]} 
        zoom={13} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }}
      >
        <MapRecenter center={flyToCenter} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {Object.values(vehicles).map((v) => (
          <Marker key={v.id} position={[v.lat, v.lng]}>
            <Popup>
              <div className="p-1 space-y-1">
                <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold ${v.isMyPc ? 'bg-emerald-500 text-white' : 'bg-brand-500/10 text-brand-500'}`}>
                  {v.plate}
                </span>
                <p className="text-xs font-semibold text-gray-900">{v.route || "Transit Route"}</p>
                <div className="text-[11px] text-gray-600">
                  <p>⚡ Speed: <strong>{v.speed || 0} km/h</strong></p>
                  <p>📍 Lat: {v.lat.toFixed(5)}, Lng: {v.lng.toFixed(5)}</p>
                  <p>⏱️ Updated: {v.lastUpdated || "Live"}</p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
