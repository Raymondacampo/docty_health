import React, { useState, useEffect, useRef } from 'react';

// Three Dots Icon Component (reused)
const ThreeDotsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="3" cy="8" r="1.5" fill="black" />
      <circle cx="8" cy="8" r="1.5" fill="black" />
      <circle cx="13" cy="8" r="1.5" fill="black" />
  </svg>
);

export const ClinicMenu = ({ clinic, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null); // Ref to track the menu container

  // Handle clicks outside the menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    // Add event listener when menu is open
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]); // Dependency array includes isMenuOpen

  const handleDelete = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await fetch(
        `http://localhost:8000/api/auth/remove_clinic/${clinic.id}/`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete clinic');
      }

      // On success, call the onDelete callback to update the parent component
      onDelete(clinic.id);
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Failed to delete clinic:", error);
      // Optionally, add user-facing error handling here (e.g., alert)
    }
  };

  return (
    <div ref={menuRef} style={{ position: 'relative', display: 'inline-block'}}>
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
            aria-label={`Delete clinic ${clinic}`}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};