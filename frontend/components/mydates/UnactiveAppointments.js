import React, { useState } from "react";
import Pagination from "../Pagination";

const Date = ({ appointment, is_doctor }) => {

    const doctorName = appointment.week_availability?.doctor
        ? `Dr. ${appointment.week_availability.doctor.first_name} ${appointment.week_availability.doctor.last_name}`
        : "Unknown Doctor";
    const patientName = appointment.patient
        ? `${appointment.patient.first_name} ${appointment.patient.last_name}`
        : "Unknown Patient";
    const location = appointment.weekday?.place?.name || "Virtual";

    return (
        <div className="w-full p-2 bg-white rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border border-black/25 flex justify-start items-center gap-[49px] sm:p-3">
        <div className="flex justify-start items-center gap-[13px]">
            {!is_doctor && (
                <div className="min-w-[80px] h-[80px] bg-[#d9d9d9] rounded-full"></div>
            )}
            <div className="flex flex-col justify-start items-start gap-1">
            {is_doctor ? (
                <div className="self-stretch text-[#3d5a80] font-['Inter'] tracking-wide">{patientName}</div>
            ) : (
                <div className="self-stretch text-gray-500 text-sm font-light font-['Inter'] tracking-wide">{doctorName}</div>
            )}
            <div className="self-stretch flex flex-wrap items-center gap-x-2.5">
                <div>
                <span className="text-gray-500 text-xs font-extralight font-['Inter'] tracking-wide">Date: </span>
                <span className="text-gray-500 text-sm font-light font-['Inter'] tracking-wide">{appointment.weekday?.day}</span>
                </div>
                <div>
                <span className="text-gray-500 text-xs font-extralight font-['Inter'] tracking-wide">Time: </span>
                <span className="text-gray-500 text-sm font-light font-['Inter'] tracking-wide">{appointment.time}</span>
                </div>
                <div>
                <span className="text-gray-500 text-xs font-extralight font-['Inter'] tracking-wide">Location: </span>
                <span className="text-gray-500 text-sm font-light font-['Inter'] tracking-wide">{location}</span>
                </div>
            </div>
            </div>
        </div>
        </div>
    );
};

export default function UnactiveDates({ appointments, is_doctor }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalItems = appointments.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAppointments = appointments.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="self-stretch flex flex-col justify-center items-center">
      <div className="self-stretch text-[#3d5a80] text-xl font-['Inter'] tracking-wide">Previous dates</div>
      <div className="self-stretch py-4 p-0 flex flex-col justify-start items-start gap-3 sm:p-4">
        {currentAppointments.length > 0 ? (
          currentAppointments.map((appointment) => (
            <Date key={appointment.appointment_id} appointment={appointment} is_doctor={is_doctor} />
          ))
        ) : (
          <div className="text-[#293241] font-['Inter']">No previous appointments</div>
        )}
      </div>
      {totalItems > itemsPerPage && (
        <Pagination
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}