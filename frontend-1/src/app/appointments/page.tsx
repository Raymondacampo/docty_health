'use client';
import React, { useEffect, useState } from "react";
import ActiveAppointments from "./components/ActiveAppointments";
import UnactiveAppointments from "./components/UnactiveAppointments";
import { apiClient } from "../utils/api";
import { isAuthenticated } from "../utils/auth";
import Loading from "../components/LoadingComponent";
import dclogo from '@/assets/images/dclogo.png';
import AppNavbar from "./components/NavBar";
import type { Appointment } from "./components/ActiveAppointments";
import type { WeekSchedule } from "./components/WeekScheduleList";
import ScheduleCreationModal from "./components/ScheduleCreationModal";
import DoctorSchedule from "./components/DoctorSchedule";
import { useLoading } from '@/app/utils/LoadingContext';
import CreateWeekScheduleModal from "./components/CreateWeekScheduleModal";
import WeekSchedulesList from "./components/WeekScheduleList";

type Tab = 'appointments' | 'week' | 'schedules';

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

const Appointments = ({ appointments, isDoctor, fetchAppointments }: { appointments: { active_appointments: Appointment[]; inactive_appointments: Appointment[] }; isDoctor: boolean; fetchAppointments: () => void }) => {
  // const cancelAppointment = async (appointmentId: number) => {
  //   try {
  //     await apiClient.delete(`appointments/${appointmentId}/`);
  //     // setAlert({ message: "Appointment cancelled successfully", status: "success" });
  //     setTimeout(() => setAlert({ message: null, status: null }), 3000);
  //     fetchAppointments(); // Refresh appointments
  //   } catch (err: any) {
  //     const errorMessage = err.response?.data?.error || "Failed to cancel appointment";
  //     // setAlert({ message: errorMessage, status: "error" });
  //     setTimeout(() => setAlert({ message: null, status: null }), 3000);
  //     console.error("Cancel error:", err);
  //   }
  // };

  
  return(
    <div className="w-full max-w-4xl h-screen flex flex-col justify-start items-start gap-10">
    {appointments.active_appointments.length > 0 || appointments.inactive_appointments.length > 0 ? (
      <>
        <ActiveAppointments
          appointments={appointments.active_appointments}
          is_doctor={isDoctor}
          onCancel={fetchAppointments}
          isCancel={true}
        />
        <UnactiveAppointments appointments={appointments.inactive_appointments} is_doctor={isDoctor} />
      </>
    ) : (
      <div className="w-[80%] mx-auto h-80 flex justify-center items-center">
        <div className="flex flex-col justify-center items-center gap-4">
          <img src={dclogo.src} alt="No results" className="h-[75px] w-[75px] mt-4" />
          <div className="text-[#060648] text-2xl font-semibold">No appointments yet</div>
          <div className="flex items-center gap-4">
            <p className="text-[#060648]">Look up for doctors to make your appointments here!</p>
              {/* <SearchBar /> */}
          </div>
        </div>
      </div>
    )}
  </div>

  )
};

const WeekSchedule = ({weekSchedules, onUpdate}: {weekSchedules: WeekSchedule[], onUpdate: () => void}) => {
  return( 
    <div className="w-full max-w-4xl h-screen">
      <h1 className="font-bold mb-2 sm:text-3xl xs:text-2xl">Week Schedule</h1>
      <CreateWeekScheduleModal onScheduleCreated={() => {}} onCreate={onUpdate} />
      <WeekSchedulesList weekschedules={weekSchedules} onActionComplete={() => onUpdate()} onUpdate={onUpdate} />
    </div>
  );
};

const Schedules = ({ schedules, onUpdate }: { schedules: ScheduleType[], onUpdate: () => void }) => {
  const [isModalOpen , setModalOpen] = useState<boolean>(false);

  return (
    <div className="w-full max-w-4xl h-screen">
      <div className="w-full flex justify-between items-start sm:flex-row xs:flex-col">
        <div className="flex flex-col items-start">
          <h1 className="font-bold mb-2 sm:text-3xl xs:text-2xl">Schedule management</h1>
          <p className="mb-4">Here you can find the schedule for our clinics.</p>
        </div>
        {isModalOpen && <ScheduleCreationModal onCreate={onUpdate} hideButton={false} isOpen={isModalOpen} onClose={() => setModalOpen(false)} /> }
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
              onUpdate={onUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState({
    active_appointments: [],
    inactive_appointments: [],
  });

  const [schedules, setSchedules] = useState<ScheduleType[]>([]);
  const [weekSchedules, setWeekSchedules] = useState<WeekSchedule[]>([]);

  const { setIsLoading } = useLoading();
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDoctor, setIsDoctor] = useState(false);
  const [userAuthenticated, setUserAuthenticated] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<Tab>('appointments');

  useEffect(() => {
    const check = async () => {
      const result = await isAuthenticated();
      setUserAuthenticated(result ?? false);
    };
    check();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await apiClient.get("appointments/");
      setAppointments(response.data);
      console.log("Fetched appointments:", response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  // Fetch schedules only if confirmed as doctor
  const fetchSchedules = async () => {
      setError(null);
      try {
        const response = await apiClient.get<ScheduleType[]>('/auth/my_schedules/');
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

  const fetchWeekSchedules = async () => {
    setError(null);
    try {
      const response = await apiClient.get('/auth/weekschedules/');
      setWeekSchedules(response.data.weekschedules);
    } catch (err: any) {
      console.error('Error fetching week schedules:', err);
      if (err.response?.status === 401) {
        setError('Unauthorized: Please log in again');
      } else if (err.response?.status === 403) {
        setError('Only doctors can view week schedules');
      } else {
        setError('Failed to load week schedules');
      }
      // setWeekSchedules([]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleCreateOrUpdate = () => {
    
    setRefreshKey((prev) => prev + 1);
  };

  const checkUserRole = async () => {
    try {
      const response = await apiClient.get("/auth/is_doctor");
      setIsDoctor(response.data.is_doctor);
    } catch (err) {
      console.error("Error checking user role:", err);
    }
  };


  useEffect(() => {
    if (userAuthenticated) {
      fetchAppointments();
      checkUserRole();
    }
  }, [userAuthenticated]);

  useEffect(() => {
    if (isDoctor) {
      fetchSchedules();
      fetchWeekSchedules();
    }
  }, [refreshKey, isDoctor]); // Refetch when refreshKey changes or when user role is confirmed

  useEffect(() => {
  }, [activeTab]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-full px-2 pt-[12dvh] min-h-[75dvh] flex flex-col justify-start items-center gap-20 sm:px-4">
      {/* <CustomAlert message={alert.message} status={alert.status} /> */}
      {isDoctor ?
      <>
        <AppNavbar onTabChange={setActiveTab} activeTab={activeTab} />
        {activeTab === 'appointments' ? (
          <Appointments appointments={appointments} isDoctor={isDoctor} fetchAppointments={fetchAppointments} />
        ) : activeTab === 'week' ? (
          <WeekSchedule onUpdate={handleCreateOrUpdate} weekSchedules={weekSchedules} />
        ) : activeTab === 'schedules' ? (
          <Schedules schedules={schedules} onUpdate={handleCreateOrUpdate} />
        ) : null}
      
      </>
      :
      <Appointments appointments={appointments} isDoctor={isDoctor} fetchAppointments={fetchAppointments} />
    }

    </div>
  );
}