import { useState, useEffect } from "react";
import { publicApiClient } from "@/utils/api";
import { motion, AnimatePresence } from 'framer-motion';


export default function LocationSearchBar({ value, onChange, round }) {
  const [clinics, setClinics] = useState([]);
  const [filteredClinics, setFilteredClinics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value); // Local state to sync with parent

  // Fetch clinics on mount
  useEffect(() => {
    const fetchClinics = async () => {
      setLoading(true);
      try {
        const response = await publicApiClient.get("/all_clinics/");
        const data = response.data;
        setClinics(data);
        setFilteredClinics(data);
      } catch (error) {
        console.error("Error fetching clinics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClinics();
  }, []);

  // Sync local inputValue with parent value and filter clinics
  useEffect(() => {
    setInputValue(value);
    const filtered = clinics.filter((clinic) =>
      clinic.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredClinics(filtered);
  }, [value, clinics]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue); // Notify parent of change
    const filtered = clinics.filter((clinic) =>
      clinic.name.toLowerCase().includes(newValue.toLowerCase())
    );
    setFilteredClinics(filtered);
    setIsOpen(true);
  };

  const handleOptionClick = (clinicName) => {
    setInputValue(clinicName);
    onChange(clinicName); // Notify parent of selection
    setIsOpen(false);
  };

  // Reset only if input is invalid on blur
  const handleBlur = () => {
    setTimeout(() => {
      if (!clinics.some((item) => item.name === inputValue)) {
        setInputValue("");
        onChange("");
      }
      setIsOpen(false);
    }, 100);
  };

  return (
    <div className="w-full h-full relative text-black">
      <input
        type="text"
        placeholder="Search for a location"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onBlur={handleBlur}
        className={`px-4 py-2 w-full h-full focus:outline-none ${round}`}
        disabled={loading}
      />
      {isOpen && !loading && filteredClinics.length > 0 && (
        <AnimatePresence>
          <ul className="text-black text-sm absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {filteredClinics.map((clinic) => (
              <li
                key={clinic.id}
                onMouseDown={() => handleOptionClick(clinic.name)}
                className="px-2 py-3 hover:bg-gray-100 cursor-pointer"
              >
                {clinic.name}
              </li>
            ))}
          </ul>
        </AnimatePresence>
      )}
      {isOpen && !loading && filteredClinics.length === 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-2 text-gray-500">
          No locations found
        </div>
      )}
    </div>
  );
}