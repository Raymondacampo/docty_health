// components/modals/CreateWeekScheduleModal.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { addDays, format } from 'date-fns';
// import { formatInTimeZone } from 'date-fns-tz';
import { apiClient } from '@/app/utils/api';
import ClinicSearchBar from './ClinicSearchBar';
import ScheduleSelect from './WeekScheduleSelect';
import { useAlert } from '@/app/context/AlertContext';


interface Clinic {
  id: string | number;
  name: string;
}

interface Schedule {
  id: number;
  title: string;
  hours: string[];
  place?: number | null;
}

interface WeekOption {
  label: string;
  start: Date;
  end: Date;
  original: string;
}

interface WeekDayConfig {
  day: string; // 'yyyy-MM-dd'
  hours: string[];
  place: Clinic | null;
}

interface CreateWeekScheduleModalProps {
  onScheduleCreated: (data: any) => void;
  onCreate?: () => void;
}

const CreateWeekScheduleModal: React.FC<CreateWeekScheduleModalProps> = ({ onScheduleCreated, onCreate = () => {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [weekDays, setWeekDays] = useState<WeekDayConfig[]>([]);
  const [showActionButtons, setShowActionButtons] = useState(false);
  const [selectedHours, setSelectedHours] = useState<string[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<string>('');
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [availableWeeks, setAvailableWeeks] = useState<WeekOption[]>([]);
  const [isLoadingWeeks, setIsLoadingWeeks] = useState(false);
  const [weekError, setWeekError] = useState<string | null>(null);
  const [availabilityType, setAvailabilityType] = useState<'virtual' | 'in-person'>('virtual');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { showAlert } = useAlert();

  const hoursOfDay = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  useEffect(() => {
    if (isOpen) {
      // Bloquea el scroll al abrir
      document.body.style.overflow = 'hidden';
    } else {
      // Lo restaura al cerrar
      document.body.style.overflow = 'unset';
    }

    // "Cleanup function": Se asegura de restaurar el scroll 
    // si el componente se desmonta inesperadamente
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Fetch data when modal opens
  useEffect(() => {
    if (!isOpen) return;

    // Fetch schedules
    setIsLoadingSchedules(true);
    apiClient.get('/auth/schedules/')
      .then(res => {
        // Map 'name' to 'title' for compatibility
        console.log('Fetched schedules:', res.data);
        const mappedSchedules = res.data.map((s: any) => ({
          ...s        }));
        setSchedules(mappedSchedules);
      })
      .catch(err => {
        console.error(err);
        setScheduleError('Failed to load schedules.');
      })
      .finally(() => setIsLoadingSchedules(false));

    // Fetch available weeks
    setIsLoadingWeeks(true);
    apiClient.get('/auth/available-weeks/')
      .then(res => {
        console.log('Fetched available weeks:', res.data);
        const weeks: WeekOption[] = res.data.available_weeks.map((weekStr: string) => {
          // const [year, month, day] = weekStr.split('-').map(Number);
          // const date = new Date(Date.UTC(year, month - 1, day));
          const date = new Date(weekStr + 'T00:00:00');
          const label = `Week of ${date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}`;
          // const label = `Week of ${date.toLocaleDateString('en-US', {
          //       timeZone: 'UTC',
          //       month: 'long',
          //       day: 'numeric',
          //       year: 'numeric'
          //       })}`;
          return {
            label: label,
            start: date,
            end: addDays(date, 6),
            original: weekStr,
          };
        });
        setAvailableWeeks(weeks);
      })
      .catch(err => {
        const msg = err.response?.data?.error || 'Failed to load weeks.';
        setWeekError(msg);
      })
      .finally(() => setIsLoadingWeeks(false));
  }, [isOpen]);

  const resetForm = () => {
    setIsOpen(false);
    setSelectedWeek(null);
    setSelectedDay(null);
    setWeekDays([]);
    setShowActionButtons(false);
    setSelectedHours([]);
    setSelectedClinic(null);
    setSelectedSchedule('');
    setScheduleError(null);
    setSaveError(null);
    setSaveSuccess(null);
    setIsDropdownOpen(false);
    setWeekError(null);
  };

  const handleWeekSelect = (index: number) => {
    setSelectedWeek(index);
    setSelectedDay(null);
    setWeekDays([]);
    setShowActionButtons(false);
    setSelectedHours([]);
    setSelectedClinic(null);
    setSelectedSchedule('');
    setIsDropdownOpen(false);
  };

const getSelectedWeekText = () => {
    if (selectedWeek === null) return 'Select a week';
    if (isLoadingWeeks) return 'Loading weeks...';
    if (weekError) return 'Error loading weeks';
    const week = availableWeeks[selectedWeek];
    // This uses the stored Date objects, which is correct.
    return week
      ? `${week.label} (${format(week.start, 'MMMM do, yyyy')} - ${format(week.end, 'MMMM do, yyyy')})`
      : 'Select a week';
  };

  const getDaysForWeek = (startDate: Date) => {
    return Array.from({ length: 7 }, (_, i) => {
      const day = addDays(startDate, i);
      return {
        fullName: format(day, 'EEEE'),
        initials: format(day, 'EEE').toUpperCase(),
        label: format(day, 'EEEE, MMMM do'),
        date: format(day, 'yyyy-MM-dd'),
        dateObj: day, // <-- NEW: The actual Date object for display formatting
      };
    });
  };

  const handleDayClick = (date: string) => {
    setSelectedDay(date);
    const existing = weekDays.find(wd => wd.day === date);
    setSelectedHours(existing?.hours || []);
    setSelectedClinic(existing?.place || null);
    setSelectedSchedule('');
    setShowActionButtons(true);
  };

  const handleScheduleSelect = async (scheduleId: string) => {
    setSelectedSchedule(scheduleId);
    if (!scheduleId) {
      setSelectedHours([]);
      setSelectedClinic(null); // Force virtual
      return;
    }

    const schedule = schedules.find(s => s.id === Number(scheduleId));
    if (!schedule) return;

    setSelectedHours(schedule.hours);

    // Only auto-set clinic if we're in "In Person" mode
    if (selectedClinic !== null || schedule.place === null) {
      // If already in person, or no change needed
      // Or if template has no place, stay virtual
      if (schedule.place) {
        try {
          const res = await apiClient.get(`/clinics/${schedule.place}/`);
          setSelectedClinic({ id: res.data.id, name: res.data.name });
        } catch (err) {
          console.error(err);
        }
      } else {
        setSelectedClinic(null);
      }
    }
    // If user is in Virtual mode, do nothing — keep clinic null even if template has one
  };
  const handleHourToggle = (hour: string) => {
    setSelectedHours(prev =>
      prev.includes(hour)
        ? prev.filter(h => h !== hour)
        : [...prev, hour].sort()
    );
  };

  const handleClinicChange = (clinic: Clinic) => {
    setSelectedClinic(clinic);
  };

  const handleDoneAction = () => {
    if (selectedDay && selectedHours.length > 0) {
      setWeekDays(prev => {
        const filtered = prev.filter(wd => wd.day !== selectedDay);
        return [...filtered, {
          day: selectedDay,
          hours: selectedHours,
          place: selectedClinic // will be null if virtual
        }];
      });

      // Reset
      setSelectedDay(null);
      setSelectedHours([]);
      setSelectedClinic(null);
      setSelectedSchedule('');
      setShowActionButtons(false);
    }
  };

  const handleRemoveAction = () => {
    if (selectedDay) {
      setWeekDays(prev => prev.filter(wd => wd.day !== selectedDay));
      setSelectedDay(null);
      setSelectedHours([]);
      setSelectedClinic(null);
      setSelectedSchedule('');
      setShowActionButtons(false);
    }
  };

  const handleSaveSchedule = async () => {
    if (selectedWeek === null || weekDays.length === 0) {
      setSaveError('Please select a week and configure at least one day.');
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const weekStart = availableWeeks[selectedWeek].start.toLocaleDateString('en-US', {
        timeZone: 'UTC',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      const payload = {
        week: weekStart,
        weekdays: weekDays.map(day => ({
          day: day.day,
          hours: day.hours,
          place: day.place?.id || null,
        })),
      };

      const res = await apiClient.post('/auth/weekschedule/', payload);
      setSaveSuccess('Week schedule created successfully!');
      onScheduleCreated(res.data);
      resetForm();
    } catch (err: any) {
      showAlert(err.response?.data?.error || 'Failed to create schedule', 'error');
      setSaveError('Failed to create schedule. Please try again.');
    } finally {
      setIsSaving(false);
      showAlert('Week schedule created', 'success');
      onCreate();
    }
  };

  // ... rest of return JSX stays almost identical (only minor cleanup)

return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 bg-[#060648] text-white font-medium rounded-lg hover:bg-[#060648]/90 transition"
      >
        + Create Week Schedule
      </button>

      {/* Modal backdrop & content */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            // Updated class names for flex layout to separate content and footer
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl h-[80dvh] max-h-[90vh] mx-4 flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={resetForm}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
            >
              <XMarkIcon className="h-7 w-7" />
            </button>

            {/* --- SCROLLABLE CONTENT AREA --- */}
            <div className="flex-grow overflow-y-auto p-8 pb-4"> 
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Week Schedule</h2>

              {/* Week Selector */}
              <div className="relative" ref={dropdownRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Week</label>
                <div
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 cursor-pointer bg-white hover:border-gray-400 transition"
                >
                  {getSelectedWeekText()}
                </div>

                {isDropdownOpen && (
                  <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto z-20">
                    {availableWeeks.map((week, i) => (
                      <div
                        key={i}
                        onClick={() => handleWeekSelect(i)}
                        className={`px-4 py-3 cursor-pointer ${
                          selectedWeek === i ? 'bg-[#060648] text-white hover:bg-[#060648]/80' : 'hover:bg-blue-50 '
                        }`}
                      >
                        {week.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Days Grid */}
              {selectedWeek !== null && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Configure Days</h3>
                  <div className="grid grid-cols-7 gap-3">
                    {getDaysForWeek(availableWeeks[selectedWeek].start).map(day => {
                      const isConfigured = weekDays.some(wd => wd.day === day.date);
                      const isSelected = selectedDay === day.date;

                      return (
                        <button
                          key={day.date}
                          onClick={() => handleDayClick(day.date)}
                          className={`
                            py-3 px-4 rounded-lg font-medium transition
                            ${isSelected || isConfigured ? 'bg-[#060648] text-white' : 'bg-gray-100 hover:bg-gray-200'}
                          `}
                        >
                          <div className="hidden sm:block">{day.initials}</div>
                          {/* <div className="sm:hidden text-xs">{day.initials}</div> */}
                          <div className="text-xs mt-1 opacity-80">{format(day.dateObj, 'MMM d')}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Action Panel */}
              {showActionButtons && selectedDay && (
                <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                  <h4 className="font-semibold text-lg mb-4">
                    {getDaysForWeek(availableWeeks[selectedWeek!].start).find(d => d.date === selectedDay)?.label}
                  </h4>

                  <ScheduleSelect
                    value={selectedSchedule}
                    onChange={handleScheduleSelect}
                    schedules={schedules}
                  />

                  <div className="mt-5">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Availability Type
                    </label>

                    <div className="flex gap-8 mb-5">
                      <label className="flex items-center cursor-pointer select-none">
                        <input
                          type="radio"
                          name="availabilityType"
                          checked={availabilityType === 'virtual'}
                          onChange={() => {
                            setAvailabilityType('virtual');
                            setSelectedClinic(null); // Clear clinic when switching to virtual
                          }}
                          className="w-4 h-4 text-[#060648] focus:ring-[#060648]"
                        />
                        <span className="ml-2 font-medium">Virtual</span>
                      </label>

                      <label className="flex items-center cursor-pointer select-none">
                        <input
                          type="radio"
                          name="availabilityType"
                          checked={availabilityType === 'in-person'}
                          onChange={() => setAvailabilityType('in-person')}
                          className="w-4 h-4 text-[#060648] focus:ring-[#060648]"
                        />
                        <span className="ml-2 font-medium">In Person</span>
                      </label>
                    </div>

                    {/* Only show clinic search when In Person is selected */}
                    {availabilityType === 'in-person' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Clinic
                        </label>
                        <div className='relative'>
                          <ClinicSearchBar
                            value={selectedClinic}
                            onChange={handleClinicChange}
                            round="rounded-lg"
                          />                          
                        </div>

                        {selectedClinic === null && (
                          <p className="text-amber-600 text-xs mt-2">
                            No clinic selected yet
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-5">
                    <label className="block text-sm font-medium mb-3">Available Hours</label>
                    <div className="grid grid-cols-6 gap-3 max-h-64 overflow-y-auto p-4 bg-white rounded-lg border">
                      {hoursOfDay.map(hour => (
                        <label key={hour} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedHours.includes(hour)}
                            onChange={() => handleHourToggle(hour)}
                            className="rounded text-[#ee6c4d] focus:ring-[#ee6c4d]"
                          />
                          <span className="text-sm">{hour}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <button onClick={() => setShowActionButtons(false)} className="px-5 py-2 border rounded-lg hover:bg-gray-100">
                      Cancel
                    </button>
                    <button onClick={handleRemoveAction} className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                      Remove Day
                    </button>
                    <button
                      onClick={handleDoneAction}
                      disabled={selectedHours.length === 0}
                      className="px-6 py-2 bg-[#060648] text-white rounded-lg hover:bg-[#060648]/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
              {/* Messages - placed inside scrollable area */}
              {saveSuccess && <p className="text-green-600 mt-4 text-center font-medium">{saveSuccess}</p>}
              {saveError && <p className="text-red-600 mt-4 text-center">{saveError}</p>}
            </div> 
            {/* --- END SCROLLABLE CONTENT AREA --- */}

            {/* --- STICKY FOOTER --- */}
            <div className="p-4 border-t border-gray-200 bg-white sticky bottom-0 z-30"> 
              <div className="flex justify-end gap-4">
                <button
                  onClick={resetForm}
                  className="px-6 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSchedule}
                  disabled={isSaving || selectedWeek === null || weekDays.length === 0}
                  className="px-8 py-3 bg-[#060648] text-white font-medium rounded-lg hover:bg-[#060648]/90 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Week Schedule'}
                </button>
              </div>
            </div>
            {/* --- END STICKY FOOTER --- */}

          </div>
        </div>
      )}
    </div>
  );
};

export default CreateWeekScheduleModal;