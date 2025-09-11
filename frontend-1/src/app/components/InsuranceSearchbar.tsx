import { useState, useEffect } from "react";
import { publicApiClient } from "../utils/api";
import { motion, AnimatePresence } from 'framer-motion';
import { FaShieldAlt } from 'react-icons/fa';

// Define interface for Insurance objects
interface Insurance {
  id: string;
  name: string;
}

// Define component props interface
interface InsuranceSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  round: string;
}

export default function InsuranceSearchBar({ value, onChange, round }: InsuranceSearchBarProps) {
  const [Insurances, setInsurances] = useState<Insurance[]>([]);
  const [filteredInsurances, setFilteredInsurances] = useState<Insurance[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [tempValue, setTempValue] = useState<string>(value);
  const [inputValue, setInputValue] = useState<string>(value);

  // Fetch Insurances on mount
  useEffect(() => {
    const fetchInsurances = async () => {
      setLoading(true);
      try {
        const response = await publicApiClient.get("all_ensurances/");
        const data: Insurance[] = response.data;
        setInsurances(data);
        setFilteredInsurances(data);
      } catch (error) {
        console.error("Error fetching insurances:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInsurances();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setTempValue(newValue);
    const filtered = Insurances.filter((Insurance) =>
      Insurance.name.toLowerCase().includes(newValue.toLowerCase())
    );
    setFilteredInsurances(filtered);
    setIsOpen(true);
  };

  const handleOptionClick = (InsuranceName: string) => {
    setTempValue(InsuranceName);
    setInputValue(InsuranceName);
    onChange(InsuranceName);
    setIsOpen(false);
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (!Insurances.some((item) => item.name === tempValue)) {
        setTempValue(inputValue);
      }
      setIsOpen(false);
    }, 100);
  };

  return (
    <div className="w-full h-full relative text-black">
      <input
        type="text"
        placeholder="Search for a Insurance"
        value={tempValue}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onBlur={handleBlur}
        className={`pr-4 pl-9 py-2 w-full h-full focus:outline-none ${round}`}
        disabled={loading}
      />
      <FaShieldAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#293241] w-4 h-4 scale-90"/>
      {isOpen && !loading && filteredInsurances.length > 0 && (
        <AnimatePresence>
          <motion.ul
            initial={{ height: 0, opacity: 0, scaleY: 0, transformOrigin: 'top' }}
            animate={{ height: 'auto', opacity: 1, scaleY: 1 }}
            exit={{ height: 0, opacity: 0, scaleY: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-black text-sm absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
          >          
            {filteredInsurances.map((Insurance) => (
              <li
                key={Insurance.id}
                onMouseDown={() => handleOptionClick(Insurance.name)}
                className="px-2 py-3 hover:bg-gray-100 cursor-pointer"
              >
                {Insurance.name}
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>
      )}
      {isOpen && !loading && filteredInsurances.length === 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-2 text-gray-500">
          No Insurances found
        </div>
      )}
    </div>
  );
}