'use client';

import React, { useState } from 'react';
import CreateAvailabilityForm from './CreateAvailabilityForm';

const DoctorAvailabilityManager = ({ user, onReload }) => {
    console.log(user)
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleOpenForm = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleCreate = (newAvailability) => {
    onReload(); // Trigger parent reload after creation
    setIsFormOpen(false); // Close form
  };

  if (!user.is_doctor) return null;

  return (
    <div className="w-full rounded-[10px] flex-col justify-start items-start gap-6 inline-flex">
      <button
        onClick={handleOpenForm}
        className="bg-[#ee6c4d] hover:bg-[#ff7653] text-white font-normal font-['Inter'] py-2 px-4 rounded-md"
      >
        Set New Availability
      </button>
      {isFormOpen && (
        <CreateAvailabilityForm user={user} onClose={handleCloseForm} onCreate={handleCreate} />
      )}
    </div>
  );
};

export default DoctorAvailabilityManager;