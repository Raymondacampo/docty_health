import { useState, useEffect } from "react";
import { publicApiClient } from "@/utils/api";export default function LocationSearchBar({ value, onChange,round }) {
  const [clinics, setClinics] = useState([]);
  const [filteredClinics, setFilteredClinics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchClinics = async () => {
      setLoading(true);
      try {
        const response = await publicApiClient.get("/all_clinics/");
        const data = response.data;
        setClinics(data);
        setFilteredClinics(data);
      } catch (error) {
        console.error("Error fetching clinics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClinics();
  }, []);

  useEffect(() => {
    if (!isOpen && !clinics.some(item => item.name === value)) {
      onChange("");
      setFilteredClinics(clinics);
    }
  },[isOpen]);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    onChange(inputValue);
    const filtered = clinics.filter((clinic) =>
      clinic.name.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredClinics(filtered);
    setIsOpen(true);
  };

  const handleOptionClick = (clinicName) => {
    onChange(clinicName);
    setIsOpen(false);
  };

  return (
    <div className="w-full h-full relative text-black">
      <input
        type="text"
        placeholder="Search for a location"
        value={value}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 100)}
        className={`px-4 py-2 w-full h-full focus:outline-none ${round}`}
        disabled={loading}
      />
      {isOpen && !loading && filteredClinics.length > 0 && (
        <ul className="text-black text-sm absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredClinics.map((clinic) => (
            <li
              key={clinic.id}
              onMouseDown={() => handleOptionClick(clinic.name)}
              className="px-2 py-3 hover:bg-gray-100 cursor-pointer"
            >
              {clinic.name}
            </li>
          ))}
        </ul>
      )}
      {isOpen && !loading && filteredClinics.length === 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-2 text-gray-500">
          No locations found
        </div>
      )}
    </div>
  );
}