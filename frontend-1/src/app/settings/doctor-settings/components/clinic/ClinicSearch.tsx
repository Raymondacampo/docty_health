'use client';

import { useState } from 'react';
import { apiClient } from '@/app/utils/api';

interface Clinic {
  id: number;
  name: string;
}

interface ClinicSearchProps {
  onClinicAdded: (response: { msg: string; status: string }) => void;
}

export default function ClinicSearch({ onClinicAdded }: ClinicSearchProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClinics = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.get<Clinic[]>('/auth/available_clinics/');
      setClinics(data);
    } catch (err) {
      setError('Failed to load clinics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClinic = async (clinicId: number, name: string) => {
    try {
      await apiClient.post('/auth/add_clinic/', { clinic_id: clinicId });
      setIsOpen(false);
      setSearchTerm('');
      onClinicAdded({ msg: `Clinic ${name} added successfully`, status: 'success' });
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
          className="text-white text-sm font-normal bg-[#293241] hover:bg-[#293241]/90 cursor-pointer px-2 py-1.5 rounded-sm"
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
                  onClick={() => handleAddClinic(clinic.id, clinic.name)}
                  className="px-3 py-2 text-sm font-normal text-black hover:bg-[#98c1d1]/25 cursor-pointer"
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
            className="mt-2 text-white bg-[#293241] hover:bg-[#293241]/90 cursor-pointer text-sm font-normal px-2.5 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}