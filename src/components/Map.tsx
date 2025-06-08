
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Person {
  id: string;
  name: string;
  age: number;
  status: 'safe' | 'warning' | 'emergency';
  location: string;
  coordinates: [number, number]; // [longitude, latitude]
  lastContact: string;
  riskLevel: 'low' | 'medium' | 'high';
}

interface MapProps {
  people: Person[];
  selectedPersonId?: string;
  onPersonSelect?: (personId: string) => void;
}

const Map: React.FC<MapProps> = ({ people, selectedPersonId, onPersonSelect }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const [mapboxToken, setMapboxToken] = useState('');
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-74.5, 40], // Default center
      zoom: 10,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      setIsMapReady(true);
    });

    return () => {
      Object.values(markers.current).forEach(marker => marker.remove());
      map.current?.remove();
    };
  }, [mapboxToken]);

  useEffect(() => {
    if (!map.current || !isMapReady) return;

    // Clear existing markers
    Object.values(markers.current).forEach(marker => marker.remove());
    markers.current = {};

    // Add markers for each person
    people.forEach(person => {
      const statusColor = {
        safe: '#22c55e',
        warning: '#f59e0b',
        emergency: '#ef4444'
      }[person.status];

      // Create custom marker element
      const markerElement = document.createElement('div');
      markerElement.style.cssText = `
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: ${statusColor};
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
      `;
      markerElement.textContent = person.name.charAt(0);

      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat(person.coordinates)
        .addTo(map.current!);

      // Add popup with person info
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div style="padding: 8px;">
            <h3 style="margin: 0 0 4px 0; font-weight: bold;">${person.name}</h3>
            <p style="margin: 0; font-size: 12px; color: #666;">Age: ${person.age}</p>
            <p style="margin: 0; font-size: 12px; color: #666;">Status: ${person.status}</p>
            <p style="margin: 0; font-size: 12px; color: #666;">Last contact: ${person.lastContact}</p>
          </div>
        `);

      marker.setPopup(popup);

      // Handle marker click
      markerElement.addEventListener('click', () => {
        onPersonSelect?.(person.id);
      });

      markers.current[person.id] = marker;
    });

    // Fit map to show all markers if there are people
    if (people.length > 0) {
      const coordinates = people.map(p => p.coordinates);
      const bounds = coordinates.reduce((bounds, coord) => {
        return bounds.extend(coord);
      }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

      map.current.fitBounds(bounds, { padding: 50 });
    }
  }, [people, isMapReady, onPersonSelect]);

  // Center map on selected person and highlight marker
  useEffect(() => {
    if (!map.current || !selectedPersonId) return;

    const selectedPerson = people.find(p => p.id === selectedPersonId);
    if (!selectedPerson) return;

    // Center map on selected person with smooth animation
    map.current.easeTo({
      center: selectedPerson.coordinates,
      zoom: 15,
      duration: 1000
    });

    // Update marker styles
    Object.entries(markers.current).forEach(([personId, marker]) => {
      const markerElement = marker.getElement();
      if (personId === selectedPersonId) {
        markerElement.style.transform = 'scale(1.3)';
        markerElement.style.zIndex = '1000';
        markerElement.style.border = '4px solid #2563eb';
        // Show popup for selected person
        marker.getPopup().addTo(map.current!);
      } else {
        markerElement.style.transform = 'scale(1)';
        markerElement.style.zIndex = '1';
        markerElement.style.border = '3px solid white';
        // Hide popup for other people
        marker.getPopup().remove();
      }
    });
  }, [selectedPersonId, people]);

  if (!mapboxToken) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Configure Map</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Please enter your Mapbox public token to view real-time locations on the map.
          </p>
          <p className="text-xs text-muted-foreground">
            Get your token at: <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">mapbox.com</a>
          </p>
          <div className="flex space-x-2">
            <Input
              placeholder="Enter Mapbox public token..."
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              type="password"
            />
            <Button onClick={() => setMapboxToken(mapboxToken)}>
              Connect
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative w-full h-96 rounded-lg overflow-hidden border">
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 space-y-1">
        <div className="flex items-center space-x-2 text-xs">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>Safe</span>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span>Warning</span>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>Emergency</span>
        </div>
      </div>
    </div>
  );
};

export default Map;
