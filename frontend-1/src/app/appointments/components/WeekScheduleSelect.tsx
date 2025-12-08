// components/ScheduleSelect.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { apiClient } from '@/app/utils/api';

interface Schedule {
  id: number;
  title: string;
  hours: string[];
  place?: number | null;
}

interface ScheduleSelectProps {
  value: string; // selected schedule ID as string (or empty)
  onChange: (value: string) => void;
  schedules?: Schedule[]; // optional: pass pre-fetched schedules
  className?: string;
  disabled?: boolean;
}

const ScheduleSelect: React.FC<ScheduleSelectProps> = ({
  value,
  onChange,
  schedules: propSchedules = [],
  className = '',
  disabled = false,
}) => {
  const [schedules, setSchedules] = useState<Schedule[]>(propSchedules);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch schedules only if not provided via props
  useEffect(() => {
    if (propSchedules.length > 0) {
      setSchedules(propSchedules);
      return;
    }

    setIsLoading(true);
    setError(null);

    apiClient
      .get('/auth/schedules/')
      .then((response) => {
        setSchedules(response.data);
      })
      .catch((err) => {
        console.error('Error fetching schedules:', err);
        setError('Failed to load schedules. Please try again.');
      })
      .finally(() => {
        setIsLoading(false);
      });
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

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const getSelectedScheduleText = (): string => {
    if (!value) return 'Select a schedule';
    const selected = schedules.find((s) => s.id.toString() === value);
    return selected?.title || 'Select a schedule';
  };

  const handleSelect = (scheduleId: string) => {
    onChange(scheduleId);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <label htmlFor="schedule-select" className="block text-sm font-medium text-gray-700 mb-1">
        Apply Schedule Template (Optional)
      </label>

      <div
        onClick={() => !disabled && !isLoading && setIsOpen(!isOpen)}
        className={`
          w-full px-4 py-3 border rounded-lg bg-white cursor-pointer
          transition-all duration-200
          ${disabled || isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:border-gray-400'}
          ${isOpen ? 'ring-2 ring-[#ee6c4d] border-[#ee6c4d]' : 'border-gray-300'}
        `}
      >
        <span className={value ? 'text-gray-900' : 'text-gray-500'}>
          {isLoading ? 'Loading schedules...' : getSelectedScheduleText()}
        </span>
      </div>

      {isOpen && (
        <div className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-64 overflow-y-auto">
          {/* Clear selection */}
          <div
            onClick={() => handleSelect('')}
            className={`
              px-4 py-3 cursor-pointer transition
              ${!value ? 'bg-orange-50 font-medium text-[#ee6c4d]' : 'hover:bg-gray-50'}
            `}
          >
            — No template —
          </div>

          {/* Schedule options */}
          {schedules.length === 0 && !isLoading ? (
            <div className="px-4 py-3 text-gray-500 italic">No schedules found</div>
          ) : (
            schedules.map((schedule) => (
              <div
                key={schedule.id}
                onClick={() => handleSelect(schedule.id.toString())}
                className={`
                  px-4 py-3 cursor-pointer transition
                  ${value === schedule.id.toString()
                    ? 'bg-[#ee6c4d] text-white font-medium'
                    : 'hover:bg-orange-50'
                  }
                `}
              >
                <div className="font-medium">{schedule.title}</div>
                <div className="text-xs opacity-80 mt-1">
                  {schedule.hours.length} hours
                  {schedule.place ? ' • Has clinic' : ''}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Error message */}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default ScheduleSelect;