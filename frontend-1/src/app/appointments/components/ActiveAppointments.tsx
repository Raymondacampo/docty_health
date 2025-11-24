import React, { useState } from "react";
import { apiClient } from "@/app/utils/api";
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useAlert } from "@/app/context/AlertContext";

export type Appointment = {
  id: number;
  week_availability: {
    id: number;
    doctor: number;
    week: string;
  };
  appointment: {
    id: number;
    week_availability: number;
    day: string;
    hours: string[];
    place: {
      id: number;
      name: string;
      city: string | null;
      state: string | null;
      location: { latitude: number; longitude: number } | null;
      address: string;
    } | null;
  };
  time: string;
  active: boolean;
  patient: {
    id: number;
    first_name: string;
    last_name: string;
    profile_picture: string | null;
  };
  doctor?: {
    id: number;
    first_name: string;
    last_name: string;
    profile_picture: string | null;
  };
};

const Appointment = ({
  appointment,
  onCancel,
  is_doctor,
  darker
}: {
  appointment: Appointment;
  onCancel: (appointmentId: number) => void;
  is_doctor: boolean;
  darker?: boolean;
}) => {
  const doctorName = appointment.doctor
    ? `Dr. ${appointment.doctor.first_name} ${appointment.doctor.last_name}`
    : "Unknown Doctor";
  const patientName = appointment.patient
    ? `${appointment.patient.first_name} ${appointment.patient.last_name}`
    : "Unknown Patient";

  return (
    <div className={`self-stretch shadow-md border border-gray-400 rounded-md flex flex-col sm:flex-row justify-between sm:items-center flex-wrap px-4 py-2 xs:items-center ${darker ? "bg-gray-50" : "bg-white"}`}>
      <div className="flex justify-start items-center gap-4">
        <div className="flex flex-col justify-start py-5 items-start gap-1">
          {is_doctor ? (
            <div className="self-stretch text-[#3d5a80] text-lg tracking-wide">{patientName}</div>   
          ) : (
            <div className="self-stretch text-[#3d5a80] text-lg font-bold tracking-wide">{doctorName}</div>
          )}
          <div className="self-stretch flex flex-wrap items-center gap-x-2.5">
            <div>
              <span className="text-[#293241] text-xs font-normal tracking-wide">Date:</span>
              <span className="text-[#293241] text-sm tracking-wide font-bold"> {appointment.appointment?.day}</span>
            </div>
            <div>
              <span className="text-[#293241] text-xs font-normal tracking-wide">Time:</span>
              <span className="text-[#293241] text-sm tracking-wide font-bold"> {appointment.time}</span>
            </div>
            <div>
              <span className="text-[#293241] text-xs font-normal tracking-wide">Location:</span>
              <span className="text-[#293241] text-sm tracking-wide font-bold"> {appointment.appointment.place?.name ?? "Virtual"}</span>
            </div>
          </div>
        </div>
      </div>
      <button
        className="px-4 py-1.5 bg-[#060648] rounded-md flex justify-center items-center gap-2.5"
        onClick={() => onCancel(appointment.id)}
      >
        <div className="text-white font-bold tracking-wide whitespace-nowrap sm:text-base xs:text-sm">Cancel appoinment</div>
      </button>
    </div>
  );
};

type ActiveAppointmentsProps = {
  appointments: Appointment[];
  is_doctor: boolean;
  onCancel: () => void;
  setAlert?: (alert: { message: string | null; status: string | null }) => void;
  darker?: boolean;
};

export default function ActiveAppointments({ appointments, is_doctor, onCancel, setAlert, darker }: ActiveAppointmentsProps) {
  const { showAlert } = useAlert();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState<number | null>(null);

  const handleCancel = (appointmentId: number) => {
    setAppointmentToCancel(appointmentId);
    setIsConfirmModalOpen(true);
  };

  const confirmCancel = async () => {
    try {
      await apiClient.delete(`appointments/${appointmentToCancel}/`);
      console.log("Appointment cancelled:", appointmentToCancel);
      showAlert("Appointment cancelled successfully", "success");
      onCancel(); // Refresh appointments
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "Failed to cancel appointment";
      showAlert(errorMessage, "error");
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
    <div className="self-stretch w-full flex flex-col justify-start items-start">
      <div className="self-stretch text-black text-2xl tracking-wide font-bold">Upcoming appointments</div>
      <div className="self-stretch p-0 py-4 flex flex-col justify-start items-start gap-4 sm:py-4">
        {appointments.length > 0 ? (
          appointments.map((appointment, index  ) => (
            <Appointment
              key={index}
              appointment={appointment}
              onCancel={handleCancel}
              is_doctor={is_doctor}
              darker={darker}
            />
          ))
        ) : (
          <div className="text-[#293241]">No upcoming appointments</div>
        )}
      </div>
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-[95%] bg-white shadow-xl p-6 max-w-md rounded-lg sm:mx-4">
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
                className="px-4 py-2 bg-[#060648] text-white rounded-md hover:bg-[#05053a]"
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