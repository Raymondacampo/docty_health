import { useState, useEffect } from "react";
import { publicApiClient } from "@/utils/api";
export default function SpecialtySearchBar({ value, onChange }) {
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
    <div className="max-w-3xs w-full relative">
      <input
        type="text"
        placeholder="Search for a specialty"
        value={value}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className="max-w-3xs p-4 w-full bg-white rounded-[10px] focus:outline-none text-black placeholder-gray-400 justify-start items-center gap-2.5 inline-flex
                sm:rounded-tl-full sm:rounded-bl-full sm:rounded-tr-[0px] sm:rounded-br-[0px] sm:p-4 sm:border-r sm:border-0
                xs:p-3 xs:border xs:border-black/45"
        disabled={loading}
      />
      {isOpen && !loading && filteredSpecialties.length > 0 && (
        <ul className="text-black absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredSpecialties.map((specialty) => (
            <li
              key={specialty.id}
              onMouseDown={() => handleOptionClick(specialty.name)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
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