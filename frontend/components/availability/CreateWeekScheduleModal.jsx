import React, { useState, useEffect, useRef } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { addDays, format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { apiClient } from '@/utils/api';
import ClinicSearchBar from '../search/ClinicSearchBar';
import ScheduleSelect from './ScheduleSelect';

const CreateWeekScheduleModal = ({ onScheduleCreated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [weekDays, setWeekDays] = useState([]);
  const [showActionButtons, setShowActionButtons] = useState(false);
  const [selectedHours, setSelectedHours] = useState([]);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);
  const [scheduleError, setScheduleError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(null);
  const [availableWeeks, setAvailableWeeks] = useState([]);
  const [isLoadingWeeks, setIsLoadingWeeks] = useState(false);
  const [weekError, setWeekError] = useState(null);
  const dropdownRef = useRef(null);

  const hoursOfDay = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

  const handleDropdownClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  const resetForm = () => {
    setIsOpen(false);
    setSelectedWeek(null);
    setSelectedDay(null);
    setWeekDays([]);
    setShowActionButtons(false);
    setSelectedHours([]);
    setSelectedClinic(null);
    setSelectedSchedule('');
    setSchedules([]);
    setScheduleError(null);
    setSaveError(null);
    setSaveSuccess(null);
    setIsDropdownOpen(false);
    setWeekError(null);
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleDropdownClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleDropdownClickOutside);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    if (isOpen) {
      // Fetch schedules
      setIsLoadingSchedules(true);
      apiClient.get('/auth/schedules/')
        .then((response) => {
          setSchedules(response.data);
          setIsLoadingSchedules(false);
        })
        .catch((error) => {
          console.error('Error fetching schedules:', error);
          setScheduleError('Failed to load schedules. Please try again.');
          setIsLoadingSchedules(false);
        });

      // Fetch available weeks
      setIsLoadingWeeks(true);
      apiClient.get('/auth/available-weeks/')
        .then((response) => {
          const weeks = response.data.available_weeks.map((weekStr) => {
            // Parse YYYY-MM-DD manually to ensure UTC
            const [year, month, day] = weekStr.split('-').map(Number);
            const rawDate = new Date(Date.UTC(year, month - 1, day)); // month is 0-based
            return {
              label: `Week of ${formatInTimeZone(rawDate, 'UTC', 'MMMM do, yyyy')}`,
              start: rawDate,
              end: new Date(Date.UTC(year, month - 1, day + 6)),
              original: weekStr, // Store original string for debugging
            };
          });
          setAvailableWeeks(weeks);
          setIsLoadingWeeks(false);
        })
        .catch((error) => {
          console.error('Error fetching available weeks:', error);
          const errorMessage = error.response?.data?.error || 'Failed to load available weeks. Please try again.';
          setWeekError(errorMessage);
          setIsLoadingWeeks(false);
        });
    }
  }, [isOpen]);

  const handleWeekSelect = (weekIndex) => {
    setSelectedWeek(weekIndex);
    setSelectedDay(null);
    setWeekDays([]);
    setShowActionButtons(false);
    setSelectedHours([]);
    setSelectedClinic(null);
    setSelectedSchedule('');
    setIsDropdownOpen(false);
    setSaveError(null);
    setSaveSuccess(null);
  };

  const getSelectedWeekText = () => {
    if (selectedWeek === null) return 'Select a week';
    if (isLoadingWeeks) return 'Loading weeks...';
    if (weekError) return 'Error loading weeks';
    const week = availableWeeks[selectedWeek];
    return week ? `${week.label} (${formatInTimeZone(week.start, 'UTC', 'MMMM do')} to ${formatInTimeZone(week.end, 'UTC', 'MMMM do')})` : 'Select a week';
  };

  const getDaysForWeek = (weekStart) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = addDays(weekStart, i);
      days.push({
        fullName: formatInTimeZone(day, 'UTC', 'EEEE'),
        initials: formatInTimeZone(day, 'UTC', 'EEE').toUpperCase(),
        label: formatInTimeZone(day, 'UTC', 'EEEE, MMMM do'),
        date: format(day, 'yyyy-MM-dd'),
      });
    }
    return days;
  };

  const handleDayClick = (date) => {
    setSelectedDay(date);
    const existingDay = weekDays.find((wd) => wd.day === date);
    setSelectedHours(existingDay ? existingDay.hours : []);
    setSelectedClinic(existingDay ? existingDay.place : null);
    setSelectedSchedule('');
    setShowActionButtons(true);
    setSaveError(null);
    setSaveSuccess(null);
  };

  const handleScheduleSelect = async (scheduleId) => {
    setSelectedSchedule(scheduleId);
    if (!scheduleId) {
      setSelectedHours([]);
      setSelectedClinic(null);
      return;
    }

    try {
      const schedule = schedules.find((s) => s.id === parseInt(scheduleId));
      if (!schedule) return;

      setSelectedHours(schedule.hours);

      if (schedule.place) {
        const response = await apiClient.get(`/clinics/${schedule.place}/`);
        const clinic = response.data;
        setSelectedClinic({ id: clinic.id, name: clinic.name });
      } else {
        setSelectedClinic(null);
      }
    } catch (error) {
      console.error('Error applying schedule or fetching clinic:', error);
      setScheduleError('Failed to load schedule or clinic details. Please try again.');
      setSelectedClinic(null);
    }
  };

  const handleHourChange = (hour) => {
    setSelectedHours((prev) =>
      prev.includes(hour)
        ? prev.filter((h) => h !== hour)
        : [...prev, hour].sort()
    );
  };

  const handleClinicChange = (clinic) => {
    setSelectedClinic(clinic ? { id: clinic.id, name: clinic.name } : null);
  };

  const handleCancelAction = () => {
    setSelectedDay(null);
    setSelectedHours([]);
    setSelectedClinic(null);
    setSelectedSchedule('');
    setShowActionButtons(false);
  };

  const handleDoneAction = () => {
    if (selectedHours.length === 0) return;
    setWeekDays((prev) => {
      const existingIndex = prev.findIndex((wd) => wd.day === selectedDay);
      const newEntry = {
        day: selectedDay,
        hours: selectedHours,
        place: selectedClinic
      };
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newEntry;
        return updated;
      }
      return [...prev, newEntry];
    });
    setSelectedDay(null);
    setSelectedHours([]);
    setSelectedClinic(null);
    setSelectedSchedule('');
    setShowActionButtons(false);
  };

  const handleRemoveAction = () => {
    setWeekDays((prev) => prev.filter((wd) => wd.day !== selectedDay));
    setSelectedDay(null);
    setSelectedHours([]);
    setSelectedClinic(null);
    setSelectedSchedule('');
    setShowActionButtons(false);
  };

  const handleSaveSchedule = async () => {
    if (selectedWeek === null || weekDays.length === 0) {
      setSaveError('Please select a week and at least one day.');
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      const weekDate = formatInTimeZone(availableWeeks[selectedWeek].start, 'UTC', 'yyyy-MM-dd');
      const data = {
        week: weekDate,
        weekdays: weekDays.map((day) => ({
          day: day.day,
          hours: day.hours,
          place: day.place ? day.place.id : null
        }))
      };

      const response = await apiClient.post('/auth/weekschedule/', data);
      setSaveSuccess('Week schedule saved successfully!');
      onScheduleCreated(response.data); 
      console.log(response.data)
      resetForm();
    } catch (error) {
      console.error('Error saving week schedule:', error);
      const errorMessage = error.response?.data?.error || 'Failed to save week schedule. Please try again.';
      setSaveError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-[#ee6c4d] text-white rounded-md transition-colors"
      >
        Create Week Schedule
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative bg-white shadow-xl p-6 w-full max-w-xl 
          sm:mx-4 sm:rounded-lg sm:w-auto sm:h-auto
          xs:h-screen xs:w-full ">
            <button
              onClick={resetForm}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              aria-label="Close modal"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            <h2 className="text-2xl font-semibold mb-4">Create Week Schedule</h2>
            <div className="space-y-4">
              <div className="relative" ref={dropdownRef}>
                <label htmlFor="weekInput" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Week
                </label>
                <input
                  id="weekInput"
                  type="text"
                  value={getSelectedWeekText()}
                  onClick={() => setIsDropdownOpen(true)}
                  readOnly
                  className="w-full border border-gray-300 rounded-md p-2 cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {isDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-auto">
                    {isLoadingWeeks ? (
                      <div className="px-4 py-2 text-gray-500">Loading weeks...</div>
                    ) : weekError ? (
                      <div className="px-4 py-2 text-red-500">{weekError}</div>
                    ) : availableWeeks.length === 0 ? (
                      <div className="px-4 py-2 text-gray-500">No available weeks</div>
                    ) : (
                      availableWeeks.map((week, index) => (
                        <div
                          key={index}
                          onClick={() => handleWeekSelect(index)}
                          className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                            selectedWeek === index ? 'bg-[#ee6c4d]' : ''
                          }`}
                        >
                          {`${week.label} (${formatInTimeZone(week.start, 'UTC', 'MMMM do')} to ${formatInTimeZone(week.end, 'UTC', 'MMMM do')})`}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {weekError && (
                <p className="text-red-500 text-sm mt-2">{weekError}</p>
              )}

              {selectedWeek !== null && (
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Select Days</h3>
                  <div className="flex flex-wrap gap-2">
                    {getDaysForWeek(availableWeeks[selectedWeek].start).map((day) => (
                      <button
                        key={day.date}
                        onClick={() => handleDayClick(day.date)}
                        className={`px-3 py-1 rounded-md transition-colors ${
                          selectedDay === day.date
                            ? 'bg-[#ee6c4d] text-white'
                            : weekDays.some((wd) => wd.day === day.date)
                            ? 'bg-[#ee6c4d] text-white border-2 border-[#ee6c4d]'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        <span className="sm:hidden">{day.initials}</span>
                        <span className="hidden sm:block">{day.fullName}</span>
                      </button>
                    ))}
                  </div>
                  {showActionButtons && (
                    <div className="mt-4 border p-4 rounded-lg">
                      <p className="text-gray-700 mb-2">
                        {getDaysForWeek(availableWeeks[selectedWeek].start).find((d) => d.date === selectedDay)?.label}
                      </p>
                      <ScheduleSelect
                        value={selectedSchedule}
                        onChange={handleScheduleSelect}
                        schedules={schedules}
                        className="mb-4"
                      />
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Clinic (Optional)
                        </label>
                        <ClinicSearchBar
                          restrictToDoctorClinics={true}
                          value={selectedClinic?.name || ''}
                          onChange={handleClinicChange}
                          initialClinic={selectedClinic}
                          key={selectedClinic?.id || 'empty'}
                          round="rounded-md"
                        />
                      </div>
                      {scheduleError && (
                        <p className="text-red-500 text-sm mb-4">{scheduleError}</p>
                      )}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Hours
                        </label>
                        <div className="grid grid-cols-4 gap-2 max-h-40 overflow-auto">
                          {hoursOfDay.map((hour) => (
                            <label key={hour} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedHours.includes(hour)}
                                onChange={() => handleHourChange(hour)}
                                className="mr-2"
                              />
                              {hour}
                            </label>
                          ))}
                        </div>
                        {selectedHours.length === 0 && (
                          <p className="text-red-500 text-sm mt-2">Please select at least one hour.</p>
                        )}
                      </div>
                      <div className="flex justify-end gap-2 xs:relative ">
                        <button
                          onClick={handleCancelAction}
                          className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleRemoveAction}
                          className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                          Remove
                        </button>
                        <button
                          onClick={handleDoneAction}
                          disabled={selectedHours.length === 0}
                          className={`px-3 py-1 rounded-md ${
                            selectedHours.length === 0
                              ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                              : 'bg-blue-600 text-white'
                          }`}
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {saveSuccess && (
              <p className="text-green-500 text-sm mt-4">{saveSuccess}</p>
            )}
            {saveError && (
              <p className="text-red-500 text-sm mt-4">{saveError}</p>
            )}
            {!showActionButtons && (
              <div className="mt-6 flex justify-end gap-4 
                sm:static
                xs:absolute xs:bottom-4 xs:left-0 xs:w-full xs:px-4">
                <button
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSchedule}
                  disabled={isSaving || selectedWeek === null || weekDays.length === 0}
                  className={`px-4 py-2 rounded-md ${
                    isSaving || selectedWeek === null || weekDays.length === 0
                      ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                      : 'bg-[#ee6c4d] text-white'
                  }`}
                >
                  {isSaving ? 'Saving...' : 'Save Schedule'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateWeekScheduleModal;