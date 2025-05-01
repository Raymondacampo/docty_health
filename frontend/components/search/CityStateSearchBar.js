// components/CityStateSearchBar.js
import { useState, useEffect } from "react";
import { publicApiClient } from "@/utils/api";

export default function CityStateSearchBar({ value, onChange, round }) {
  const [locations, setLocations] = useState([]); // Unique city/state pairs
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [tempValue, setTempValue] = useState(value);
  const [inputValue, setInputValue] = useState(value); // Sync with parent

  // Fetch clinics and extract unique city/state pairs on mount
  useEffect(() => {

    const fetchLocations = async () => {
      setLoading(true);
      try {
        const response = await publicApiClient.get("/all_clinics/");
        const clinics = response.data;
        // Extract unique city/state combinations
        const uniqueLocations = [
          ...new Set(
            clinics
              .filter(clinic => clinic.city && clinic.state) // Ensure both exist
              .map(clinic => `${clinic.city}, ${clinic.state}`)
          ),
        ].map(loc => ({ name: loc }));
        setLocations(uniqueLocations);
        setFilteredLocations(uniqueLocations);
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setTempValue(newValue);
    const filtered = locations.filter((loc) =>
      loc.name.toLowerCase().includes(newValue.toLowerCase())
    );
    setFilteredLocations(filtered);
    setIsOpen(true);
  };

  const handleOptionClick = (locationName) => {
    setTempValue(locationName);
    setInputValue(locationName);
    onChange(locationName); // Notify parent
    setIsOpen(false);
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (!locations.some((item) => item.name === tempValue)) {
        setTempValue(inputValue);
      }
      setIsOpen(false);
    }, 100);
  };

  return (
    <div className="w-full h-full relative text-black">
      <input
        type="text"
        placeholder="Search for a city or state"
        value={tempValue}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onBlur={handleBlur}
        className={`px-4 py-2 w-full h-full focus:outline-none ${round}`}
        disabled={loading}
      />
      {isOpen && !loading && filteredLocations.length > 0 && (
        <ul className="text-black text-sm absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredLocations.map((loc, index) => (
            <li
              key={index} // Use index since city/state pairs are unique strings
              onMouseDown={() => handleOptionClick(loc.name)}
              className="px-2 py-3 hover:bg-gray-100 cursor-pointer"
            >
              {loc.name}
            </li>
          ))}
        </ul>
      )}
      {isOpen && !loading && filteredLocations.length === 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-2 text-gray-500">
          No locations found
        </div>
      )}
    </div>
  );
}