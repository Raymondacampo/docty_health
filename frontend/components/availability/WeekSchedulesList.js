import React, { useState, useEffect, useRef } from 'react';
import { format, parseISO, addDays, isSameDay } from 'date-fns';
import { FaEllipsisV } from 'react-icons/fa';
import { apiClient } from '@/utils/api';
import EditWeekScheduleModal from './EditWeekScheduleModal';

export default function WeekSchedulesList() {
  const [schedules, setSchedules] = useState([]);
  const [clinics, setClinics] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const schedulesResponse = await apiClient.get('/auth/weekschedules/');
        const fetchedSchedules = schedulesResponse.data.weekschedules;
        const clinicsResponse = await apiClient.get('/all_clinics/');
        const clinicMap = {};
        clinicsResponse.data.forEach(clinic => {
          clinicMap[clinic.id] = clinic.name;
        });
        setClinics(clinicMap);
        setSchedules(fetchedSchedules);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.error || 'Failed to load week schedules.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDelete = async (weekAvailabilityId) => {
    if (!window.confirm('Are you sure you want to delete this week schedule?')) return;
    try {
      await apiClient.delete(`/auth/delete_weekavailability/${weekAvailabilityId}/`);
      setSchedules(schedules.filter(schedule => schedule.week_availability.id !== weekAvailabilityId));
      setError(null);
    } catch (err) {
      console.error('Error deleting schedule:', err);
      setError(err.response?.data?.error || 'Failed to delete week schedule.');
    }
  };

  const handleEdit = (schedule) => {
    setSelectedSchedule({ ...schedule, clinics });
    setEditModalOpen(true);
    setIsMenuOpen(null);
  };

  const handleUpdate = (updatedData) => {
    setSchedules(schedules.map(schedule =>
      schedule.week_availability.id === updatedData.week_availability.id
        ? updatedData
        : schedule
    ));
  };

  const formatWeekRange = (weekDateStr) => {
    const startDate = parseISO(weekDateStr);
    const endDate = addDays(startDate, 6);
    return `${format(startDate, 'MMMM d, yyyy')} - ${format(endDate, 'MMMM d, yyyy')}`;
  };

  const getWeekDays = (weekStartStr) => {
    const startDate = parseISO(weekStartStr);
    return Array.from({ length: 7 }, (_, i) => ({
      initial: format(addDays(startDate, i), 'EEE').toUpperCase(),
      date: addDays(startDate, i),
    }));
  };

  const getPlaceLabel = (weekdays) => {
    const placeId = weekdays.find(weekday => weekday.place)?.place;
    return placeId ? clinics[placeId] || 'Unknown Clinic' : 'Virtual';
  };

  const isDayAvailable = (dayDate, weekdays) => {
    return weekdays.some(weekday => 
      isSameDay(parseISO(weekday.day), dayDate) && weekday.hours.length > 0
    );
  };

  return (
    <div className="w-full">
      {isLoading && <div className="text-center text-gray-500">Loading schedules...</div>}
      {error && <div className="text-center text-red-500 mb-4">{error}</div>}
      {!isLoading && !error && schedules.length === 0 && (
        <div className="text-center text-gray-500">No week schedules found. Create a new schedule to get started.</div>
      )}
      {!isLoading && schedules.length > 0 && (
        <div className="space-y-6">
          {schedules.map((schedule) => (
            <div
              key={schedule.week_availability.id}
              className="border border-gray-200 rounded-md p-4 bg-gray-50"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium text-gray-700">
                  {formatWeekRange(schedule.week_availability.week)}
                </h3>
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setIsMenuOpen(isMenuOpen === schedule.week_availability.id ? null : schedule.week_availability.id)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                    aria-label="Schedule options"
                  >
                    <FaEllipsisV className="h-5 w-5 text-gray-500" />
                  </button>
                  {isMenuOpen === schedule.week_availability.id && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 shadow-lg rounded-md z-10">
                      <button
                        onClick={() => handleEdit(schedule)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(schedule.week_availability.id)}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Location: {getPlaceLabel(schedule.weekdays)}
              </p>
              <div className="flex space-x-2">
                {getWeekDays(schedule.week_availability.week).map((day) => (
                  <div
                    key={day.initial}
                    className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium ${
                      isDayAvailable(day.date, schedule.weekdays)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-300 text-gray-700'
                    }`}
                  >
                    {day.initial}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <EditWeekScheduleModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        scheduleData={selectedSchedule}
        onUpdate={handleUpdate}
      />
    </div>
  );
}