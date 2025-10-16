'use client';

import { useState } from 'react';
import { apiClient } from '@/app/utils/api';

interface Insurance {
  id: number;
  name: string;
}

interface InsuranceSearchProps {
  onInsuranceAdded: (response: { msg: string; status: string }) => void;
}

export default function InsuranceSearch({ onInsuranceAdded }: InsuranceSearchProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [Insurances, setInsurances] = useState<Insurance[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsurances = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.get<Insurance[]>('/auth/available_insurances/');
      setInsurances(data);
    } catch (err) {
      setError('Failed to load Insurances');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddInsurance = async (InsuranceId: number, name: string) => {
    try {
      await apiClient.post('/auth/add_insurance/', { insurance_id: InsuranceId });
      setIsOpen(false);
      setSearchTerm('');
      onInsuranceAdded({ msg: `Insurance ${name} added successfully`, status: 'success' });
    } catch (err) {
      setError('Failed to add Insurance');
      console.error(err);
    }
  };

  const filteredInsurances = Insurances.filter(Insurance =>
    Insurance.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      {!isOpen ? (
        <button
          onClick={() => {
            setIsOpen(true);
            fetchInsurances();
          }}
          className="text-white text-sm font-normal bg-[#293241] px-2 py-1.5 rounded-sm"
        >
          Add +
        </button>
      ) : (
        <div className="w-full flex-col gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Insurances..."
            className="text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4285f4] focus:border-[#4285f4] text-sm"
          />
          {loading && <div className="text-sm text-gray-500">Loading...</div>}
          {error && <div className="text-sm text-red-500">{error}</div>}
          {!loading && !error && filteredInsurances.length > 0 && (
            <ul className="max-h-[150px] overflow-y-auto border border-gray-300 rounded-md bg-white">
              {filteredInsurances.map((Insurance) => (
                <li
                  key={Insurance.id}
                  onClick={() => handleAddInsurance(Insurance.id, Insurance.name)}
                  className="px-3 py-2 text-sm font-normal text-black hover:bg-[#98c1d1]/25 cursor-pointer flex items-center gap-2"
                >
                  {Insurance.name}
                </li>
              ))}
            </ul>
          )}
          {!loading && !error && filteredInsurances.length === 0 && (
            <div className="text-sm text-gray-500">No available Insurances found</div>
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