import React, { useEffect, useState } from "react";

import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "88vh",
};

interface MarkerData {
  address: string;
  id: string;
  lat: number;
  lng: number;
  title: string;
}

interface GoogleMapsProps {
  apiKey: string;
  selectedCity: string;
  selectedState: string;
}

const GoogleMaps: React.FC<GoogleMapsProps> = ({
  apiKey,
  selectedCity,
  selectedState,
}) => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [mapCenter, setMapCenter] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/dealers.json"); // Adjust path if needed
        const data = await response.json();

        // Check if cityStateMap exists and has the selectedState and selectedCity
        const cityData =
          data.cityStateMap?.[selectedState]?.[selectedCity] || [];

        if (Array.isArray(cityData)) {
          const markerData = cityData.map((dealer: any) => ({
            id: dealer.dealerId,
            address: dealer.address,
            lat: parseFloat(dealer.latitude),
            lng: parseFloat(dealer.longitude),
            title: dealer.name,
          }));

          setMarkers(markerData);

          if (markerData.length > 0) {
            const latitudes = markerData
              .map((marker) => marker.lat)
              .filter((lat) => !isNaN(lat));
            const longitudes = markerData
              .map((marker) => marker.lng)
              .filter((lng) => !isNaN(lng));

            if (latitudes.length > 0 && longitudes.length > 0) {
              const centerLat =
                latitudes.reduce((a, b) => a + b, 0) / latitudes.length;
              const centerLng =
                longitudes.reduce((a, b) => a + b, 0) / longitudes.length;

              setMapCenter({ lat: centerLat, lng: centerLng });
            } else {
              setMapCenter({ lat: 21.0, lng: 78.0 }); // Default center if no valid markers
            }
          } else {
            setMapCenter({ lat: 21.0, lng: 78.0 }); // Default center if no markers
          }
        } else {
          console.error("Expected city data to be an array");
          setMapCenter({ lat: 21.0, lng: 78.0 }); // Default center if cityData is not an array
        }
      } catch (error) {
        console.error("Error fetching dealer data:", error);
      }
    };

    fetchData();
  }, [selectedCity, selectedState]);

  if (!apiKey) {
    console.error("API Key is missing!");
    return <div>Error: Google Maps API key is missing.</div>;
  }

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter || { lat: 21.0, lng: 78.0 }} // Default center if mapCenter is null
        zoom={mapCenter ? 12 : 5} // Adjust zoom level based on whether markers are present
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={{ lat: marker.lat, lng: marker.lng }}
            title={marker.title}
            onClick={() => setSelectedMarker(marker)}
          />
        ))}
        {selectedMarker && (
          <InfoWindow
            position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="custom-info-window lg:max-w-[250px]">
              <h2 className="text-[16px] font-bold mb-1">
                {selectedMarker.title}
              </h2>
              <p>{selectedMarker.address}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMaps;
