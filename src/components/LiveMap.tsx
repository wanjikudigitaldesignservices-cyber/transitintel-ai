'use client';

import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useSocket } from '@/lib/socket-provider';

// Custom Map Controller to center map dynamically when PC GPS updates or vehicle selected
function MapRecenter({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 14, { animate: true, duration: 1.5 });
    }
  }, [center, map]);
  return null;
}

// Custom Bus & Marker SVG Icons for Leaflet
const busIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448339.png',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -18],
});

const pcGpsIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [42, 42],
  iconAnchor: [21, 21],
  popupAnchor: [0, -21],
});

interface VehicleLocation {
  id: string;
  plate: string;
  lat: number;
  lng: number;
  speed: number;
  status: "moving" | "stopped" | "idle";
  route: string;
  direction: number; // delta direction for movement loop
  lastUpdated?: string;
  isMyPc?: boolean;
}

// Initial vehicle coordinates along Nairobi routes
const initialFleet: Record<string, VehicleLocation> = {
  v1: {
    id: "v1",
    plate: "KBX 234R (Isuzu 51-Seat)",
    lat: -1.28638,
    lng: 36.82485,
    speed: 48,
    status: "moving",
    route: "R001 CBD → Eastleigh Terminal",
    direction: 1,
    lastUpdated: "Just now",
  },
  v2: {
    id: "v2",
    plate: "KCA 891J (Coaster 33-Seat)",
    lat: -1.3000,
    lng: 36.8150,
    speed: 35,
    status: "moving",
    route: "R002 CBD → Rongai Total",
    direction: -1,
    lastUpdated: "Just now",
  },
  v3: {
    id: "v3",
    plate: "KBZ 456T (Scania Coach)",
    lat: -1.2650,
    lng: 36.8450,
    speed: 62,
    status: "moving",
    route: "R003 CBD → Thika Superhighway",
    direction: 1,
    lastUpdated: "Just now",
  },
  v4: {
    id: "v4",
    plate: "KDA 102K (Matatu 14-Seat)",
    lat: -1.2910,
    lng: 36.8080,
    speed: 0,
    status: "stopped",
    route: "R004 CBD → Westlands Stage",
    direction: 0,
    lastUpdated: "2 mins ago",
  },
};

// Route polyline coordinates for map visualization
const routePolylines = {
  r1: [
    [-1.28638, 36.82485],
    [-1.28300, 36.83500],
    [-1.27800, 36.84800],
    [-1.27400, 36.85500],
  ] as [number, number][],
  r2: [
    [-1.28638, 36.82485],
    [-1.30000, 36.81500],
    [-1.32500, 36.79500],
    [-1.35000, 36.76000],
  ] as [number, number][],
  r3: [
    [-1.28638, 36.82485],
    [-1.26500, 36.84500],
    [-1.23500, 36.87500],
    [-1.19000, 36.92500],
  ] as [number, number][],
};

