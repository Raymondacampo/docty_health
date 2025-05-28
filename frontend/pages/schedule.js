import { useState, useEffect } from 'react';
import { apiClient } from '@/utils/api';
import ScheduleCreationModal from '@/components/availability/ScheduleCreationModal';
import DoctorSchedule from '@/components/availability/DoctorSchedule';
import SidebarToggle from '@/components/account/SideBarToggle';
import NavBar from '@/components/account/NavBar';

export default function Schedule() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isNavOpen, setIsNavOpen] = useState(true); // State for NavBar toggle


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
    <div className="flex w-full min-h-screen">
      {!isNavOpen && (
        <SidebarToggle onToggle={() => setIsNavOpen(true)} />
      )}
      <NavBar isOpen={isNavOpen} onToggle={() => setIsNavOpen(false)} selection={'sch'}/>
      
      <div className="flex-1 justify-center items-start gap-2.5 inline-flex">
        <div className="py-4 rounded-[20px] justify-center items-start gap-16 inline-flex mt-2 sm:px-0 xs:w-full">
          <div className="w-full min-h-[500px] self-stretch py-8 bg-white justify-start items-start gap-6 flex flex-col flex-wrap shadow-[0px_4px_6px_2px_rgba(0,0,0,0.15)] 
            lg:px-20 
            md:px-10 
            sm:px-20 sm:rounded-[20px] sm:max-w-[900px] 
            xs:px-4">
              <div className="w-full flex justify-between items-start
              sm:flex-row xs:flex-col">
                <div className="flex flex-col items-start">
                  <h1 className="font-bold mb-2 sm:text-3xl xs:text-2xl">Schedule management</h1>
                  <p className="mb-4">Here you can find the schedule for our clinics.</p>                
                </div>
                <ScheduleCreationModal onCreate={handleCreateOrUpdate} hideButton={false} />                
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
      </div>

    </div>
  );
}