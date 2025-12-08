'use client';
import { useState, useEffect, use } from 'react';
import { apiClient } from "@/app/utils/api";
import ScheduleCreationModal from './components/ScheduleCreationModal';
import DoctorSchedule from './components/DoctorSchedule';
import Loading from '@/app/components/LoadingComponent';
import { useLoading } from '@/app/utils/LoadingContext';

// Define types
  
export type Clinic = {
  id: number | string;
  name: string;
  city: string;
  state: string;
  [key: string]: any;
}

export type ScheduleType = {
  id: number | string;
  title: string;
  place: Clinic | null;
  hours: string[];
  [key: string]: any;
}

export default function Schedule() {
  const { setIsLoading } = useLoading();
  const [schedules, setSchedules] = useState<ScheduleType[]>([]);
  const [isModalOpen , setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // Fetch schedules only if confirmed as doctor
  const fetchSchedules = async () => {
      setError(null);
      try {
        const response = await apiClient.get<ScheduleType[]>('/auth/my_schedules/');
        console.log('Fetched schedules:', response.data);
        setSchedules(response.data);
      } catch (err: any) {
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
        setIsLoading(false);
      }
    };

  useEffect(() => {
    fetchSchedules();
  }, [refreshKey]);


  // Handle create or update success
  const handleCreateOrUpdate = () => {
    console.log('Refreshing schedules after create/update');
    
    setRefreshKey((prev) => prev + 1);
  };

  // Error state
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
    <div className="flex w-full my-[10dvh] min-h-screen">
          <div className="w-full min-h-[500px] self-stretch py-8 bg-white justify-start items-start gap-6 flex flex-col flex-wrap 
            lg:px-20 
            md:px-10 
            sm:px-20 sm:rounded-[20px] sm:max-w-[900px] 
            xs:px-4">
            <div className="w-full flex justify-between items-start sm:flex-row xs:flex-col">
              <div className="flex flex-col items-start">
                <h1 className="font-bold mb-2 sm:text-3xl xs:text-2xl">Schedule management</h1>
                <p className="mb-4">Here you can find the schedule for our clinics.</p>
              </div>
              {isModalOpen && <ScheduleCreationModal onCreate={handleCreateOrUpdate} hideButton={false} isOpen={isModalOpen} onClose={() => setModalOpen(false)} /> }
              <button
                onClick={() => setModalOpen(true)}
                className={`px-4 py-2 hover:bg-[#060648]/85 bg-[#060648] text-white rounded-md transition-all`}
              >
                Create Schedule
              </button>
            </div>

            {schedules.length === 0 ? (
              <div className="w-full text-center text-gray-500 py-4">
                No schedules found
              </div>
            ) : (
              <div className="w-full flex flex-col gap-2">
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
        </div>
  );
}