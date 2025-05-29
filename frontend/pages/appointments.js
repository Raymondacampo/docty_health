import React, { useEffect, useState } from "react";
import ActiveAppointments from "@/components/mydates/ActiveAppointments";
import UnactiveAppointments from "@/components/mydates/UnactiveAppointments";
import { apiClient } from "@/utils/api";
import { useAuth } from "@/context/auth";
import CustomAlert from "@/components/CustomAlert";
import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/router";
import AbsoluteSearchOverlay from "@/components/AbsoluteSearchOverlay"; // Assumed component path

export default function MyDates() {
  const { user } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState({
    active_appointments: [],
    inactive_appointments: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDoctor, setIsDoctor] = useState(false);
  const [alert, setAlert] = useState({ message: null, status: null });
  const [show, setShow] = useState(false);

  const fetchAppointments = async () => {
    try {
      const response = await apiClient.get("appointments/");
      setAppointments(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
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
    if (user) {
      fetchAppointments();
      checkUserRole();
    }
  }, [user]);

  if (loading) {
    return <div className="w-full h-80 flex justify-center items-center text-[#060648]">Loading...</div>;
  }

  if (error) {
    return <div className="w-full h-80 flex justify-center items-center text-red-500">{error}</div>;
  }

  const hasAppointments = appointments.active_appointments.length > 0 || appointments.inactive_appointments.length > 0;

  return (
    <div className="w-full px-2 py-4 flex flex-col justify-start items-center gap-20 sm:p-4">
      <CustomAlert message={alert.message} status={alert.status} />
      <div className="w-full max-w-4xl flex flex-col justify-start items-start gap-10">
        {hasAppointments ? (
          <>
            <ActiveAppointments
              appointments={appointments.active_appointments}
              is_doctor={isDoctor}
              onCancel={fetchAppointments}
              setAlert={setAlert}
            />
            <UnactiveAppointments appointments={appointments.inactive_appointments} is_doctor={isDoctor} />
          </>
        ) : (
          <div className="w-[80%] mx-auto h-80 flex justify-center items-center">
            <div className="flex flex-col justify-center items-center gap-4">
              <img src="/images/dclogo.png" alt="No results" className="h-[75px] w-[75px] mt-4" />
              <div className="text-[#060648] text-2xl font-semibold">No appointments yet</div>
              <div className="flex items-center gap-4">
                <p className="text-[#060648]">Look up for doctors to make your appointments here!</p>
                {show && (
                  <AbsoluteSearchOverlay
                    onClose={() => router.push("/search")}
                    setShow={setShow}
                  />
                )}
                <button
                  onClick={() => setShow(true)}
                  className="text-white bg-[#293241] px-3.5 py-1.5 rounded-sm flex items-center gap-2">
                  Search <FaSearch />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}