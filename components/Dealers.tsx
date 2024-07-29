import React, { useState, useEffect } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

// Define props interface for Dealer component
interface DealerProps {
  gmbMapUrl: string;
  name: string;
  address: string;
  state: string;
  city: string;
  phoneNumber: string;
  averageRating: number;
  storePageUrl: string;
  selectedState: string;
  selectedCity: string;
}

interface MarkerData {
  id: number;
  lat: number;
  lng: number;
  title: string;
}
const Dealers: React.FC<DealerProps> = ({ selectedState, selectedCity }) => {
  // State to store dealer data
  const [dealerData, setDealerData] = useState<DealerProps[]>([]);

  useEffect(() => {
    const fetchDealerData = async () => {
      try {
        const response = await fetch("http://iabeta.in/abhishek/api/re.json"); // Adjust path as needed
        const data = await response.json(); // Parse JSON response

        // Extract dealers from JSON structure
        const dealers: DealerProps[] = [];
        for (const state in data.cityStateMap) {
          for (const city in data.cityStateMap[state]) {
            const cityDealers = data.cityStateMap[state][city];
            dealers.push(...cityDealers);
          }
        }

        setDealerData(dealers); // Update state with fetched dealer data
      } catch (error) {
        console.error("Error fetching dealer data:", error); // Log any errors during fetch
      }
    };

    fetchDealerData(); // Call fetchDealerData function when component mounts
  }, []); // Empty dependency array ensures useEffect runs only once on mount

  // Filter dealers based on selectedState and selectedCity
  const filteredDealers = dealerData.filter(
    (dealer) => dealer.state === selectedState && dealer.city === selectedCity
  );
  return (
    <>
      <ul>
        {filteredDealers.map((dealer, index) => (
          <li
            key={index}
            className="text-start px-4 py-4 mb-5 rounded-lg border-2 border-slate-100 bg-slate-50"
          >
            <Link href={dealer.storePageUrl} target="_blank">
              <h2 className="pb-2 border-b-2 border-b-slate-200 mb-3">
                {dealer.name}
              </h2>
            </Link>
            <p>Rating: {dealer.averageRating} </p>
            <p>{dealer.address}</p>
            <p>
              {dealer.city}, {dealer.state}
            </p>
            <p className="mb-3 mt-2">{dealer.phoneNumber}</p>
            <a
              className={buttonVariants()}
              href={dealer.gmbMapUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              GET DIRECTIONS
            </a>
          </li>
        ))}
      </ul>
    </>
  );
};

// Fetch data at build time
export async function getStaticProps() {
  const res = await fetch("/dealers.json");
  const markers: MarkerData[] = await res.json();

  return {
    props: {
      markers,
    },
  };
}
export default Dealers;
