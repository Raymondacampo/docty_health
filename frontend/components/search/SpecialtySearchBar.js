import { useState, useEffect } from "react";
import { publicApiClient } from "@/utils/api";
export default function SpecialtySearchBar({ value, onChange, round }) {
  const [specialties, setSpecialties] = useState([]);
  const [filteredSpecialties, setFilteredSpecialties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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

  useEffect(() => {
    if (!isOpen && !specialties.some(item => item.name === value)) {
      onChange("");
      setFilteredSpecialties(specialties);
    }
  },[isOpen]);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    onChange(inputValue);
    const filtered = specialties.filter((specialty) =>
      specialty.name.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredSpecialties(filtered);
    setIsOpen(true);
  };

  const handleOptionClick = (specialtyName) => {
    onChange(specialtyName);
    setIsOpen(false);
  };

  return (
    <div className="w-full h-full relative text-black">
      <input
        type="text"
        placeholder="Search for a specialty"
        value={value}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 100)}
        className={`px-4 py-2 w-full h-full focus:outline-none ${round}`}
        disabled={loading}
      />
      {isOpen && !loading && filteredSpecialties.length > 0 && (
        <ul className="text-black text-sm absolute top-full z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredSpecialties.map((specialty) => (
            <li
              key={specialty.id}
              onMouseDown={() => handleOptionClick(specialty.name)}
              className="px-2 py-3 hover:bg-gray-100 cursor-pointer"
            >
              {specialty.name}
            </li>
          ))}
        </ul>
      )}
      {isOpen && !loading && filteredSpecialties.length === 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-2 text-gray-500">
          No specialties found
        </div>
      )}
    </div>
  );
}