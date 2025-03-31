'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateAvailabilityForm = ({ user, onClose, onCreate }) => {
  const [clinics, setClinics] = useState(user.clinics || []);
  const [specializations, setSpecializations] = useState(user.specializations || []);
  const [days, setDays] = useState([]);
  const [selectedClinic, setSelectedClinic] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [slotDuration, setSlotDuration] = useState(30);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDays = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/auth/days_of_week/', {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        });
        setDays(response.data);
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

  const handleSubmit = async () => {
    if (!selectedClinic || !selectedSpecialization || selectedDays.length === 0 || !startTime || !endTime) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const accessToken = localStorage.getItem('access_token');
      const response = await axios.post(
        'http://localhost:8000/api/auth/create_availability/',
        {
          clinic: selectedClinic,
          specialization: selectedSpecialization,
          days: selectedDays,
          start_time: startTime,
          end_time: endTime,
          slot_duration: slotDuration,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      onCreate(response.data);
    } catch (err) {
      setError('Failed to create availability');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center text-black items-center z-50">
      <div className="relative bg-white  p-6 w-full
      sm:h-auto sm:max-w-md sm:rounded-lg xs:h-full">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-black hover:text-gray-700"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 18L18 6M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h3 className="text-lg font-normal font-['Inter'] sm:mb-4 xs:mb-8">Create Availability</h3>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        <div className="h-[90%] flex flex-col sm:gap-6 xs:gap-8">
          <select
            value={selectedClinic}
            onChange={(e) => setSelectedClinic(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Clinic</option>
            {clinics.map((clinic) => (
              <option key={clinic.id} value={clinic.id}>
                {clinic.name}
              </option>
            ))}
          </select>
          <select
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Specialization</option>
            {specializations.map((spec) => (
              <option key={spec.id} value={spec.id}>
                {spec.name}
              </option>
            ))}
          </select>
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
            className={`w-full py-2 rounded-md text-white font-normal font-['Inter'] sm:mt-none xs:mt-auto ${
              loading ? 'bg-orange-400' : 'bg-[#ee6c4d] hover:bg-[#ff7653]'
            }`}
          >
            {loading ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateAvailabilityForm;