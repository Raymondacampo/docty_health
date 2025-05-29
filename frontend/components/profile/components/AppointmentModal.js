'use client';

import { useState, useEffect } from 'react';
import { apiClient,publicApiClient } from '@/utils/api';
import { format, parseISO } from 'date-fns';
import CustomAlert from '@/components/CustomAlert';
import { useAuth } from '@/context/auth';

export default function AppointmentModal({ doctor }) {
  const { user } = useAuth();
  const [isModalOpen, setModalOpen] = useState(false);
  const [availableDays, setAvailableDays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [successAlert, setSuccessAlert] = useState({ message: null, status: null });
  const [errorAlert, setErrorAlert] = useState({ message: null, status: null });

  const fetchAvailableDays = async () => {
    setLoading(true);
    try {
      const response = await publicApiClient.get(`/doctors/${doctor.id}/available_days/`);
      setAvailableDays(response.data.available_days);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch available days');
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setModalOpen(true);
    fetchAvailableDays();
  };

  const closeModal = () => {
    setModalOpen(false);
    setAvailableDays([]);
    setError(null);
    setSelectedDay(null);
    setSelectedHour(null);
    setErrorAlert({ message: null, status: null });
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
    setSelectedHour(null);
    setErrorAlert({ message: null, status: null });
  };

  const handleHourClick = (hour) => {
    setSelectedHour(hour);
    setErrorAlert({ message: null, status: null });
  };

  const handleDoneClick = async () => {
    if (!selectedDay || !selectedHour) return;
    setSubmitting(true);
    setErrorAlert({ message: null, status: null });
    try {
      const response = await apiClient.post('/auth/create_appointment/', {
        weekday_id: selectedDay.id,
        hour: selectedHour,
      });
      closeModal(); // Close modal immediately
      setSuccessAlert({ message: response.data.message, status: 'success' });
      setTimeout(() => {
        setSuccessAlert({ message: null, status: null });
      }, 3000); // Clear success alert after 3 seconds
    } catch (err) {
      setErrorAlert({
        message: err.response?.data?.error || 'Failed to create appointment',
        status: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'EEE, MMMM d, yyyy'); // e.g., "MON, June 2, 2025"
    } catch (error) {
      console.error('Error parsing date:', error);
      return dateString;
    }
  };

  return (
    <div className="w-full">
      {successAlert.message && (
        <CustomAlert message={successAlert.message} status={successAlert.status} />
      )}

      <button
        onClick={openModal}
        className="w-full bg-white border border-blue-700 text-blue-700 px-4 hover:bg-gray-100 py-2 rounded-md transition"
      >
        Make Appointment
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white shadow-lg p-6 w-full  relative
          sm:max-w-xl sm:h-auto sm:rounded-lg
          xs:h-screen ">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h2 className="text-xl font-semibold mb-4 sm:mt-0 xs:mt-4">
              Book an Appointment with Dr. {doctor.user.first_name}{' '}
              {doctor.user.last_name}
            </h2>

            {loading && <p className="text-gray-600">Loading available days...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && availableDays.length === 0 && (
              <p className="text-gray-600">No available days for this doctor.</p>
            )}

            {errorAlert.message && (
              <CustomAlert message={errorAlert.message} status={errorAlert.status} />
            )}

            {availableDays.length > 0 && (
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">Select a Day</label>
                <div className="flex flex-wrap gap-2">
                  {availableDays.map((day) => (
                    <button
                      key={day.id}
                      onClick={() => handleDayClick(day)}
                      className={`inline-block px-3 py-2 text-sm rounded-md transition ${
                        selectedDay?.id === day.id
                          ? 'bg-blue-800 text-white'
                          : 'bg-gray-100 text-black border border-gray-300 hover:bg-blue-800 hover:text-white'
                      }`}
                    >
                      {formatDate(day.day)}{' '}
                      {day.is_virtual ? '(Virtual)' : `(${day.place.name})`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedDay && (
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">Select an Hour</label>
                <div className="max-h-40 overflow-y-auto flex flex-wrap gap-2">
                  {selectedDay.hours.map((hour) => (
                    <button
                      key={hour}
                      onClick={() => handleHourClick(hour)}
                      className={`inline-block px-3 py-1 rounded-md transition ${
                        selectedHour === hour
                          ? 'bg-blue-800 text-white'
                          : 'bg-gray-100 text-black border border-gray-300 hover:bg-blue-800 hover:text-white'
                      }`}
                    >
                      {hour}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-4 
                sm:static
                xs:absolute xs:bottom-4 xs:left-0 xs:w-full xs:px-4">
                <button
                onClick={closeModal}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition">
                Cancel
                </button>
                {selectedHour && user ? (
                    <button
                    onClick={handleDoneClick}
                    disabled={submitting}
                    className={`bg-[#ee6c4d] text-white px-4 py-2 rounded-md transition ${
                        submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#ee6c4d] hover:opacity-90'
                    }`}
                    >
                    {submitting ? 'Submitting...' : 'Make appointment'}
                    </button>                        
                        
                ):(
                    <a href='/login' className='bg-[#ee6c4d] text-white px-4 py-2 rounded-md transition hover:bg-[#ee6c4d] hover:opacity-90'>Make appointment</a>
                )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}