import React, { useState, useEffect, useRef } from 'react';
import { apiClient } from '@/app/utils/api';

interface Specialty {
  id: number;
  name: string;
}

interface SpecialtyMenuProps {
  specialty: Specialty;
  onDelete: (response: { msg: string; status: string }) => void;
}

const ThreeDotsIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="3" cy="8" r="1.5" fill="black" />
    <circle cx="8" cy="8" r="1.5" fill="black" />
    <circle cx="13" cy="8" r="1.5" fill="black" />
  </svg>
);

export const SpecialtyMenu: React.FC<SpecialtyMenuProps> = ({ specialty, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleDelete = async () => {
    try {
      await apiClient.delete(`/auth/remove_specialty/${specialty.id}/`);
      onDelete({ msg: `Specialty ${specialty.name} deleted successfully`, status: 'success' });
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Failed to delete specialty:", error);
    }
  };

  return (
    <div ref={menuRef} className='relative -bottom-1 inline-block'>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className='bg-none border-none cursor-pointer'
        aria-label="Specialty options"
      >
        <ThreeDotsIcon />
      </button>
      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded shadow-lg z-10">
          <button
            onClick={handleDelete}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            aria-label={`Delete specialty ${specialty.name}`}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};