import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const GoogleMap = ({
  center = { lat: 40.7128, lng: -74.0060 }, // Default to NYC
  zoom = 10,
  markers = [],
  onMarkerClick,
  onMapClick,
  className = "w-full h-96",
  mapId = "thriveunity-map",
  ...props
}) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Initialize the Google Maps loader
        const loader = new Loader({
          apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE',
          version: 'weekly',
          libraries: ['places', 'geometry'],
        });

        // Load the Google Maps API
        const { Map } = await loader.importLibrary('maps');
        const { Marker } = await loader.importLibrary('marker');

        // Create the map
        const mapInstance = new Map(mapRef.current, {
          center,
          zoom,
          mapId,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
          ...props,
        });

        setMap(mapInstance);

        // Add click listener to map
        if (onMapClick) {
          mapInstance.addListener('click', (event) => {
            onMapClick({
              lat: event.latLng.lat(),
              lng: event.latLng.lng(),
            });
          });
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Error loading Google Maps:', err);
        setError('Failed to load map. Please check your API key.');
        setIsLoading(false);
      }
    };

    if (mapRef.current) {
      initMap();
    }
  }, []);

  // Update map center and zoom when props change
  useEffect(() => {
    if (map) {
      map.setCenter(center);
      map.setZoom(zoom);
    }
  }, [map, center, zoom]);

  // Add/update markers
  useEffect(() => {
    if (map && markers.length > 0) {
      // Clear existing markers
      const existingMarkers = map.markers || [];
      existingMarkers.forEach(marker => marker.setMap(null));

      // Add new markers
      const newMarkers = markers.map((markerData) => {
        const marker = new google.maps.Marker({
          position: markerData.position,
          map,
          title: markerData.title,
          icon: markerData.icon,
          animation: markerData.animation,
        });

        // Add click listener to marker
        if (onMarkerClick) {
          marker.addListener('click', () => {
            onMarkerClick(markerData);
          });
        }

        return marker;
      });

      // Store markers reference on map for cleanup
      map.markers = newMarkers;
    }
  }, [map, markers, onMarkerClick]);

  if (error) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 rounded-lg`}>
        <div className="text-center">
          <div className="text-red-500 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className={`${className} flex items-center justify-center bg-gray-100 rounded-lg`}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
      <div
        ref={mapRef}
        className={`${className} ${isLoading ? 'hidden' : ''} rounded-lg`}
        style={{ minHeight: '300px' }}
      />
    </div>
  );
};

export default GoogleMap;
