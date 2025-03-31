'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/utils/api'; // Import apiClient

const EditAvailabilityForm = ({ availability, onClose, onUpdate }) => {
  const [clinics] = useState(availability.user?.clinics || []);
  const [specializations] = useState(availability.user?.specializations || []);
  const [days, setDays] = useState([]);
  const [selectedClinic, setSelectedClinic] = useState(availability.clinic.id);
  const [selectedSpecialization, setSelectedSpecialization] = useState(availability.specialization.id);
  const [selectedDays, setSelectedDays] = useState(availability.days.map(day => day.id));
  const [startTime, setStartTime] = useState(availability.start_time?.slice(0, 5) || '');
  const [endTime, setEndTime] = useState(availability.end_time?.slice(0, 5) || '');
  const [slotDuration, setSlotDuration] = useState(availability.slot_duration || 30);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDays = async () => {
      try {
        const { data } = await apiClient.get('/auth/days_of_week/');
        setDays(data);
      } catch (err) {
        setError('Failed to load days of week');
        console.error(err);
      }
    };
    fetchDays();
  }, []);

  const handleDayChange = (dayId) => {
    setSelectedDays((prev) =>
      prev.includes(dayId) ? prev.filter((id) => id !== dayId) : [...prev, dayId]
    );
  };

  const handleSubmit = async () => {
    if (!selectedClinic || !selectedSpecialization || selectedDays.length === 0 || !startTime || !endTime) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data } = await apiClient.put(`/auth/update_availability/${availability.id}/`, {
        clinic: selectedClinic,
        specialization: selectedSpecialization,
        days: selectedDays,
        start_time: startTime,
        end_time: endTime,
        slot_duration: slotDuration,
      });
      onUpdate(data);
      onClose();
    } catch (err) {
      setError('Failed to update availability');
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-black fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative bg-white p-6 w-full sm:h-auto sm:max-w-md sm:rounded-lg xs:h-full">
        <button onClick={onClose} className="absolute top-2 right-2 text-black hover:text-gray-700">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h3 className="text-lg font-normal font-['Inter'] sm:mb-4 xs:mb-8">Edit Availability</h3>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        <div className="h-[90%] flex flex-col sm:gap-6 xs:gap-8">
          <select
            value={selectedClinic}
            onChange={(e) => setSelectedClinic(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Clinic</option>
            {clinics.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Specialization</option>
            {specializations.map((spec) => (
              <option key={spec.id} value={spec.id}>{spec.name}</option>
            ))}
          </select>
          <div className="flex flex-wrap gap-2">
            {days.length > 0 ? (
              days.map((day) => (
                <label key={day.id} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={selectedDays.includes(day.id)}
                    onChange={() => handleDayChange(day.id)}
                  />
                  {day.name}
                </label>
              ))
            ) : (
              <div>Loading days...</div>
            )}
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
            <option value={30}>30 minutes</option>
            <option value={45}>45 minutes</option>
            <option value={60}>60 minutes</option>
          </select>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-2 rounded-md text-white font-normal sm:mt-none xs:mt-auto font-['Inter'] ${loading ? 'bg-gray-400' : 'bg-[#ee6c4d] hover:bg-[#ff7653]'}`}
          >
            {loading ? 'Updating...' : 'Update'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditAvailabilityForm;