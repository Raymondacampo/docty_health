// components/account/EnsuranceSearch.js
'use client';

import { useState } from 'react';
import { apiClient } from '@/utils/api';

export default function EnsuranceSearch({ onEnsuranceAdded }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [ensurances, setEnsurances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEnsurances = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.get('/auth/available_ensurances/');
      setEnsurances(data);
    } catch (err) {
      setError('Failed to load ensurances');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEnsurance = async (ensuranceId, name) => {
    try {
      await apiClient.post('/auth/add_ensurance/', { ensurance_id: ensuranceId });
      setIsOpen(false);
      setSearchTerm('');
      onEnsuranceAdded({msg: `Ensurance ${name} added successfully`, status: 'success'});
    } catch (err) {
      setError('Failed to add ensurance');
      console.error(err);
    }
  };

  const filteredEnsurances = ensurances.filter(ensurance =>
    ensurance.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      {!isOpen ? (
        <button
          onClick={() => {
            setIsOpen(true);
            fetchEnsurances();
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
            placeholder="Search ensurances..."
            className="text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4285f4] focus:border-[#4285f4] text-sm"
          />
          {loading && <div className="text-sm text-gray-500">Loading...</div>}
          {error && <div className="text-sm text-red-500">{error}</div>}
          {!loading && !error && filteredEnsurances.length > 0 && (
            <ul className="max-h-[150px] overflow-y-auto border border-gray-300 rounded-md bg-white">
              {filteredEnsurances.map((ensurance) => (
                <li
                  key={ensurance.id}
                  onClick={() => handleAddEnsurance(ensurance.id, ensurance.name)}
                  className="px-3 py-2 text-sm font-normal font-['Inter'] text-black hover:bg-[#98c1d1]/25 cursor-pointer flex items-center gap-2"
                >
                  {ensurance.name}
                </li>
              ))}
            </ul>
          )}
          {!loading && !error && filteredEnsurances.length === 0 && (
            <div className="text-sm text-gray-500">No available ensurances found</div>
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