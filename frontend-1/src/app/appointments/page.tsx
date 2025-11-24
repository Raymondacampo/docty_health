'use client';
import React, { useEffect, useState } from "react";
import ActiveAppointments from "./components/ActiveAppointments";
import UnactiveAppointments from "./components/UnactiveAppointments";
import { apiClient } from "../utils/api";
// import { useAuth } from "@/context/auth";
// import CustomAlert from "@/components/CustomAlert";
import { FaSearch } from "react-icons/fa";
import { isAuthenticated } from "../utils/auth";
// import { useRouter } from "next/router";
// import AbsoluteSearchOverlay from "@/components/AbsoluteSearchOverlay"; // Assumed component path
import Loading from "../components/LoadingComponent";
import { a } from "framer-motion/client";

export default function MyDates() {
  const [appointments, setAppointments] = useState({
    active_appointments: [],
    inactive_appointments: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDoctor, setIsDoctor] = useState(false);
  const [alert, setAlert] = useState({ message: null, status: null });
  const [show, setShow] = useState(false);
  const [userAuthenticated, setUserAuthenticated] = useState<boolean>(false);
  
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
    } catch (err: any) {
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

  useEffect(() => {
    if (userAuthenticated) {
      fetchAppointments();
      checkUserRole();
    }
  }, [userAuthenticated]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="w-full h-80 flex justify-center items-center text-red-500">{error}</div>;
  }

  return (
    <div className="w-full px-2 pt-[12dvh] min-h-[75dvh] flex flex-col justify-start items-center gap-20 sm:px-4">
      {/* <CustomAlert message={alert.message} status={alert.status} /> */}

      <div className="w-full max-w-4xl flex flex-col justify-start items-start gap-10">
        {appointments.active_appointments.length > 0 || appointments.inactive_appointments.length > 0 ? (
          <>
            <ActiveAppointments
              appointments={appointments.active_appointments}
              is_doctor={isDoctor}
              onCancel={fetchAppointments}
              // setAlert={setAlert}
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
                {/* {show && (
                  <AbsoluteSearchOverlay
                    onClose={() => router.push("/search")}
                    setShow={setShow}
                  />
                )} */}
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