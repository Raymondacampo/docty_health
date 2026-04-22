import { useState, useEffect } from "react";
import { publicApiClient } from "../utils/api";
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt } from 'react-icons/fa';

// Define interface for location objects
interface Location {
  id?: number;
  cityState: string;
}

// Define component props interface
interface CityStateSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  round?: string;
}

export default function CityStateSearchBar({ value, onChange, round }: CityStateSearchBarProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [tempValue, setTempValue] = useState<string>(value);
  const [inputValue, setInputValue] = useState<string>(value);

  // Fetch clinics and extract unique city/state pairs on mount
  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);
      try {
        const response = await publicApiClient.get("/all_clinics/");
        const clinics = response.data;

        // Usamos un Map para filtrar duplicados por el string cityState
        const uniqueMap = new Map();

        clinics.forEach((item: any) => {
          const cityStateValue = `${item.city}, ${item.state}`;
          
          // Solo lo agregamos si no existe ya en el Map
          if (!uniqueMap.has(cityStateValue)) {
            uniqueMap.set(cityStateValue, {
              id: item.id, // Guardamos el ID de la primera clínica que encontremos
              cityState: cityStateValue
            });
          }
        });

        // Convertimos el Map de vuelta a un array de objetos Location
        const formattedLocations: Location[] = Array.from(uniqueMap.values());

        setLocations(formattedLocations);
        setFilteredLocations(formattedLocations);
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setTempValue(newValue);
    const filtered = locations.filter((loc) =>
      loc.cityState.toLowerCase().includes(newValue.toLowerCase())
    );
    setFilteredLocations(filtered);
    setIsOpen(true);
  };

  const handleOptionClick = (locationName: string) => {
    setTempValue(locationName);
    setInputValue(locationName);
    onChange(locationName);
    setIsOpen(false);
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (!locations.some((item) => item.cityState === tempValue)) {
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
        className={`pr-4 pl-9 py-2 w-full h-full focus:outline-none ${round}`}
        disabled={loading}
      />
      <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#293241] w-4 h-4 scale-90"/>
      {isOpen && !loading && filteredLocations.length > 0 && (
        <AnimatePresence>
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
                onMouseDown={() => handleOptionClick(loc.cityState)}
                className="px-2 py-3 hover:bg-gray-100 cursor-pointer"
              >
                {loc.cityState}
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>
      )}
      {isOpen && !loading && filteredLocations.length === 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-2 text-gray-500">
          No locations found
        </div>
      )}
    </div>
  );
}