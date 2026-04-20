import React, { useState, useEffect, useRef } from 'react';
import { apiClient } from '@/app/utils/api';
import type { ScheduleType } from './EditWeekScheduleModal';

export interface Schedule {
  id: number;
  title: string;
  hours: string[];
  place: number | null;
}

interface ScheduleSelectProps {
  value: string;
  onChange: (value: string) => void;
  schedules?: Schedule[]; // Optional: pass pre-fetched schedules
  className?: string;
}

const ScheduleSelect: React.FC<ScheduleSelectProps> = ({
  value,
  onChange,
  schedules: propSchedules = [],
  className = '',
}) => {
  const [schedules, setSchedules] = useState<Schedule[]>(propSchedules);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch schedules only if not provided via props
  // useEffect(() => {
  //   if (propSchedules.length === 0) {
  //     setIsLoading(true);
  //     setError(null);

  //     apiClient
  //       .get('/auth/schedules/')
  //       .then((response) => {
  //         console.log('Fetched schedules:', response.data);
  //         setSchedules(response.data.data || response.data);
  //       })
  //       .catch((err: any) => {
  //         console.error('Error fetching schedules:', err);
  //         setError('Failed to load schedules. Please try again.');
  //       })
  //       .finally(() => {
  //         setIsLoading(false);
  //       });
  //   }
  // }, [propSchedules.length]);

  // Sync with prop changes (e.g. when parent re-renders with new data)
  useEffect(() => {
    setSchedules(propSchedules);
  }, [propSchedules]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

  const getSelectedScheduleText = (): string => {
    if (!value) return 'Select a schedule';
    const schedule = schedules.find((s) => s.id === parseInt(value));
    return schedule && 'title' in schedule ? (schedule as any).title : 'Select a schedule';
  };

  const handleSelect = (scheduleId: string) => {
    onChange(scheduleId);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <label htmlFor="scheduleInput" className="block text-sm font-medium text-gray-700 mb-1">
        Apply Schedule
      </label>

      <input
        id="scheduleInput"
        type="text"
        value={isLoading ? 'Loading schedules...' : getSelectedScheduleText()}
        onClick={() => !isLoading && setIsOpen((prev) => !prev)}
        readOnly
        disabled={isLoading}
        className={`
          w-full border border-gray-300 rounded-md p-2 cursor-pointer
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          ${isLoading ? 'bg-gray-50 text-gray-500' : 'bg-white'}
          ${isLoading ? 'cursor-not-allowed' : ''}
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      />

      {isOpen && (
        <div
          className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
          role="listbox"
        >
          {/* Clear selection */}
          <div
            onClick={() => handleSelect('')}
            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm ${
              !value ? 'bg-blue-50 font-medium' : ''
            }`}
            role="option"
            aria-selected={!value}
          >
            None (Custom hours)
          </div>

          {/* Schedule options */}
          {schedules.length === 0 && !isLoading ? (
            <div className="px-4 py-2 text-gray-500 text-sm">No schedules available</div>
          ) : (
            schedules.map((schedule) => (
              <div
                key={schedule.id}
                onClick={() => handleSelect(schedule.id.toString())}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm ${
                  value === schedule.id.toString() ? 'bg-blue-50 font-medium' : ''
                }`}
                role="option"
                aria-selected={value === schedule.id.toString()}
              >
                {schedule.title}rrr
              </div>
            ))
          )}
        </div>
      )}

      {/* Error message */}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default ScheduleSelect;