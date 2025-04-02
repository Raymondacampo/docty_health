// components/account/CreateAvailabilityForm.js
'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/utils/api';

const CreateAvailabilityForm = ({ user, onClose, onCreate }) => {
  const [clinics] = useState(user.clinics || []);
  const [specializations] = useState(user.specializations || []);
  const [days, setDays] = useState([]);
  const [selectedClinic, setSelectedClinic] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [slotDuration, setSlotDuration] = useState(30);
  const [virtual, setVirtual] = useState(false);  // New state for virtual
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDays = async () => {
      try {
        const { data } = await apiClient.get('/auth/days_of_week/');
        setDays(data);
      } catch (err) {
        setError('Failed to load days of week');
      }
    };
    fetchDays();
  }, []);

  const handleDayChange = (dayId) => {
    setSelectedDays((prev) =>
      prev.includes(dayId) ? prev.filter((id) => id !== dayId) : [...prev, dayId]
    );
  };

  const handleVirtualChange = (e) => {
    setVirtual(e.target.checked);
    if (e.target.checked) {
      setSelectedClinic('');  // Clear clinic when virtual
      setSelectedSpecialization('');  // Clear specialization when virtual
    }
  };

  const handleSubmit = async () => {
    if (selectedDays.length === 0 || !startTime || !endTime) {
      setError('Days, start time, and end time are required');
      return;
    }
    if (!virtual && (!selectedClinic || !selectedSpecialization)) {
      setError('Clinic and specialization are required for in-person availability');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data } = await apiClient.post('/auth/create_availability/', {
        clinic: virtual ? null : selectedClinic,
        specialization: virtual ? null : selectedSpecialization,
        days: selectedDays,
        start_time: startTime,
        end_time: endTime,
        slot_duration: slotDuration,
        virtual,  // Include virtual field
      });
      onCreate(data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create availability');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center text-black items-center z-50">
      <div className="relative bg-white p-6 w-full sm:h-auto sm:max-w-md sm:rounded-lg xs:h-full">
        <button onClick={onClose} className="absolute top-2 right-2 text-black hover:text-gray-700">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h3 className="text-lg font-normal font-['Inter'] sm:mb-4 xs:mb-8">Create Availability</h3>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        <div className="h-[90%] flex flex-col sm:gap-6 xs:gap-8">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={virtual} onChange={handleVirtualChange} />
            Virtual Appointment
          </label>
          {!virtual && (
            <>
              <select
                value={selectedClinic}
                onChange={(e) => setSelectedClinic(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select Clinic</option>
                {clinics.map((clinic) => (
                  <option key={clinic.id} value={clinic.id}>{clinic.name}</option>
                ))}
              </select>
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select Specialization</option>
                {specializations.map((spec) => (
                  <option key={spec.id} value={spec.id}>{spec.name}</option>
                ))}
              </select>
            </>
          )}
          <div className="flex flex-wrap gap-2">
            {days.map((day) => (
              <label key={day.id} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={selectedDays.includes(day.id)}
                  onChange={() => handleDayChange(day.id)}
                />
                {day.name}
              </label>
            ))}
          </div>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          <select
            value={slotDuration}
            onChange={(e) => setSlotDuration(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">60 minutes</option>
          </select>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-2 rounded-md text-white font-normal font-['Inter'] sm:mt-none xs:mt-auto ${loading ? 'bg-orange-400' : 'bg-[#ee6c4d] hover:bg-[#ff7653]'}`}
          >
            {loading ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateAvailabilityForm;