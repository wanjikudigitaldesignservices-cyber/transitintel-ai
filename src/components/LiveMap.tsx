'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useSocket } from '@/lib/socket-provider';

// Fix for default Leaflet icon issues in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface VehicleLocation {
  id: string;
  lat: number;
  lng: number;
  plate: string;
}

export default function LiveMap() {
  const { socket, isConnected } = useSocket();
  const [vehicles, setVehicles] = useState<Record<string, VehicleLocation>>({});

  useEffect(() => {
    if (!socket) return;

    socket.on('gps_update', (data: VehicleLocation) => {
      setVehicles((prev) => ({
        ...prev,
        [data.id]: data,
      }));
    });

    return () => {
      socket.off('gps_update');
    };
  }, [socket]);

  return (
    <div className="relative h-[600px] w-full rounded-xl overflow-hidden border border-surface-200 dark:border-surface-800">
      <div className="absolute top-4 left-4 z-[1000] bg-white dark:bg-surface-900 px-4 py-2 rounded-lg shadow-md flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className="text-sm font-medium dark:text-white">
          {isConnected ? 'Live' : 'Disconnected'}
        </span>
      </div>
      <MapContainer 
        center={[-1.2921, 36.8219]} 
        zoom={13} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {Object.values(vehicles).map((v) => (
          <Marker key={v.id} position={[v.lat, v.lng]}>
            <Popup>
              <strong>{v.plate}</strong><br />
              Lat: {v.lat.toFixed(4)}<br />
              Lng: {v.lng.toFixed(4)}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
