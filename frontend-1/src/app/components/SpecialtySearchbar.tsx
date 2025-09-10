import { useState, useEffect } from "react";
import { publicApiClient } from "@/utils/api";
import { motion, AnimatePresence } from 'framer-motion';


export default function SpecialtySearchBar({ value, onChange, round }:{value: string; onChange: (value: string) => void; round: string}) {
  const [specialties, setSpecialties] = useState([]);
  const [filteredSpecialties, setFilteredSpecialties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [tempValue, setTempValue] = useState(value);
  const [inputValue, setInputValue] = useState(value); // Local state to sync with parent

  // Fetch specialties on mount
  useEffect(() => {
    const fetchSpecialties = async () => {
      setLoading(true);
      try {
        const response = await publicApiClient.get("all_specialties/");
        const data = response.data;
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


  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setTempValue(newValue);
    const filtered = specialties.filter((specialty) =>
      specialty.name.toLowerCase().includes(newValue.toLowerCase())
    );
    setFilteredSpecialties(filtered);
    setIsOpen(true);
  };

  const handleOptionClick = (specialtyName) => {
    setTempValue(specialtyName);
    setInputValue(specialtyName);
    onChange(specialtyName); // Notify parent of selection
    setIsOpen(false);
  };

  // Optional: Reset only if input is cleared manually and dropdown closes
  const handleBlur = () => {
    setTimeout(() => {
      if (!specialties.some((item) => item.name === tempValue)) {
        setTempValue(inputValue); // Clear local state
      }
      setIsOpen(false);
    }, 100);
  };

  return (
    <div className="w-full h-full relative text-black">
      <input
        type="text"
        placeholder="Search for a specialty"
        value={tempValue} // Use local state synced with parent
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onBlur={handleBlur}
        className={`px-4 py-2 w-full h-full focus:outline-none ${round}`}
        disabled={loading}
      />
      {isOpen && !loading && filteredSpecialties.length > 0 && (
        <AnimatePresence>
        <motion.ul
          initial={{ height: 0, opacity: 0, scaleY: 0, transformOrigin: 'top' }}
          animate={{ height: 'auto', opacity: 1, scaleY: 1 }}
          exit={{ height: 0, opacity: 0, scaleY: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-black text-sm absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
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
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-2 text-gray-500">
          No specialties found
        </div>
      )}
    </div>
  );
}