export default function LiveMap() {
  const { socket, isConnected } = useSocket();
  const [vehicles, setVehicles] = useState<Record<string, VehicleLocation>>(initialFleet);
  const [isSimulating, setIsSimulating] = useState(true);

  // PC Geolocation State
  const [pcGpsActive, setPcGpsActive] = useState(false);
  const [pcCoords, setPcCoords] = useState<{ lat: number; lng: number; accuracy?: number } | null>(null);
  const [flyToCenter, setFlyToCenter] = useState<[number, number] | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);

  // 1. Client-Side Real-Time Continuous Movement Engine (Updates every 1.5 seconds)
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setVehicles((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((key) => {
          const v = next[key];
          if (v.isMyPc || v.status === "stopped") return;

          // Simulate realistic GPS coordinate movement & speed changes
          const deltaLat = (Math.random() * 0.0012 - 0.0004) * (v.direction || 1);
          const deltaLng = (Math.random() * 0.0015 - 0.0003) * (v.direction || 1);

          let newLat = v.lat + deltaLat;
          let newLng = v.lng + deltaLng;

          // Boundary bounce to keep vehicles on Nairobi map
          if (newLat > -1.200 || newLat < -1.370) v.direction *= -1;
          if (newLng > 36.950 || newLng < 36.720) v.direction *= -1;

          // Randomize speed fluctuation (30 to 75 km/h)
          const newSpeed = Math.min(85, Math.max(25, Math.round(v.speed + (Math.random() * 8 - 4))));

          next[key] = {
            ...v,
            lat: newLat,
            lng: newLng,
            speed: newSpeed,
            lastUpdated: new Date().toLocaleTimeString(),
          };
        });
        return next;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isSimulating]);

  // 2. WebSocket Listener for Server Broadcasts
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

  // 3. Toggle PC Geolocation Tracker
  const togglePcGps = () => {
    if (pcGpsActive) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setPcGpsActive(false);
      setGpsError(null);
    } else {
      if (!navigator.geolocation) {
        setGpsError("Geolocation is not supported by your browser.");
        return;
      }

      setGpsError("Requesting PC GPS permission...");

      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const speed = Math.round((position.coords.speed || 0) * 3.6);
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
            route: "Live PC GPS Location",
            direction: 0,
            lastUpdated: new Date().toLocaleTimeString(),
            isMyPc: true,
          };

          setVehicles((prev) => ({
            ...prev,
            "my-pc-gps": myPcVehicle,
          }));

          if (socket && isConnected) {
            socket.emit("gps_update", myPcVehicle);
          }
        },
        (err) => {
          setGpsError(`GPS Error: ${err.message}. Please allow location access in your browser.`);
          setPcGpsActive(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  };

  return (
    <div className="relative h-[650px] w-full rounded-2xl overflow-hidden border border-surface-200 dark:border-surface-800 shadow-2xl">
      {/* Live Map Header Controls */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="bg-surface-900/90 text-white backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-white/10 flex items-center gap-3 pointer-events-auto">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
          </div>
          <div>
            <p className="text-xs font-bold tracking-wide">
              {pcGpsActive ? "💻 LIVE PC GPS STREAMING ACTIVE" : "⚡ REAL-TIME FLEET TELEMETRY ACTIVE"}
            </p>
            <p className="text-[10px] text-emerald-400 font-mono">
              {Object.keys(vehicles).length} Vehicles Live Moving · Refresh Rate: 1.5s
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pointer-events-auto">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all shadow-xl cursor-pointer ${
              isSimulating ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-300"
            }`}
          >
            {isSimulating ? "⏸️ Pause Movement" : "▶️ Resume Live Movement"}
          </button>

          {pcGpsActive && pcCoords && (
            <button
              onClick={() => setFlyToCenter([pcCoords.lat, pcCoords.lng])}
              className="rounded-xl bg-surface-900/90 text-white text-xs font-bold px-3.5 py-2 backdrop-blur-md border border-white/20 shadow-xl cursor-pointer"
            >
              🎯 Center My PC Location
            </button>
          )}

          <button
            onClick={togglePcGps}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-xl cursor-pointer flex items-center gap-2 ${
              pcGpsActive
                ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black animate-pulse"
                : "bg-brand-600 hover:bg-brand-500 text-white"
            }`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            {pcGpsActive ? "Stop PC GPS" : "💻 Stream My PC GPS"}
          </button>
        </div>
      </div>

      {/* GPS Error Alert */}
      {gpsError && (
        <div className="absolute top-20 left-4 z-[1000] bg-red-950/90 text-red-200 border border-red-500/40 text-xs px-4 py-2 rounded-xl backdrop-blur-md shadow-xl">
          {gpsError}
        </div>
      )}

      {/* Live Map Viewport */}
      <MapContainer 
        center={[-1.28638, 36.82485]} 
        zoom={13} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }}
      >
        <MapRecenter center={flyToCenter} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Route Polylines */}
        <Polyline positions={routePolylines.r1} color="#3b82f6" weight={4} opacity={0.7} />
        <Polyline positions={routePolylines.r2} color="#10b981" weight={4} opacity={0.7} />
        <Polyline positions={routePolylines.r3} color="#f59e0b" weight={4} opacity={0.7} />

        {/* Vehicle Markers */}
        {Object.values(vehicles).map((v) => (
          <Marker
            key={v.id}
            position={[v.lat, v.lng]}
            icon={v.isMyPc ? pcGpsIcon : busIcon}
            eventHandlers={{
              click: () => setFlyToCenter([v.lat, v.lng]),
            }}
          >
            <Popup>
              <div className="p-1 space-y-1.5 min-w-[200px]">
                <div className="flex items-center justify-between">
                  <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-black ${v.isMyPc ? 'bg-emerald-500 text-white' : 'bg-brand-600 text-white'}`}>
                    {v.plate}
                  </span>
                  <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600">
                    {v.status.toUpperCase()}
                  </span>
                </div>

                <p className="text-xs font-bold text-gray-900 leading-tight">{v.route}</p>

                <div className="grid grid-cols-2 gap-1 text-[11px] bg-gray-50 p-2 rounded-lg border border-gray-200">
                  <div>
                    <span className="text-gray-400 block text-[9px]">Speed</span>
                    <strong className="text-brand-600 font-black">{v.speed} km/h</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[9px]">Last Ping</span>
                    <strong className="text-gray-700">{v.lastUpdated || "Live"}</strong>
                  </div>
                </div>

                <p className="text-[10px] font-mono text-gray-500">
                  Lat: {v.lat.toFixed(5)}, Lng: {v.lng.toFixed(5)}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
