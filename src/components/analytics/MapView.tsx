import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const cityData = {
  Borivali: {
    center: { lat: 19.2335, lng: 72.8474 },
    heatmapData: [
      { lat: 19.2335, lng: 72.8474, weight: 0.9 }, // Station Area
      { lat: 19.2310, lng: 72.8460, weight: 0.7 }, // Market Complex
      { lat: 19.2360, lng: 72.8490, weight: 0.5 }, // Residential Area
      { lat: 19.2320, lng: 72.8440, weight: 0.8 }, // Shopping District
      { lat: 19.2380, lng: 72.8450, weight: 0.6 }  // Business Hub
    ]
  },
  Thane: {
    center: { lat: 19.2183, lng: 72.9780 },
    heatmapData: [
      { lat: 19.2183, lng: 72.9780, weight: 0.8 }, // Lake City Mall
      { lat: 19.2150, lng: 72.9760, weight: 0.9 }, // Station Complex
      { lat: 19.2200, lng: 72.9800, weight: 0.7 }, // Business District
      { lat: 19.2170, lng: 72.9740, weight: 0.6 }, // Market Area
      { lat: 19.2220, lng: 72.9770, weight: 0.5 }  // Residential Zone
    ]
  },
  Kalyan: {
    center: { lat: 19.2403, lng: 73.1305 },
    heatmapData: [
      { lat: 19.2403, lng: 73.1305, weight: 0.8 }, // Kalyan Station
      { lat: 19.2350, lng: 73.1290, weight: 0.6 }, // Market Area
      { lat: 19.2420, lng: 73.1320, weight: 0.7 }, // Shopping District
      { lat: 19.2380, lng: 73.1340, weight: 0.5 }, // Residential Area
      { lat: 19.2410, lng: 73.1280, weight: 0.4 }  // Business District
    ]
  }
};

export function MapView() {
  const mapRefs = {
    Borivali: useRef<HTMLDivElement>(null),
    Thane: useRef<HTMLDivElement>(null),
    Kalyan: useRef<HTMLDivElement>(null)
  };
  const [mapsLoaded, setMapsLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDPV8Y1PIXOmYfzu38u1fyyWE3UPBETf8U&libraries=visualization&callback=initMap`;
    script.async = true;
    script.defer = true;

    window.initMap = () => {
      Object.entries(cityData).forEach(([city, data]) => {
        const mapRef = mapRefs[city as keyof typeof mapRefs];
        if (!mapRef.current) return;

        const map = new window.google.maps.Map(mapRef.current, {
          zoom: 14,
          center: data.center,
          mapTypeId: 'roadmap'
        });

        // Add Traffic Layer
        const trafficLayer = new window.google.maps.TrafficLayer();
        trafficLayer.setMap(map);

        // Add Heatmap
        const heatmapData = data.heatmapData.map(point => ({
          location: new window.google.maps.LatLng(point.lat, point.lng),
          weight: point.weight
        }));

        const heatmap = new window.google.maps.visualization.HeatmapLayer({
          data: heatmapData.map(point => point.location),
          radius: 30,
          opacity: 0.7
        });
        heatmap.setMap(map);
      });

      setMapsLoaded(true);
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      window.initMap = () => {};
    };
  }, []);

  return (
    <div className="space-y-6">
      {Object.keys(cityData).map(city => (
        <Card key={city} className="p-6">
          <h2 className="text-xl font-semibold mb-4">Real-Time Traffic & Crowd Analytics for {city}</h2>
          <div
            ref={mapRefs[city as keyof typeof mapRefs]}
            className="h-[400px] w-full rounded-lg overflow-hidden"
          />
        </Card>
      ))}

      {!mapsLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <div className="text-lg">Loading maps...</div>
        </div>
      )}
    </div>
  );
}