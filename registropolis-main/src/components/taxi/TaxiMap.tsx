
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, LocateFixed } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

// Set a default public token for demo purposes
// In a real app, this would be handled via environment variables
// or fetched from a backend service
const MAPBOX_TOKEN = "pk.eyJ1IjoiZGVtb3VzZXIxMjMiLCJhIjoiY2xxd3poMmkzMXRqcjJrbzRid2NxOXlmNSJ9.0FEKQtZiLhQfWXVhx9LNSg";

interface TaxiMapProps {
  pickupLocation?: [number, number];
  destinationLocation?: [number, number];
  onPickupSelected?: (coords: [number, number], address: string) => void;
  onDestinationSelected?: (coords: [number, number], address: string) => void;
}

const TaxiMap: React.FC<TaxiMapProps> = ({ 
  pickupLocation, 
  destinationLocation,
  onPickupSelected,
  onDestinationSelected
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const pickupMarker = useRef<mapboxgl.Marker | null>(null);
  const destinationMarker = useRef<mapboxgl.Marker | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  const initializeMap = () => {
    if (!mapContainer.current || map.current) return;
    
    try {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-74.5, 40], // Default to NYC
        zoom: 10
      });

      map.current.on('load', () => {
        setMapLoaded(true);
        setMapError(null);
        
        if (map.current) {
          map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
          map.current.addControl(new mapboxgl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true
            },
            trackUserLocation: true
          }));
          
          // Automatically try to get user's location on map load
          getCurrentLocation();
          
          // Add click handlers to set pickup/destination
          map.current.on('click', (e) => {
            if (!onPickupSelected && !onDestinationSelected) return;
            
            const coords: [number, number] = [e.lngLat.lng, e.lngLat.lat];
            
            if (onPickupSelected && !pickupLocation) {
              reverseGeocode(coords).then(address => {
                onPickupSelected(coords, address);
              });
            } else if (onDestinationSelected && !destinationLocation) {
              reverseGeocode(coords).then(address => {
                onDestinationSelected(coords, address);
              });
            }
          });
        }
      });

      map.current.on('error', (e) => {
        console.error('Map error:', e);
        setMapError('Error loading map. Please try again later.');
      });
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Error initializing map. Please try again later.');
    }
  };

  // Initialize map
  useEffect(() => {
    initializeMap();
    
    return () => {
      map.current?.remove();
    };
  }, []);

  // Handle markers when locations change
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Update pickup marker
    if (pickupLocation) {
      if (!pickupMarker.current) {
        pickupMarker.current = new mapboxgl.Marker({ color: '#4CAF50' })
          .setLngLat(pickupLocation)
          .addTo(map.current);
      } else {
        pickupMarker.current.setLngLat(pickupLocation);
      }
    }

    // Update destination marker
    if (destinationLocation) {
      if (!destinationMarker.current) {
        destinationMarker.current = new mapboxgl.Marker({ color: '#F44336' })
          .setLngLat(destinationLocation)
          .addTo(map.current);
      } else {
        destinationMarker.current.setLngLat(destinationLocation);
      }
    }

    // If both locations exist, fit bounds to show both
    if (pickupLocation && destinationLocation) {
      const bounds = new mapboxgl.LngLatBounds()
        .extend(pickupLocation)
        .extend(destinationLocation);
      
      map.current.fitBounds(bounds, { padding: 100 });
      
      // Add a route line if we have both points
      drawRoute(pickupLocation, destinationLocation);
    } else if (pickupLocation) {
      map.current.flyTo({ center: pickupLocation, zoom: 14 });
    } else if (destinationLocation) {
      map.current.flyTo({ center: destinationLocation, zoom: 14 });
    }
  }, [pickupLocation, destinationLocation, mapLoaded]);

  // Draw route between two points
  const drawRoute = async (start: [number, number], end: [number, number]) => {
    if (!map.current) return;

    try {
      // Remove previous route layer if it exists
      if (map.current.getSource('route')) {
        map.current.removeLayer('route');
        map.current.removeSource('route');
      }

      // Fetch directions from Mapbox API
      const query = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
      const response = await fetch(query);
      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0].geometry;
        
        map.current.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: route
          }
        });
        
        map.current.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3887be',
            'line-width': 5,
            'line-opacity': 0.75
          }
        });
      }
    } catch (error) {
      console.error('Error drawing route:', error);
      toast.error("Couldn't draw route between locations");
    }
  };

  // Get user's current location
  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        setUserLocation([longitude, latitude]);
        
        if (map.current) {
          map.current.flyTo({ center: [longitude, latitude], zoom: 15 });
          
          if (onPickupSelected) {
            // Reverse geocode to get address
            reverseGeocode([longitude, latitude]).then(address => {
              onPickupSelected([longitude, latitude], address);
            });
          }
        }
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        toast.error("Couldn't get your location. Please check your browser permissions.");
        setIsLoadingLocation(false);
      }
    );
  };

  // Reverse geocode coordinates to address
  const reverseGeocode = async (coords: [number, number]): Promise<string> => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${coords[0]},${coords[1]}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();
      return data.features[0]?.place_name || 'Unknown location';
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return 'Unknown location';
    }
  };

  return (
    <div className="relative rounded-lg overflow-hidden">
      {mapError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{mapError}</AlertDescription>
        </Alert>
      )}
      
      <div ref={mapContainer} className="h-[400px] w-full" />
      
      <div className="absolute bottom-4 right-4 space-y-2">
        <Button 
          onClick={getCurrentLocation} 
          disabled={isLoadingLocation}
          variant="secondary"
          className="shadow-lg"
        >
          {isLoadingLocation ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Locating...
            </>
          ) : (
            <>
              <LocateFixed className="mr-2 h-4 w-4" />
              Use My Location
            </>
          )}
        </Button>
      </div>
      
      <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm p-2 rounded-md text-xs">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[#4CAF50]"></div>
          <span>Pickup</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[#F44336]"></div>
          <span>Destination</span>
        </div>
      </div>
    </div>
  );
};

export default TaxiMap;
