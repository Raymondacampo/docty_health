import { useState, useEffect } from 'react';
import { apiClient } from '@/utils/api';
import ScheduleCreationModal from '@/components/availability/ScheduleCreationModal';
import DoctorSchedule from '@/components/availability/DoctorSchedule';

export default function Schedule() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch schedules
  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get('/auth/my_schedules/');
        console.log('Fetched schedules:', response.data);
        setSchedules(response.data);
      } catch (err) {
        console.error('Error fetching schedules:', err);
        if (err.response?.status === 401) {
          setError('Unauthorized: Please log in again');
        } else if (err.response?.status === 403) {
          setError('Only doctors can view schedules');
        } else {
          setError('Failed to load schedules');
        }
        setSchedules([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, [refreshKey]);

  // Handle create or update
  const handleCreateOrUpdate = () => {
    console.log('Refreshing schedules after create/update');
    setRefreshKey((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Schedule</h1>
        <p className="mb-4">Here you can find the schedule for our clinics.</p>
        <div className="text-center text-gray-500 py-4">
          Loading schedules...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Schedule</h1>
        <p className="mb-4">Here you can find the schedule for our clinics.</p>
        <div className="text-center text-red-500 py-4">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Schedule</h1>
      <p className="mb-4">Here you can find the schedule for our clinics.</p>
      <ScheduleCreationModal onCreate={handleCreateOrUpdate} hideButton={false} />
      <br/>
      {schedules.length === 0 ? (
        <div className="text-center text-gray-500 py-4">
          No schedules found
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {schedules.map((schedule) => (
            <DoctorSchedule
              key={schedule.id}
              schedule={schedule}
              onUpdate={handleCreateOrUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}