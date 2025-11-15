import { useState, useEffect } from "react";
import { publicApiClient } from "../utils/api";
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch } from "react-icons/fa";

// Define interface for specialty objects
interface Specialty {
  id: string;
  name: string;
}

// Define component props interface
interface SpecialtySearchBarProps {
  value: string;
  onChange: (value: string) => void;
  round: string;
}

export default function SpecialtySearchBar({ value, onChange, round }: SpecialtySearchBarProps) {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [filteredSpecialties, setFilteredSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [tempValue, setTempValue] = useState<string>(value);
  const [inputValue, setInputValue] = useState<string>(value);

  // Fetch specialties on mount
  useEffect(() => {
    const fetchSpecialties = async () => {
      setLoading(true);
      try {
        const response = await publicApiClient.get("all_specialties/");
        const data: Specialty[] = response.data;
        setSpecialties(data);
        setFilteredSpecialties(data);
      } catch (error) {
        console.error("Error fetching specialties:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSpecialties();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setTempValue(newValue);
    const filtered = specialties.filter((specialty) =>
      specialty.name.toLowerCase().includes(newValue.toLowerCase())
    );
    setFilteredSpecialties(filtered);
    setIsOpen(true);
  };

  const handleOptionClick = (specialtyName: string) => {
    setTempValue(specialtyName);
    setInputValue(specialtyName);
    onChange(specialtyName);
    setIsOpen(false);
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (!specialties.some((item) => item.name === tempValue)) {
        setTempValue(inputValue);
      }
      setIsOpen(false);
    }, 100);
  };

  return (
    <div className={`w-full h-full text-black ` + (isOpen ? 'bg-white fixed w-full h-screen left-0 top-0 z-200' : 'relative')}>
      <input
        id="specialty-search"
        type="text"
        placeholder="Search for a specialty"
        value={tempValue}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onBlur={handleBlur}
        className={`pr-4 pl-9 py-2 lg:w-full h-17 focus:outline-none ${round}` + (isOpen ? ' relative' : '')}
        disabled={loading}
      />
      <FaSearch className="absolute left-3 top-8 transform -translate-y-1/2 text-[#293241] w-4 h-4 scale-90"/>
      {isOpen && !loading && filteredSpecialties.length > 0 && (
        <AnimatePresence>
          <motion.ul
            initial={{ height: 0, opacity: 0, scaleY: 0, transformOrigin: 'top' }}
            animate={{ height: 'auto', opacity: 1, scaleY: 1 }}
            exit={{ height: 0, opacity: 0, scaleY: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-black text-sm absolute z-70 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
          >          
            {filteredSpecialties.map((specialty) => (
              <li
                key={specialty.id}
                onMouseDown={() => handleOptionClick(specialty.name)}
                className="px-2 py-3 hover:bg-gray-100 cursor-pointer"
              >
                {specialty.name}
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>
      )}
      {isOpen && !loading && filteredSpecialties.length === 0 && (
        <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-2 text-gray-500">
          No specialties found
        </div>
      )}
    </div>
  );
}