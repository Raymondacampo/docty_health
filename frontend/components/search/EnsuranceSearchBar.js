import { useState, useEffect } from "react";
import { publicApiClient } from "@/utils/api";export default function EnsuranceSearchBar({ value, onChange }) {
  const [ensurances, setEnsurances] = useState([]);
  const [filteredEnsurances, setFilteredEnsurances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchEnsurances = async () => {
      setLoading(true);
      try {
        const response = await publicApiClient.get("/all_specialties/");
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
    const inputValue = e.target.value;
    // onChange(inputValue);
    const filtered = ensurances.filter((ensurance) =>
      ensurance.name.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredEnsurances(filtered);
    setIsOpen(true);
  };

  const handleOptionClick = (ensuranceName) => {
    onChange(ensuranceName);
    setIsOpen(false);
  };

  return (
    <div className="max-w-3xs w-full relative">
      <input
        type="text"
        placeholder="Search for an ensurance"
        value={value}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className="max-w-3xs p-4 w-full bg-white rounded-[10px] focus:outline-none text-black placeholder-gray-400 justify-start items-center gap-2.5 inline-flex
                sm:p-4 xs:p-3 xs:border xs:border-black/45"
        disabled={loading}
      />
      {isOpen && !loading && filteredEnsurances.length > 0 && (
        <ul className="text-black absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredEnsurances.map((ensurance) => (
            <li
              key={ensurance.id}
              onMouseDown={() => handleOptionClick(ensurance.name)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {ensurance.name}
            </li>
          ))}
        </ul>
      )}
      {isOpen && !loading && filteredEnsurances.length === 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-2 text-gray-500">
          No ensurances found
        </div>
      )}
    </div>
  );
}