import { useState, useEffect, useRef } from "react";
import { publicApiClient } from "@/app/utils/api";
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaTimes } from 'react-icons/fa';
import { useMediaQuery } from 'react-responsive';
import type { Clinic } from "./ScheduleCreationModal";


interface ClinicSearchBarProps {
  value: Clinic | null;
  onChange: (value: Clinic) => void;
  round?: string;
}

export default function ClinicSearchBar({ value, onChange, round }: ClinicSearchBarProps) {
  const [locations, setLocations] = useState<Clinic[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [tempValue, setTempValue] = useState<string>(value ? value.name : "");
  const [inputValue, setInputValue] = useState<string>(value ? value.name : "");

  const inputRef = useRef<HTMLInputElement>(null);
  const isLg = useMediaQuery({ minWidth: 1024 });

  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);
      try {
        const response = await publicApiClient.get("/all_clinics/");
        const clinics: {id: number; name: string;}[] = response.data;
        const mappedClinics: Clinic[] = clinics.map(clinic => ({
          id: clinic.id,
          name: clinic.name,
        }));
        setLocations(mappedClinics);
        setFilteredLocations(mappedClinics);
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    setTempValue(value ? value.name : "");
    setInputValue(value ? value.name : "");
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setTempValue(newValue);
    const filtered = locations.filter((loc) =>
      loc.name.toLowerCase().includes(newValue.toLowerCase())
    );
    setFilteredLocations(filtered);
  };

  const handleSelect = (name: string) => {
    setTempValue(name);
    setInputValue(name);
    const selectedClinic = locations.find(loc => loc.name === name);
    if (selectedClinic) {
      onChange(selectedClinic);
    }
    setIsOpen(false);
  };

  const closeSearch = () => {
    setIsOpen(false);
    setTempValue(inputValue);
    setFilteredLocations(locations);
  };

  const openSearch = () => {
    setIsOpen(true);
    setTempValue(inputValue);
  };

  return (
    <>
      <div className="w-full h-full relative text-black">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for a city or state"
          value={tempValue}
          onChange={handleInputChange}
          onFocus={isLg ? () => setIsOpen(true) : openSearch}
          onBlur={isLg ? () => setIsOpen(false) : undefined}
          className={`pr-4 pl-9 py-3 rounded-md w-full h-full border border-gray-300 focus:outline-none ${round}`}
          disabled={loading}
          readOnly={!isLg && isOpen}
          autoComplete="off"
        />
        <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#293241] w-4 h-4 scale-90" />
      </div>

      {isLg && isOpen && !loading && (
        <AnimatePresence>
          {filteredLocations.length > 0 ? (
            <motion.ul
              initial={{ height: 0, opacity: 0, scaleY: 0, transformOrigin: 'top' }}
              animate={{ height: 'auto', opacity: 1, scaleY: 1 }}
              exit={{ height: 0, opacity: 0, scaleY: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="text-black text-sm absolute z-70 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
            >
              {filteredLocations.map((loc, index) => (
                <li
                  key={index}
                  onMouseDown={() => handleSelect(loc.name)}
                  className="px-2 py-3 hover:bg-gray-100 cursor-pointer"
                >
                  {loc.name}
                </li>
              ))}
            </motion.ul>
          ) : (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-2 text-gray-500">
              No locations found
            </div>
          )}
        </AnimatePresence>
      )}

      {!isLg && isOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-300">
            <h3 className="text-lg font-semibold">Select Location</h3>
            <button
              onClick={closeSearch}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="Close"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for a city or state"
                value={tempValue}
                onChange={handleInputChange}
                autoFocus
                className="pr-4 pl-10 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4">
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : filteredLocations.length > 0 ? (
              <ul>
                {filteredLocations.map((loc, index) => (
                  <li
                    key={index}
                    onClick={() => handleSelect(loc.name)}
                    className="px-2 py-3 border-b border-gray-200/50 cursor-pointer hover:bg-gray-50"
                  >
                    {loc.name}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 text-gray-500">No locations found</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}