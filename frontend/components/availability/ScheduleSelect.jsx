import React, { useState, useEffect, useRef } from 'react';
import { apiClient } from '@/utils/api';

const ScheduleSelect = ({ value, onChange, schedules: propSchedules = [], className }) => {
  const [schedules, setSchedules] = useState(propSchedules);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Only fetch if no schedules are provided via props
    if (propSchedules.length === 0) {
      setIsLoading(true);
      apiClient.get('/auth/schedules/')
        .then((response) => {
          setSchedules(response.data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching schedules:', err);
          setError('Failed to load schedules. Please try again.');
          setIsLoading(false);
        });
    }
  }, [propSchedules]);

  useEffect(() => {
    // Update local schedules if propSchedules changes
    setSchedules(propSchedules);
  }, [propSchedules]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const getSelectedScheduleText = () => {
    if (!value) return 'Select a schedule';
    const schedule = schedules.find((s) => s.id === parseInt(value));
    return schedule ? schedule.title : 'Select a schedule';
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <label htmlFor="scheduleInput" className="block text-sm font-medium text-gray-700 mb-1">
        Apply Schedule
      </label>
      <input
        id="scheduleInput"
        type="text"
        value={getSelectedScheduleText()}
        onClick={() => setIsOpen(true)}
        readOnly
        className="w-full border border-gray-300 rounded-md p-2 cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        disabled={isLoading}
      />
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-auto">
          <div
            onClick={() => {
              onChange('');
              setIsOpen(false);
            }}
            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${!value ? 'bg-blue-100' : ''}`}
          >
            Select a schedule
          </div>
          {schedules.length === 0 && !isLoading ? (
            <div className="px-4 py-2 text-gray-500">No schedules available</div>
          ) : (
            schedules.map((schedule) => (
              <div
                key={schedule.id}
                onClick={() => {
                  onChange(schedule.id.toString());
                  setIsOpen(false);
                }}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                  value === schedule.id.toString() ? 'bg-blue-100' : ''
                }`}
              >
                {schedule.title}
              </div>
            ))
          )}
        </div>
      )}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default ScheduleSelect;