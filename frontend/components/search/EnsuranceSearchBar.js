import { useState, useEffect } from "react";
import { publicApiClient } from "@/utils/api";
import { motion, AnimatePresence } from 'framer-motion';


export default function EnsuranceSearchBar({ value, onChange, round }) {
  const [ensurances, setEnsurances] = useState([]);
  const [filteredEnsurances, setFilteredEnsurances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [tempValue, setTempValue] = useState(value);
  const [inputValue, setInputValue] = useState(value); // Local state to sync with parent

  // Fetch ensurances on mount
  useEffect(() => {
    const fetchEnsurances = async () => {
      setLoading(true);
      try {
        const response = await publicApiClient.get("/all_ensurances/");
        const data = response.data;
        setEnsurances(data);
        setFilteredEnsurances(data);
      } catch (error) {
        console.error("Error fetching ensurances:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEnsurances();
  }, []);



  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setTempValue(newValue);
    const filtered = ensurances.filter((ensurance) =>
      ensurance.name.toLowerCase().includes(newValue.toLowerCase())
    );
    setFilteredEnsurances(filtered);
    setIsOpen(true);
  };

  const handleOptionClick = (ensuranceName) => {
    if(!ensuranceName) {
      setTempValue("");
      setInputValue("");
      onChange(""); // Notify parent of selection
      setIsOpen(false);
      return;
    }
    setTempValue(ensuranceName);
    setInputValue(ensuranceName);
    onChange(ensuranceName); // Notify parent of selection
    setIsOpen(false);
  };

  // Reset only if input is invalid on blur
  const handleBlur = () => {
    setTimeout(() => {
      if (!ensurances.some((item) => item.name === tempValue)) {
        setTempValue(inputValue); // Clear local state
      }
      setIsOpen(false);
    }, 100);
  };

  return (
    <div className="w-full h-full relative text-black">
      <input
        type="text"
        placeholder="Search for an ensurance"
        value={tempValue}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onBlur={handleBlur}
        className={`px-4 py-2 w-full h-full focus:outline-none ${round}`}
        disabled={loading}
      />
      {isOpen && !loading && filteredEnsurances.length > 0 && (
        <AnimatePresence>
        <motion.ul
          initial={{ height: 0, opacity: 0, scaleY: 0, transformOrigin: 'top' }}
          animate={{ height: 'auto', opacity: 1, scaleY: 1 }}
          exit={{ height: 0, opacity: 0, scaleY: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-black text-sm absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >             
        <li
              onMouseDown={() => handleOptionClick(null)}
              className="px-2 py-3 hover:bg-gray-100 cursor-pointer"
            >
              None
            </li>
          {filteredEnsurances.map((ensurance) => (
            <li
              key={ensurance.id}
              onMouseDown={() => handleOptionClick(ensurance.name)}
              className="px-2 py-3 hover:bg-gray-100 cursor-pointer"
            >
              {ensurance.name}
            </li>
          ))}
        </motion.ul>
        </AnimatePresence>
      )}
      {isOpen && !loading && filteredEnsurances.length === 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-2 text-gray-500">
          No ensurances found
        </div>
      )}
    </div>
  );
}