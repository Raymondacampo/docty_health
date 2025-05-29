import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { addDays, format, parseISO } from 'date-fns';
import { apiClient } from '@/utils/api';
import ClinicSearchBar from '../search/ClinicSearchBar';
import ScheduleSelect from './ScheduleSelect';

const EditWeekScheduleModal = ({ isOpen, onClose, scheduleData, onUpdate, onActionComplete }) => {
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

  const hoursOfDay = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

  const resetForm = () => {
    onClose();
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
  };

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

      // Load existing weekdays
      const formattedWeekDays = scheduleData.weekdays.map(wd => ({
        day: wd.day,
        hours: wd.hours,
        place: wd.place ? { id: wd.place, name: scheduleData.clinics[wd.place] || 'Unknown Clinic' } : null,
      }));
      setWeekDays(formattedWeekDays);
    }
  }, [isOpen, scheduleData]);

  const getWeekDisplayText = () => {
    const weekStart = parseISO(scheduleData.week_availability.week);
    const weekEnd = addDays(weekStart, 6);
    return `Week of ${format(weekStart, 'MMMM do, yyyy')} (${format(weekStart, 'MMMM do')} to ${format(weekEnd, 'MMMM do')})`;
  };

  const getDaysForWeek = (weekStart) => {
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
      console.error('Error applying schedule:', error);
      setScheduleError('Failed to load schedule details.');
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
        place: selectedClinic,
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
    if (weekDays.length === 0) {
      setSaveError('Please select at least one day.');
      onActionComplete({ message: 'Please select at least one day.', status: 'error' });
      return;
    }
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(null);
    try {
      const data = {
        week_availability_id: scheduleData.week_availability.id,
        week: scheduleData.week_availability.week,
        weekdays: weekDays.map((day) => ({
          day: day.day,
          hours: day.hours,
          place: day.place ? day.place.id : null,
        })),
      };
      const response = await apiClient.put('/auth/weekschedule/', data);
      setSaveSuccess('Week schedule updated successfully!');
      onUpdate(response.data);
      onActionComplete({ message: 'Week schedule updated successfully!', status: 'success' });
      resetForm();
    } catch (error) {
      console.error('Error updating week schedule:', error);
      const errorMessage = error.response?.data?.error || 'Failed to update week schedule.';
      setSaveError(errorMessage);
      onActionComplete({ message: errorMessage, status: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
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
            <h2 className="text-2xl font-semibold mb-4">Edit Week Schedule</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Week
                </label>
                <div className="w-full border border-gray-300 rounded-md p-2 bg-gray-50">
                  {getWeekDisplayText()}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Select Days</h3>
                <div className="flex flex-wrap gap-2">
                  {getDaysForWeek(parseISO(scheduleData.week_availability.week)).map((day) => (
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
                      {getDaysForWeek(parseISO(scheduleData.week_availability.week)).find((d) => d.date === selectedDay)?.label}
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
                        restrictToDoctorClinics={true}
                        value={selectedClinic?.name || ''}
                        onChange={handleClinicChange}
                        initialClinic={selectedClinic}
                        key={selectedClinic?.id || 'empty'}
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
                            : 'bg-[#ee6c4d] text-white hover:hover:opacity-90'
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
                  disabled={isSaving || weekDays.length === 0}
                  className={`px-4 py-2 rounded-md ${
                    isSaving || weekDays.length === 0
                      ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                      : 'bg-[#ee6c4d] text-white hover:opacity-90'
                  }`}
                >
                  {isSaving ? 'Updating...' : 'Update Schedule'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default EditWeekScheduleModal;