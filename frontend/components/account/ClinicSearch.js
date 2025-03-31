'use client';

import { useState } from 'react';
import { apiClient } from '@/utils/api'; // Import apiClient

export default function ClinicSearch({ onClinicAdded }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchClinics = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.get('/auth/available_clinics/');
      setClinics(data);
    } catch (err) {
      setError('Failed to load clinics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClinic = async (clinicId) => {
    try {
      await apiClient.post('/auth/add_clinic/', { clinic_id: clinicId });
      setIsOpen(false);
      setSearchTerm('');
      onClinicAdded();
    } catch (err) {
      setError('Failed to add clinic');
      console.error(err);
    }
  };

  const filteredClinics = clinics.filter(clinic =>
    clinic.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      {!isOpen ? (
        <button
          onClick={() => {
            setIsOpen(true);
            fetchClinics();
          }}
          className="text-white text-sm font-normal font-['Inter'] bg-[#ee6c4d] px-2.5 py-2 rounded-md"
        >
          Add +
        </button>
      ) : (
        <div className="w-full flex-col gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search clinics..."
            className="text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4285f4] focus:border-[#4285f4] text-sm"
          />
          {loading && <div className="text-sm text-gray-500">Loading...</div>}
          {error && <div className="text-sm text-red-500">{error}</div>}
          {!loading && !error && filteredClinics.length > 0 && (
            <ul className="max-h-[150px] overflow-y-auto border border-gray-300 rounded-md bg-white">
              {filteredClinics.map((clinic) => (
                <li
                  key={clinic.id}
                  onClick={() => handleAddClinic(clinic.id)}
                  className="px-3 py-2 text-sm font-normal font-['Inter'] text-black hover:bg-[#98c1d1]/25 cursor-pointer"
                >
                  {clinic.name}
                </li>
              ))}
            </ul>
          )}
          {!loading && !error && filteredClinics.length === 0 && (
            <div className="text-sm text-gray-500">No available clinics found</div>
          )}
          <button
            onClick={() => setIsOpen(false)}
            className="mt-2 text-white bg-[#ee6c4d] hover:bg-[#ff7653] text-sm font-normal font-['Inter'] px-2.5 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}