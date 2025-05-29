import React, { useState } from "react";
import { apiClient } from "@/utils/api";
import { XMarkIcon } from '@heroicons/react/24/outline';

const Date = ({ appointment, onCancel, is_doctor }) => {
    const doctorName = appointment.week_availability?.doctor
        ? `Dr. ${appointment.week_availability.doctor.first_name} ${appointment.week_availability.doctor.last_name}`
        : "Unknown Doctor";
    const patientName = appointment.patient
        ? `${appointment.patient.first_name} ${appointment.patient.last_name}`
        : "Unknown Patient";
    console.log(appointment)
    const location = appointment.weekday?.place?.name || "Virtual";

    return (
        <div className="self-stretch p-2 bg-white rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border border-black/50 flex justify-between items-center gap-4 flex-wrap sm:p-4 xs:items-center">
        <div className="flex justify-start items-center gap-4">
            {!is_doctor && (
                <div className="min-w-[80px] h-[80px] bg-[#d9d9d9] rounded-full"></div>    
                )}
            
            <div className="flex flex-col justify-start items-start gap-1">
                {is_doctor ? (
                    <div className="self-stretch text-[#3d5a80] font-['Inter'] tracking-wide">{patientName}</div>   
                ) : (
                    <div className="self-stretch text-[#3d5a80] text-sm font-light font-['Inter'] tracking-wide">{doctorName}</div>
                )}
            
            <div className="self-stretch flex flex-wrap items-center gap-x-2.5">
                <div>
                <span className="text-[#293241] text-xs font-normal font-['Inter'] tracking-wide">Date:</span>
                <span className="text-[#293241] text-sm font-['Inter'] tracking-wide"> {appointment.weekday?.day}</span>
                </div>
                <div>
                <span className="text-[#293241] text-xs font-normal font-['Inter'] tracking-wide">Time:</span>
                <span className="text-[#293241] text-sm font-['Inter'] tracking-wide"> {appointment.time}</span>
                </div>
                <div>
                <span className="text-[#293241] text-xs font-normal font-['Inter'] tracking-wide">Location:</span>
                <span className="text-[#293241] text-sm font-['Inter'] tracking-wide"> {location}</span>
                </div>
            </div>
            </div>
        </div>
        <button
            className="px-2 py-1.5 bg-[#ee6c4d] rounded-[10px] border-2 border-[#ee6c4d] flex justify-center items-center gap-2.5"
            onClick={() => onCancel(appointment.appointment_id)}
        >
            <div className="text-white font-['Inter'] tracking-wide whitespace-nowrap sm:text-base xs:text-sm">Cancel date</div>
        </button>
        </div>
    );
};

export default function ActiveAppointments({ appointments, is_doctor, onCancel, setAlert }) {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);

  const handleCancel = (appointmentId) => {
    setAppointmentToCancel(appointmentId);
    setIsConfirmModalOpen(true);
  };

  const confirmCancel = async () => {
    try {
      await apiClient.delete(`appointments/${appointmentToCancel}/`);
      setAlert({ message: "Appointment cancelled successfully", status: "success" });
      setTimeout(() => setAlert({ message: null, status: null }), 3000);
      onCancel(); // Refresh appointments
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to cancel appointment";
      setAlert({ message: errorMessage, status: "error" });
      setTimeout(() => setAlert({ message: null, status: null }), 3000);
      console.error("Cancel error:", err);
    } finally {
      setIsConfirmModalOpen(false);
      setAppointmentToCancel(null);
    }
  };

  const cancelCancel = () => {
    setIsConfirmModalOpen(false);
    setAppointmentToCancel(null);
  };

  return (
    <div className="self-stretch flex flex-col justify-start items-start">
      <div className="self-stretch text-[#3d5a80] text-xl font-['Inter'] tracking-wide">Upcoming dates</div>
      <div className="self-stretch p-0 py-4 flex flex-col justify-start items-start gap-4 sm:p-4">
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <Date
              key={appointment.appointment_id}
              appointment={appointment}
              onCancel={handleCancel}
              is_doctor={is_doctor}
            />
          ))
        ) : (
          <div className="text-[#293241] font-['Inter']">No upcoming appointments</div>
        )}
      </div>
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative bg-white shadow-xl p-6 w-full max-w-md rounded-lg sm:mx-4">
            <button
              onClick={cancelCancel}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              aria-label="Close modal"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-semibold mb-4">Confirm Cancellation</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelCancel}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmCancel}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}