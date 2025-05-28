import { useState, useEffect, use } from 'react';
import { apiClient, publicApiClient } from '@/utils/api';
import { motion, AnimatePresence } from 'framer-motion';
// import { v } from 'framer-motion/dist/types.d-CQt5spQA';

export default function ClinicSearchBar({ value, onChange, round, restrictToDoctorClinics = false }) {
  const [clinics, setClinics] = useState([]); // List of clinics
  const [filteredClinics, setFilteredClinics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const [inputValue, setInputValue] = useState(value); // Sync with parent


  // Fetch clinics on mount based on restrictToDoctorClinics
  useEffect(() => {
    const fetchClinics = async () => {
      setLoading(true);
      try {
        if (restrictToDoctorClinics) {
          // Fetch doctor's profile to get associated clinics
          const response = await apiClient.get('/auth/me/');
          const profile = response.data;
          if (!profile.is_doctor || !profile.clinics) {
            setClinics([]);
          } else {
            // Map clinics to match the expected format
            setClinics(
              profile.clinics.map(clinic => ({
                id: clinic.id,
                name: `${clinic.name} `
              }))
            );
            if (typeof value === 'number'){
              for (let i = 0; i < profile.clinics.length; i++){
                if (profile.clinics[i].id === value){
                  console.log(profile.clinics[i].name, value)
                  setTempValue(profile.clinics[i].name);
                  setInputValue(profile.clinics[i].name);
                  onChange(profile.clinics[i]); // Notify parent
                  break;
                }
              }
            }
          }
        } else {
          // Fetch all clinics (public endpoint)
          const response = await publicApiClient.get('/all_clinics/');
          setClinics(
            response.data.map(clinic => ({
              id: clinic.id,
              name: clinic.name
            }))
          );
        }
      } catch (error) {
        setClinics([]);
      } finally {
        setLoading(false);
      }
    };
    fetchClinics();
  }, [restrictToDoctorClinics]);

  useEffect(() => { 
    setFilteredClinics(clinics);
  }, [clinics]);

  // Update filtered clinics when input changes
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setTempValue(newValue);
    const filtered = clinics.filter((clinic) =>
      clinic.name.toLowerCase().includes(newValue.toLowerCase())
    );
    setFilteredClinics(filtered);
    setIsOpen(true);
  };

  // Handle clinic selection
  const handleOptionClick = (clinic) => {
    console.log('clinic', clinic);
    setTempValue(clinic.name);
    setInputValue(clinic.name);
    onChange(clinic); // Notify parent
    setIsOpen(false);
  };

  // Handle blur to reset invalid input
  const handleBlur = () => {
    setTimeout(() => {
      if (!clinics.some((item) => item.name === tempValue)) {
        setTempValue(inputValue);
      }
      setIsOpen(false);
    }, 100);
  };

  return (
    <div className="w-full h-full relative text-black border border-gray-300 rounded-md shadow-sm">
      <input
        type="text"
        placeholder="Search for a clinic"
        value={tempValue}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onBlur={handleBlur}
        className={`px-4 py-2 w-full h-full focus:outline-none ${round}`}
        disabled={loading}
      />
      {isOpen && !loading && filteredClinics.length > 0 && (
        <AnimatePresence>
          <motion.ul
            initial={{ height: 0, opacity: 0, scaleY: 0, transformOrigin: 'top' }}
            animate={{ height: 'auto', opacity: 1, scaleY: 1 }}
            exit={{ height: 0, opacity: 0, scaleY: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-black text-sm absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
          >
            {filteredClinics.map((clinic) => (
              <li
                key={clinic.id}
                onMouseDown={() => handleOptionClick(clinic)}
                className="px-2 py-3 hover:bg-gray-100 cursor-pointer"
              >
                {clinic.name}
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>
      )}
      {isOpen && !loading && filteredClinics.length === 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-2 text-gray-500">
          No clinics found
        </div>
      )}
    </div>
  );
}