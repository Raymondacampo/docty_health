import { useState, useEffect, useRef } from "react";
import { publicApiClient } from "../utils/api";
import { motion, AnimatePresence } from 'framer-motion';
import { FaShieldAlt, FaTimes } from 'react-icons/fa';
import { useMediaQuery } from 'react-responsive';

interface Insurance {
  id: string;
  name: string;
}

interface InsuranceSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  round: string;
}

export default function InsuranceSearchBar({ value, onChange, round }: InsuranceSearchBarProps) {
  const [insurances, setInsurances] = useState<Insurance[]>([]);
  const [filteredInsurances, setFilteredInsurances] = useState<Insurance[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [tempValue, setTempValue] = useState<string>(value);
  const [inputValue, setInputValue] = useState<string>(value);

  const inputRef = useRef<HTMLInputElement>(null);
  const isLg = useMediaQuery({ minWidth: 1024 });

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

// Sync with external value
  useEffect(() => {
    setTempValue(value);
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setTempValue(newValue);
    const filtered = insurances.filter((ins) =>
      ins.name.toLowerCase().includes(newValue.toLowerCase())
    );
    setFilteredInsurances(filtered);
  };

  const handleSelect = (name: string) => {
    setTempValue(name);
    setInputValue(name);
    onChange(name);
    setIsOpen(false);
  };

  const closeSearch = () => {
    setIsOpen(false);
    setTempValue(inputValue);
    setFilteredInsurances(insurances);
  };

  const openSearch = () => {
    setIsOpen(true);
    setTempValue(inputValue);
  };

  return (
    <>
      <div className="w-full h-full relative z-20 text-black">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for an insurance"
          value={tempValue}
          onChange={handleInputChange}
          onFocus={isLg ? () => setIsOpen(true) : openSearch}
          onBlur={isLg ? () => setIsOpen(false) : undefined}
          className={`pr-4 pl-9 py-2 w-full h-full focus:outline-none ${round}`}
          disabled={loading}
          readOnly={!isLg && isOpen}
          autoComplete="off"
        />
        <FaShieldAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#293241] w-4 h-4 scale-90" />
      </div>

      {isLg && isOpen && !loading && (
        <AnimatePresence>
          <motion.ul
            initial={{ height: 0, opacity: 0, scaleY: 0, transformOrigin: 'top' }}
            animate={{ height: 'auto', opacity: 1, scaleY: 1 }}
            exit={{ height: 0, opacity: 0, scaleY: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-black text-sm absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
          >
            <li
              onMouseDown={() => handleSelect("any")}
              className="px-2 py-3 hover:bg-gray-100 cursor-pointer"
            >
              No insurance
            </li>
            {filteredInsurances.map((ins) => (
              <li
                key={ins.id}
                onMouseDown={() => handleSelect(ins.name)}
                className="px-2 py-3 hover:bg-gray-100 cursor-pointer"
              >
                {ins.name}
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>
      )}

      {!isLg && isOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-300">
            <h3 className="text-lg font-semibold">What is your insurance?</h3>
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
                placeholder="Search for an insurance"
                value={tempValue}
                onChange={handleInputChange}
                autoFocus
                className="pr-4 pl-10 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaShieldAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4">
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <ul>
                <li
                  onClick={() => handleSelect("any")}
                  className="px-2 py-3 border-b border-gray-200/50 cursor-pointer hover:bg-gray-50"
                >
                  No insurance
                </li>
                {filteredInsurances.length > 0 ? (
                  filteredInsurances.map((ins) => (
                    <li
                      key={ins.id}
                      onClick={() => handleSelect(ins.name)}
                      className="px-2 py-3 border-b border-gray-200/50 cursor-pointer hover:bg-gray-50"
                    >
                      {ins.name}
                    </li>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">No insurances found</div>
                )}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
}