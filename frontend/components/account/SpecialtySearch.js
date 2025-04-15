'use client';

import { useState } from 'react';
import { apiClient } from '@/utils/api'; // Import apiClient

export default function SpecialtySearch({ onSpecialtyAdded }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSpecialties = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.get('/auth/available_specialties/');
      setSpecialties(data);
    } catch (err) {
      setError('Failed to load specialties');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSpecialty = async (specialtyId) => {
    try {
      await apiClient.post('/auth/add_specialty/', { specialty_id: specialtyId });
      setIsOpen(false);
      setSearchTerm('');
      onSpecialtyAdded();
    } catch (err) {
      setError('Failed to add specialty');
      console.error(err);
    }
  };

  const filteredSpecialties = specialties.filter(specialty =>
    specialty.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      {!isOpen ? (
        <button
          onClick={() => {
            setIsOpen(true);
            fetchSpecialties();
          }}
          className="text-white text-sm font-normal font-['Inter'] bg-[#ee6c4d] px-2 py-1.5 rounded-sm"
        >
          Add +
        </button>
      ) : (
        <div className="w-full flex-col gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search specialties..."
            className="text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4285f4] focus:border-[#4285f4] text-sm"
          />
          {loading && <div className="text-sm text-gray-500">Loading...</div>}
          {error && <div className="text-sm text-red-500">{error}</div>}
          {!loading && !error && filteredSpecialties.length > 0 && (
            <ul className="max-h-[150px] overflow-y-auto border border-gray-300 rounded-md bg-white">
              {filteredSpecialties.map((specialty) => (
                <li
                  key={specialty.id}
                  onClick={() => handleAddSpecialty(specialty.id)}
                  className="px-3 py-2 text-sm font-normal font-['Inter'] text-black hover:bg-[#98c1d1]/25 cursor-pointer"
                >
                  {specialty.name}
                </li>
              ))}
            </ul>
          )}
          {!loading && !error && filteredSpecialties.length === 0 && (
            <div className="text-sm text-gray-500">No available specialties found</div>
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