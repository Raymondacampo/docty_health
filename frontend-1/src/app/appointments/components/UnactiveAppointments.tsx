import React, { useState } from "react";
import Pagination from "./Pagination";

interface DateProps {
    appointment: any;
    is_doctor: boolean;
}

const Date: React.FC<DateProps> = ({ appointment, is_doctor }) => {

    const doctorName = appointment.week_availability?.doctor
        ? `Dr. ${appointment.week_availability.doctor.first_name} ${appointment.week_availability.doctor.last_name}`
        : "Unknown Doctor";
    const patientName = appointment.patient
        ? `${appointment.patient.first_name} ${appointment.patient.last_name}`
        : "Unknown Patient";
    const location = appointment.weekday?.place?.name || "Virtual";

    return (
        <div className="w-full p-4 bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex  justify-start items-center">
        <div className="flex w-full justify-start items-center gap-[13px]">

            <div className="flex flex-col sm:flex-row w-full justify-between items-start">
            {is_doctor ? (
                <div className="self-stretch text-[#3d5a80] font-bold text-lg tracking-wide">{patientName}</div>
            ) : (
                <div className="self-stretch text-[#3d5a80] text-lg font-bold tracking-wide">{doctorName}</div>
            )}
            <div className="self-stretch flex flex-wrap items-center gap-x-2.5">
                <div>
                <span className="text-gray-500 text-xs font-extralight tracking-wide">Date: </span>
                <span className="text-gray-500 text-sm font-bold tracking-wide ">{appointment.weekday?.day}</span>
                </div>
                <div>
                <span className="text-gray-500 text-xs font-extralight tracking-wide">Time: </span>
                <span className="text-gray-500 text-sm font-bold tracking-wide">{appointment.time}</span>
                </div>
                <div>
                <span className="text-gray-500 text-xs font-extralight tracking-wide">Location: </span>
                <span className="text-gray-500 text-sm font-bold tracking-wide">{location}</span>
                </div>
            </div>
            </div>
        </div>
        </div>
    );
};

interface UnactiveAppointmentsProps {
  appointments: any[];
  is_doctor: boolean;
}

export default function UnactiveAppointments({ appointments, is_doctor }: UnactiveAppointmentsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalItems = appointments.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAppointments = appointments.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="self-stretch flex flex-col justify-center items-center">
      <div className="self-stretch text-black text-xl font-bold tracking-wide">Previous appointments</div>
      <div className="self-stretch py-4 p-0 flex flex-col justify-start items-start gap-3 sm:p-4">
        {currentAppointments.length > 0 ? (
          currentAppointments.map((appointment) => (
            <Date key={appointment.appointment_id} appointment={appointment} is_doctor={is_doctor} />
          ))
        ) : (
          <div className="text-[#293241]">No previous appointments</div>
        )}
      </div>
      {totalItems > itemsPerPage && (
        <Pagination
          totalPages={totalItems}
          // itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}