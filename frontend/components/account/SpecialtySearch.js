// components/SpecialtySearch.js
import { useState } from 'react';
import axios from 'axios';

export default function SpecialtySearch({ onSpecialtyAdded }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch available specialties when search bar opens
  const fetchSpecialties = async () => {
    setLoading(true);
    setError(null);
    try {
      const accessToken = localStorage.getItem("access_token");
      const { data } = await axios.get('http://localhost:8000/api/auth/available_specialties/', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setSpecialties(data);
    } catch (err) {
      setError('Failed to load specialties');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle adding a specialty
  const handleAddSpecialty = async (specialtyId) => {
    try {
      const accessToken = localStorage.getItem("access_token");
      await axios.post(
        'http://localhost:8000/api/auth/add_specialty/',
        { specialty_id: specialtyId },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setIsOpen(false); // Close the search bar
      setSearchTerm(''); // Reset search
      onSpecialtyAdded(); // Trigger reload in parent component
    } catch (err) {
      setError('Failed to add specialty');
      console.error(err);
    }
  };

  // Filter specialties based on search term
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