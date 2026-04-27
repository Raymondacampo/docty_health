import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { addDays, format } from 'date-fns';
import { apiClient } from '@/app/utils/api';
import ClinicSearchBar from './ClinicSearchBar';
import ScheduleSelect from './WeekScheduleSelect';
import type { Clinic } from './ScheduleCreationModal';

interface ClinicType {
  id: number;
  name: string;
}

export type ScheduleType = {
  id: number;
  title: string;
  hours: string[];
  place: number | null;
}

interface WeekdayEntry {
  day: string;
  hours: string[];
  place: Clinic | null;
}

interface WeekAvailability {
  id: number;
  week: string;
}

interface WeekScheduleData {
  week_availability: WeekAvailability;
  weekdays: Array<{
    day: string;
    hours: string[];
    place: number | null;
  }>;
  clinics: Record<number, string>;
}

interface EditWeekScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheduleData: WeekScheduleData | null;
  onUpdate: (updatedData: any) => void;
  onActionComplete: (payload: { message: string; status: 'success' | 'error' }) => void;
}

export default function EditWeekScheduleModal({
  isOpen,
  onClose,
  scheduleData,
  onUpdate,
  onActionComplete,
}: EditWeekScheduleModalProps) {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [weekDays, setWeekDays] = useState<WeekdayEntry[]>([]);
  const [showActionButtons, setShowActionButtons] = useState(false);
  const [selectedHours, setSelectedHours] = useState<string[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<string>('');
  const [schedules, setSchedules] = useState<ScheduleType[]>([]);
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const hoursOfDay = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

  const resetForm = () => {
    onClose();
    setSelectedDay(null);
    setWeekDays([]);
    setShowActionButtons(false);
    setSelectedHours([]);
    setSelectedClinic(null);
    setSelectedSchedule('');
    setScheduleError(null);
    setSaveError(null);
    setSaveSuccess(null);
  };

  useEffect(() => {
    if (isOpen && scheduleData) {
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

      const formattedWeekDays: WeekdayEntry[] = scheduleData.weekdays.map(wd => ({
        day: wd.day,
        hours: wd.hours,
        place: wd.place ? { id: wd.place, name: scheduleData.clinics[wd.place] || 'Unknown Clinic' } : null,
      }));
      scheduleData.weekdays.map(wd => {
      });
      setWeekDays(formattedWeekDays);
    }
  }, [isOpen, scheduleData]);

  const parseDateString = (dateStr: string): Date => {
  // Safely handles "2025-04-07" or "2025-04-07T00:00:00Z"
  return new Date(dateStr.split('T')[0]);
};

    const getWeekDisplayText = (): string => {
    if (!scheduleData?.week_availability?.week) return '';

    const start = parseDateString(scheduleData.week_availability.week);
    const end = addDays(start, 6);

    const startFormatted = format(start, 'MMMM do, yyyy');
    const rangeFormatted = `${format(start, 'MMMM do')} to ${format(end, 'MMMM do')}`;

    return `Week of ${startFormatted} (${rangeFormatted})`;
    };

  const getDaysForWeek = (weekStart: Date) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = addDays(weekStart, i);
      days.push({
        fullName: format(day, 'EEEE'),
        initials: format(day, 'EEE').toUpperCase(),
        label: format(day, 'EEEE, MMMM do'),
        date: format(day, 'yyyy-MM-dd'),
      });
    }
    return days;
  };

  const handleDayClick = (date: string) => {
    setSelectedDay(date);
    const existingDay = weekDays.find((wd) => wd.day === date);
    setSelectedHours(existingDay ? existingDay.hours : []);
    setSelectedClinic(existingDay ? existingDay.place : null);
    setSelectedSchedule('');
    setShowActionButtons(true);
    setSaveError(null);
    setSaveSuccess(null);
  };

  const handleScheduleSelect = async (scheduleId: string) => {
    setSelectedSchedule(scheduleId);
    if (!scheduleId) {
      setSelectedHours([]);
      setSelectedClinic(null);
      return;
    }

    const schedule = schedules.find((s) => s.id === parseInt(scheduleId));
    if (!schedule) return;

    setSelectedHours(schedule.hours);
    if (schedule.place) {
      try {
        const response = await apiClient.get(`/clinics/${schedule.place}/`);
        setSelectedClinic({ id: response.data.id, name: response.data.name });
      } catch (error) {
        console.error('Error fetching clinic:', error);
      }
    } else {
      setSelectedClinic(null);
    }
  };

  const handleHourChange = (hour: string) => {
    setSelectedHours((prev) =>
      prev.includes(hour)
        ? prev.filter((h) => h !== hour)
        : [...prev, hour].sort()
    );
  };

  const handleClinicChange = (clinic: Clinic) => {
    setSelectedClinic(clinic);
  };

  const handleCancelAction = () => {
    setSelectedDay(null);
    setSelectedHours([]);
    setSelectedClinic(null);
    setSelectedSchedule('');
    setShowActionButtons(false);
  };

  const handleDoneAction = () => {
    if (selectedHours.length === 0 || !selectedDay) return;

    setWeekDays((prev) => {
      const existingIndex = prev.findIndex((wd) => wd.day === selectedDay);
      const newEntry: WeekdayEntry = {
        day: selectedDay,
        hours: selectedHours,
        place: selectedClinic,
      };
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newEntry;
        return updated;
      }
      return [...prev, newEntry];
    });

    handleCancelAction();
  };

  const handleRemoveAction = () => {
    if (!selectedDay) return;
    setWeekDays((prev) => prev.filter((wd) => wd.day !== selectedDay));
    handleCancelAction();
  };

  const handleSaveSchedule = async () => {
    if (weekDays.length === 0) {
      const msg = 'Please select at least one day.';
      setSaveError(msg);
      onActionComplete({ message: msg, status: 'error' });
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const data = {
        week_availability_id: scheduleData?.week_availability.id,
        week: scheduleData?.week_availability.week,
        weekdays: weekDays.map((day) => ({
          day: day.day,
          hours: day.hours,
          place: day.place?.id || null,
        })),
      };

      const response = await apiClient.put('/auth/weekschedule/', data);
      setSaveSuccess('Week schedule updated successfully!');
      onUpdate(response.data);
      onActionComplete({ message: 'Week schedule updated successfully!', status: 'success' });
      resetForm();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to update week schedule.';
      setSaveError(errorMessage);
      onActionComplete({ message: errorMessage, status: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen || !scheduleData) return null;

const weekStartDate = scheduleData?.week_availability?.week
  ? parseDateString(scheduleData.week_availability.week)
  : new Date();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white shadow-xl p-6 w-full max-w-xl sm:mx-4 sm:rounded-lg xs:h-screen xs:w-full">
        <button
          onClick={resetForm}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          aria-label="Close modal"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-semibold mb-4">Edit Week Schedule</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Week</label>
            <div className="w-full border border-gray-300 rounded-md p-2 bg-gray-50">
              {getWeekDisplayText()}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Select Days</h3>
            <div className="flex flex-wrap gap-2">
              {getDaysForWeek(weekStartDate).map((day) => (
                <button
                  key={day.date}
                  onClick={() => handleDayClick(day.date)}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    selectedDay === day.date
                      ? 'bg-[#060648] text-white'
                      : weekDays.some((wd) => wd.day === day.date)
                      ? 'bg-[#060648] text-white border-2 border-[#060648]'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  <span className="sm:hidden">{day.initials}</span>
                  <span className="hidden sm:block">{day.fullName}</span>
                </button>
              ))}
            </div>

            {showActionButtons && selectedDay && (
              <div className="mt-4 border p-4 rounded-lg">
                <p className="text-gray-700 mb-2">
                  {getDaysForWeek(weekStartDate).find((d) => d.date === selectedDay)?.label}
                </p>

                <ScheduleSelect
                  value={selectedSchedule}
                  onChange={handleScheduleSelect}
                  schedules={schedules}
                  className="mb-4"
                />

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Clinic (Optional)</label>
                  <ClinicSearchBar
                    value={selectedClinic as Clinic}
                    onChange={handleClinicChange}
                    round="rounded-md"
                  />
                </div>

                {scheduleError && <p className="text-red-500 text-sm mb-4">{scheduleError}</p>}

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Hours</label>
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

                <div className="flex justify-end gap-2">
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
                        : 'bg-[#060648] text-white hover:opacity-90'
                    }`}
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {saveSuccess && <p className="text-green-500 text-sm mt-4">{saveSuccess}</p>}
        {saveError && <p className="text-red-500 text-sm mt-4">{saveError}</p>}

        {!showActionButtons && (
          <div className="mt-6 flex justify-end gap-4 sm:static xs:absolute xs:bottom-4 xs:left-0 xs:w-full xs:px-4">
            <button
              onClick={resetForm}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveSchedule}
              disabled={isSaving || weekDays.length === 0}
              className={`px-4 py-2 rounded-md ${
                isSaving || weekDays.length === 0
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  : 'bg-[#060648] text-white hover:opacity-90'
              }`}
            >
              {isSaving ? 'Updating...' : 'Update Schedule'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

