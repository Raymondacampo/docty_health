import React, { useState, useEffect, useRef } from 'react';
import { apiClient } from '@/app/utils/api';

interface Clinic {
  id: number;
  name: string;
}

interface ClinicMenuProps {
  clinic: Clinic;
  onDelete: (response: { msg: string; status: string }) => void;
}

const ThreeDotsIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="3" cy="8" r="1.5" fill="black" />
    <circle cx="8" cy="8" r="1.5" fill="black" />
    <circle cx="13" cy="8" r="1.5" fill="black" />
  </svg>
);

export const ClinicMenu: React.FC<ClinicMenuProps> = ({ clinic, onDelete }) => {
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
      await apiClient.delete(`/auth/remove_clinic/${clinic.id}/`);
      onDelete({ msg: `Clinic ${clinic.name} deleted successfully`, status: 'success' });
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Failed to delete clinic:", error);
    }
  };

  return (
    <div ref={menuRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        aria-label="Clinic options"
      >
        <ThreeDotsIcon />
      </button>
      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded shadow-lg z-10">
          <button
            onClick={handleDelete}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            aria-label={`Delete clinic ${clinic.name}`}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};