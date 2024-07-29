import React, { useEffect, useState } from "react";

// Define props interface for StateCitySelector component
interface StateCitySelectorProps {
  onSelect: (state: string, city: string) => void; // Function to handle state and city selection
}

// StateCitySelector functional component
const StateCitySelector: React.FC<StateCitySelectorProps> = ({ onSelect }) => {
  // State variables for managing city data and selections
  const [cityData, setCityData] = useState<any>(null); // State to hold city data fetched from JSON
  const [selectedState, setSelectedState] = useState<string>("Delhi"); // Default state to Delhi
  const [selectedCity, setSelectedCity] = useState<string>("New Delhi"); // Default city to New Delhi

  // useEffect hook to fetch city data when component mounts
  useEffect(() => {
    const fetchCityData = async () => {
      try {
        const response = await fetch("http://iabeta.in/abhishek/api/re.json"); // Fetch JSON data (adjust path as needed)
        const data = await response.json(); // Parse JSON response
        setCityData(data.cityStateMap); // Update cityData state with fetched data

        // Set default selections if data is available
        if (
          data.cityStateMap[selectedState] &&
          data.cityStateMap[selectedState][selectedCity]
        ) {
          onSelect(selectedState, selectedCity); // Notify parent component of the default selection
        }
      } catch (error) {
        console.error("Error fetching city data:", error); // Log any errors during fetch
      }
    };

    fetchCityData(); // Call fetchCityData function when component mounts
  }, []); // Empty dependency array ensures useEffect runs only once on mount

  // Event handler for state selection change
  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const state = e.target.value; // Get selected state from event target value
    setSelectedState(state); // Update selectedState with selected state
    setSelectedCity(""); // Reset selectedCity when state changes
    onSelect(state, ""); // Notify parent component of the change
  };

  // Event handler for city selection change
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const city = e.target.value; // Get selected city from event target value
    setSelectedCity(city); // Update selectedCity with selected city
    onSelect(selectedState, city); // Call onSelect prop with selected state and city
  };

  // Render loading message if cityData is null (initial state)
  if (!cityData) return <p>Loading...</p>;

  // JSX structure for StateCitySelector component
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 w-full justify-evenly">
        {/* Select element for choosing state */}
        <select
          className="w-full outline-1 border-2 border-slate-200 p-3 mb-3 rounded-lg "
          onChange={handleStateChange} // Handle state change event
          value={selectedState} // Bind selected state to value attribute
        >
          <option value="">Select State</option> {/* Default option */}
          {/* Map through cityData to render options for each state */}
          {Object.keys(cityData).map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>

        {/* Select element for choosing city */}
        <select
          className="w-full outline-1 border-2 border-slate-200 p-3 mb-3 rounded-lg "
          onChange={handleCityChange} // Handle city change event
          value={selectedCity} // Bind selected city to value attribute
          disabled={!selectedState} // Disable if no state is selected
        >
          <option value="">Select City</option> {/* Default option */}
          {/* Render options for selected state's cities */}
          {selectedState &&
            cityData[selectedState] &&
            Object.keys(cityData[selectedState]).map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
        </select>
      </div>
    </>
  );
};

export default StateCitySelector; // Export StateCitySelector component
