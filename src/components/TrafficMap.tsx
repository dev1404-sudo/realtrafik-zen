import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Mock vehicle data
const mockVehicles = [
  { id: 'KA-05-1234', lat: 12.9716, lng: 77.5946, speed: 45, status: 'normal', type: 'bus' },
  { id: 'KA-05-5678', lat: 12.9656, lng: 77.6000, speed: 68, status: 'speeding', type: 'truck' },
  { id: 'KA-05-9012', lat: 12.9736, lng: 77.5906, speed: 35, status: 'normal', type: 'car' },
  { id: 'KA-05-3456', lat: 12.9676, lng: 77.5946, speed: 0, status: 'stopped', type: 'bus' },
  { id: 'KA-05-7890', lat: 12.9796, lng: 77.5896, speed: 55, status: 'normal', type: 'truck' },
];

const TrafficMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [accessToken, setAccessToken] = useState('');
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [vehicles, setVehicles] = useState(mockVehicles);

  const initializeMap = () => {
    if (!mapContainer.current || !accessToken) return;

    mapboxgl.accessToken = accessToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [77.5946, 12.9716], // Bangalore coordinates
      zoom: 12,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      setIsMapInitialized(true);
      addVehicleMarkers();
    });
  };

  const addVehicleMarkers = () => {
    if (!map.current) return;

    vehicles.forEach((vehicle) => {
      const el = document.createElement('div');
      el.className = 'vehicle-marker';
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
      
      // Color based on status
      if (vehicle.status === 'speeding') {
        el.style.backgroundColor = 'hsl(var(--traffic-red))';
      } else if (vehicle.status === 'stopped') {
        el.style.backgroundColor = 'hsl(var(--traffic-yellow))';
      } else {
        el.style.backgroundColor = 'hsl(var(--traffic-green))';
      }

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="text-sm">
          <h3 class="font-bold">${vehicle.id}</h3>
          <p>Type: ${vehicle.type}</p>
          <p>Speed: ${vehicle.speed} km/h</p>
          <p>Status: ${vehicle.status}</p>
        </div>
      `);

      new mapboxgl.Marker(el)
        .setLngLat([vehicle.lng, vehicle.lat])
        .setPopup(popup)
        .addTo(map.current!);
    });
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles(prev => prev.map(vehicle => ({
        ...vehicle,
        lat: vehicle.lat + (Math.random() - 0.5) * 0.001,
        lng: vehicle.lng + (Math.random() - 0.5) * 0.001,
        speed: Math.max(0, vehicle.speed + (Math.random() - 0.5) * 10),
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (!isMapInitialized && !accessToken) {
    return (
      <Card className="p-6 h-[600px] flex items-center justify-center bg-glass-bg border-glass-border backdrop-blur-sm">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold">Setup Mapbox Integration</h3>
          <p className="text-muted-foreground">Enter your Mapbox public token to view the traffic map</p>
          <p className="text-xs text-muted-foreground">Get your token from https://mapbox.com/</p>
          <div className="flex gap-2 max-w-md">
            <Input
              placeholder="pk.eyJ1..."
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              className="bg-secondary/50"
            />
            <Button onClick={initializeMap} className="shrink-0">
              Connect
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden bg-glass-bg border-glass-border backdrop-blur-sm">
      <div ref={mapContainer} className="h-[600px]" />
      
      {/* Map overlay with stats */}
      <div className="absolute top-4 left-4 space-y-2">
        <div className="bg-glass-bg backdrop-blur-md rounded-lg p-3 border border-glass-border">
          <h4 className="font-semibold text-sm mb-2">Live Vehicle Status</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-traffic-green"></div>
              <span>Normal: {vehicles.filter(v => v.status === 'normal').length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-traffic-yellow"></div>
              <span>Stopped: {vehicles.filter(v => v.status === 'stopped').length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-traffic-red"></div>
              <span>Speeding: {vehicles.filter(v => v.status === 'speeding').length}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TrafficMap;