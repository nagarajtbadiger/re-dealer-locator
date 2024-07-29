"use client";
import { SetStateAction, useEffect, useState } from "react";

import StateCitySelector from "@/components/StateCitySelector";
import Dealers from "@/components/Dealers";
import GoogleMaps from "@/components/GoogleMaps";

const Home = () => {
  const [selectedState, setSelectedState] = useState("Delhi");
  const [selectedCity, setSelectedCity] = useState("New Delhi");
  const [markers, setMarkers] = useState("");

  const handleCitySelection = (
    state: SetStateAction<string>,
    city: SetStateAction<string>
  ) => {
    setSelectedState(state);
    setSelectedCity(city);
  };

  useEffect(() => {
    if (selectedCity) {
      // Fetch data from the JSON file
      fetch("http://iabeta.in/abhishek/api/re.json")
        .then((response) => response.json())
        .then((data) => {
          // Filter data based on selected city
          const cityMarkers = data.filter(
            (dealer: any) => dealer.city === selectedCity
          );
          setMarkers(cityMarkers);
        })
        .catch((error) => {
          console.error("Error fetching dealer data:", error);
        });
    }
  }, [selectedCity, selectedState]);

  const googleMapsApiKey = process.env
    .NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

  // Example marker data
  // const markers = [
  //   { id: 1, lat: 12.9716, lng: 77.5946, title: "Bangalore" },
  //   { id: 2, lat: 34.052235, lng: -118.243683, title: "Los Angeles" },
  //   { id: 3, lat: 41.878113, lng: -87.629799, title: "Chicago" },
  // ];

  return (
    <div className="container mx-auto px-4 text-center">
      <h1 className="font-bold text-[30px] mt-5 mb-5">Dealer Locator</h1>
      <div className="flex flex-col lg:flex-row lg:gap-6 justify-start items-start">
        <div className="w-full flex flex-col sm:gap-4 lg:inline-flex  lg:w-1/2">
          <StateCitySelector onSelect={handleCitySelection} />
          <Dealers
            selectedState={selectedState}
            selectedCity={selectedCity}
            name={""}
            address={""}
            state={""}
            city={""}
            phoneNumber={""}
            averageRating={0}
            storePageUrl={""}
            gmbMapUrl={""}
          />
        </div>
        <div className="w-full lg:w-1/2 border-2 p-1 flex rounded-lg lg:sticky lg:top-10">
          <GoogleMaps
            apiKey={googleMapsApiKey}
            selectedCity={selectedCity}
            selectedState={selectedState}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
