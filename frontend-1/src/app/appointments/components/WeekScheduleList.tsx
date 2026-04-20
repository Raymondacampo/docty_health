import React, { useState, useEffect } from 'react';
import { format, addDays, isSameDay } from 'date-fns';
import { FaEllipsisV } from 'react-icons/fa';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { apiClient } from '@/app/utils/api';
import EditWeekScheduleModal from './EditWeekScheduleModal';
import { useAlert } from '@/app/context/AlertContext';
import { ScheduleType } from '../page';

interface Clinic {
  id: number;
  name: string;
}

interface Weekday {
  day: string;
  hours: string[];
  place: number | null;
}

interface WeekAvailability {
  id: number;
  week: string;
}

export interface WeekSchedule {
  week_availability: WeekAvailability;
  weekdays: Weekday[];
}

interface WeekSchedulesListProps {
  weekschedules: WeekSchedule[];
  newSchedule?: WeekSchedule | null;
  onActionComplete: (payload: { message: string; status: 'success' | 'error' }) => void;
  onUpdate?: () => void;
}

export default function WeekSchedulesList({ weekschedules, newSchedule, onActionComplete, onUpdate = () => {} }: WeekSchedulesListProps) {
  // const [schedules, setSchedules] = useState<WeekSchedule[]>([]);
  const [clinics, setClinics] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<WeekSchedule & { clinics: Record<number, string> } | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<number | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<number | null>(null);
  const { showAlert } = useAlert();
  const [clinicsArray, setClinicsArray] = useState<Clinic[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [clinicsResponse] = await Promise.all([
          apiClient.get('/all_clinics/'),
        ]);

        const clinicMap: Record<number, string> = {};
        clinicsResponse.data.forEach((clinic: Clinic) => {
          clinicMap[Number(clinic.id)] = clinic.name;
        });

        setClinics(clinicMap);
        setClinicsArray(clinicsResponse.data);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.error || 'Failed to load week schedules.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // useEffect(() => {
  //   if (newSchedule) {
  //     setSchedules((prev) => {
  //       if (!prev.some(s => s.week_availability.id === newSchedule.week_availability.id)) {
  //         return [...prev, { ...newSchedule }];
  //       }
  //       return prev;
  //     });
  //   }
  // }, [newSchedule]);

  const handleDelete = (weekAvailabilityId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setScheduleToDelete(weekAvailabilityId);
    setIsConfirmModalOpen(true);
    onUpdate();
  };

  const confirmDelete = async () => {
    if (!scheduleToDelete) return;

    try {
      await apiClient.delete(`/auth/delete_weekavailability/${scheduleToDelete}/`);
      // setWeekSchedules(prev => prev.filter(s => s.week_availability.id !== scheduleToDelete));
      onActionComplete({ message: 'Week schedule deleted successfully!', status: 'success' });
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to delete week schedule.';
      setError(errorMessage);
      showAlert('Failed to delete week schedule', 'error');
    } finally {
      setIsConfirmModalOpen(false);
      setScheduleToDelete(null);
      setIsMenuOpen(null);
      showAlert('Week schedule deleted successfully!', 'success');
    }
  };

  const cancelDelete = () => {
    setIsConfirmModalOpen(false);
    setScheduleToDelete(null);
  };

  const handleEdit = (schedule: WeekSchedule, e: React.MouseEvent) => {
    e.stopPropagation();
    // Pass clinics as Record<number, string> to match WeekScheduleData type
    setSelectedSchedule({ ...schedule, clinics });
    setEditModalOpen(true);
    setIsMenuOpen(null);
  };

  const handleUpdate = (updatedData: WeekSchedule) => {
    // setSchedules(prev =>
    //   prev.map(schedule =>
    //     schedule.week_availability.id === updatedData.week_availability.id
    //       ? updatedData
    //       : schedule
    //   )
    // );
    onActionComplete({ message: 'Week schedule updated successfully!', status: 'success' });
  };

  const toggleMenu = (scheduleId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(prev => (prev === scheduleId ? null : scheduleId));
  };

  const parseDateString = (dateStr: string): Date => {
    // Assumes dateStr is in "YYYY-MM-DD" format (standard from backend)
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day); // month is 0-indexed in JS Date
    };

const formatWeekRange = (weekDateStr: string): string => {
    const startDate = parseDateString(weekDateStr);
    const endDate = addDays(startDate, 6);
    return `${format(startDate, 'MMMM d, yyyy')} - ${format(endDate, 'MMMM d, yyyy')}`;
};

const getWeekDays = (weekStartStr: string) => {
  const startDate = parseDateString(weekStartStr);
  return Array.from({ length: 7 }, (_, i) => ({
    initial: format(addDays(startDate, i), 'EEE').toUpperCase(),
    date: addDays(startDate, i),
  }));
};
  const getPlaceLabel = (weekdays: Weekday[]): string => {
    const placeId = weekdays.find(weekday => weekday.place)?.place;
    return placeId ? clinics[placeId] || 'Unknown Clinic' : 'Virtual';
  };

const isDayAvailable = (dayDate: Date, weekdays: Weekday[]): boolean => {
  return weekdays.some((weekday) => {
    const weekdayDate = parseDateString(weekday.day);
    return isSameDay(weekdayDate, dayDate) && weekday.hours.length > 0;
  });
};

useEffect(() => {
  console.log('Schedules updated:', selectedSchedule);
}, [selectedSchedule]);

useEffect(() => {
  console.log('Week schedules :', weekschedules, weekschedules.length);
}, [weekschedules]);

  return (
    <div className="w-full py-4">
      {isLoading && <div className="text-center text-gray-500">Loading schedules...</div>}
      {error && <div className="text-center text-red-500 mb-4">{error}</div>}
      {!isLoading && !error && weekschedules.length === 0 && (
        <div className="text-center text-gray-500">No week schedules found. Create a new schedule to get started.</div>
      )}
      {!isLoading && weekschedules.length > 0 && (
        <div className="space-y-6">
          {weekschedules.map((schedule) => (
            <div
              key={schedule.week_availability.id}
              className="border border-gray-200 rounded-md p-4 bg-gray-50"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium text-gray-700">
                  {formatWeekRange(schedule.week_availability.week)}
                </h3>
                <div className="relative">
                  <button
                    onClick={(e) => toggleMenu(schedule.week_availability.id, e)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                    aria-label="Schedule options"
                  >
                    <FaEllipsisV className="h-5 w-5 text-gray-500" />
                  </button>
                  {isMenuOpen === schedule.week_availability.id && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 shadow-lg rounded-md z-10">
                      <button
                        onClick={(e) => handleEdit(schedule, e)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => handleDelete(schedule.week_availability.id, e)}
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
                    className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold ${
                      isDayAvailable(day.date, schedule.weekdays)
                        ? 'bg-[#060648] text-white'
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

      {/* Confirm Delete Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative bg-white shadow-xl p-6 w-full max-w-md rounded-lg sm:mx-4">
            <button
              onClick={cancelDelete}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              aria-label="Close modal"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this week schedule? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      <EditWeekScheduleModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        scheduleData={selectedSchedule}
        onUpdate={handleUpdate}
        onActionComplete={onActionComplete}
      />
    </div>
  );
}