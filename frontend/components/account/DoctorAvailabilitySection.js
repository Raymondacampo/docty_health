'use client';

import React, { useState, useEffect, useRef } from 'react';
import { apiClient } from '@/utils/api'; // Import apiClient
import EditAvailabilityForm from './EditAvailabilityForm';
import DoctorAvailabilityManager from './DoctorAvailabilityManager';

const DoctorAvailabilitySection = ({ user, onReload }) => {
  const [showMenu, setShowMenu] = useState(null);
  const [editAvailability, setEditAvailability] = useState(null);
  const menuRef = useRef(null);

  const handleDelete = async (availabilityId) => {
    try {
      await apiClient.delete(`/auth/delete_availability/${availabilityId}/`);
      onReload();
      setShowMenu(null);
    } catch (err) {
      console.error('Failed to delete availability:', err);
    }
  };

  if (!user.is_doctor ) {
    return null;
  }

  useEffect(() => {
    console.log(user.availabilities.length)
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(null);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div className="w-full rounded-[10px] flex-col justify-start items-start gap-6 inline-flex">
      <div className="self-stretch rounded-[10px] flex-col justify-start items-start gap-4 flex">
        {user.availabilities.length > 0 && user.availabilities.map((availability) => (
          <div
            key={availability.id}
            className="w-full px-4 py-2 bg-[#98c1d1]/25 rounded-[10px] justify-between items-center gap-2.5 flex"
          >
            <div className="text-black text-sm font-normal font-['Inter']">
            {availability.virtual
                ? `Virtual - ${availability.days.map(d => d.name).join(', ')} - ${availability.start_time} to ${availability.end_time} (${availability.slot_duration} min)`
                : `${availability.clinic.name} - ${availability.specialization.name} - ${availability.days.map(d => d.name).join(', ')} - ${availability.start_time} to ${availability.end_time} (${availability.slot_duration} min)`}
            </div>
            <div className="relative">
              <button
                onClick={() => setShowMenu(showMenu === availability.id ? null : availability.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                aria-label="Availability options"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="3" cy="8" r="1.5" fill="black" />
                  <circle cx="8" cy="8" r="1.5" fill="black" />
                  <circle cx="13" cy="8" r="1.5" fill="black" />
                </svg>
              </button>
              {showMenu === availability.id && (
                <div ref={menuRef} className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded shadow-lg z-10">
                  <button
                    onClick={() => { setEditAvailability(availability); setShowMenu(null); }}
                    className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(availability.id)}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        <DoctorAvailabilityManager user={user} onReload={onReload} />
      </div>
      {editAvailability && (
        <EditAvailabilityForm
          availability={{ ...editAvailability, user }}
          onClose={() => setEditAvailability(null)}
          onUpdate={onReload}
        />
      )}
    </div>
  );
};

export default DoctorAvailabilitySection;