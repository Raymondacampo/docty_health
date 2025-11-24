'use client';

import { useState, useEffect } from 'react';
import { apiClient, publicApiClient } from '@/app/utils/api';
import { format } from 'date-fns';
import { useAlert } from '@/app/context/AlertContext';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';

// Types
interface User {
  first_name: string;
  last_name: string;
}

interface Doctor {
  id: number;
  user: User;
}

interface Place {
  name: string;
}

interface AvailableDay {
  id: number;
  day: string; // ISO date string
  hours: string[];
  is_virtual: boolean;
  place?: Place;
}

interface AlertState {
  message: string | null;
  status: 'success' | 'error' | null;
}

interface AuthContextType {
  user: any; // Replace with your actual User type if available
}

export default function AppointmentModal({ doctor, isAuth }: { doctor: Doctor; isAuth: boolean | null }) {
  const { showAlert } = useAlert();
  const router = useRouter();
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [availableDays, setAvailableDays] = useState<AvailableDay[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<AvailableDay | null>(null);
  const [selectedHour, setSelectedHour] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const fetchAvailableDays = async () => {
    console.log('Fetching available days for doctor ID:', doctor.id);
    setLoading(true);
    setError(null);
    try {
      const response = await publicApiClient.get(
        `/doctors/${doctor.id}/available_days/`
      );
      console.log('Available days response:', response.data);
      setAvailableDays(response.data.available_days);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch available days');
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    if (!isAuth) {
      const redirectUrl = encodeURIComponent(window.location.pathname);
      router.push(`/login?redirect=${redirectUrl}`);
      return;
    }
    setModalOpen(true);
    fetchAvailableDays();
  };

  const closeModal = () => {
    setModalOpen(false);
    setAvailableDays([]);
    setError(null);
    setSelectedDay(null);
    setSelectedHour(null);
  };

  const handleDayClick = (day: AvailableDay) => {
    setSelectedDay(day);
    setSelectedHour(null);
  };

  const handleHourClick = (hour: string) => {
    setSelectedHour(hour);
  };

  const handleDoneClick = async () => {
    if (!selectedDay || !selectedHour) return;

    setSubmitting(true);

    try {
      const response = await apiClient.post<{ message: string }>('/auth/create_appointment/', {
        weekday_id: selectedDay.id,
        hour: selectedHour,
      });

      closeModal();
      showAlert('Appointment created successfully!', 'success');

      setTimeout(() => {
      }, 3000);
    } catch (err: any) {

      showAlert(err.response?.data?.error || 'Failed to create appointment', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return format(date, 'EEE, MMMM d, yyyy');
    } catch (error) {
      console.error('Error parsing date:', error);
      return dateString;
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={openModal}
        className="w-full bg-white border border-blue-700 text-blue-700 px-4 hover:bg-gray-100 py-2 rounded-md transition"
      >
        Make Appointment
      </button>

      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white shadow-lg p-6 w-full relative sm:max-w-xl sm:h-auto sm:rounded-lg xs:h-screen">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              aria-label="Close modal"
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
              Book an Appointment with Dr. {doctor.user.first_name} {doctor.user.last_name}
            </h2>

            {loading && <p className="text-gray-600">Loading available days...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && availableDays.length === 0 && (
              <p className="text-gray-600">No available days for this doctor.</p>
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
                      {day.is_virtual ? '(Virtual)' : `(${day.place?.name || 'In-person'})`}
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

            <div className="mt-6 flex justify-end gap-4 sm:static xs:absolute xs:bottom-4 xs:left-0 xs:w-full xs:px-4">
              <button
                onClick={closeModal}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>

              {selectedHour && isAuth ? (
                <button
                  onClick={handleDoneClick}
                  disabled={submitting}
                  className={`bg-[#ee6c4d] text-white px-4 py-2 rounded-md transition ${
                    submitting
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:opacity-90'
                  }`}
                >
                  {submitting ? 'Submitting...' : 'Make appointment'}
                </button>
              ) : (
                <a
                  href="/login"
                  className="bg-[#ee6c4d] text-white px-4 py-2 rounded-md transition hover:opacity-90 inline-block text-center"
                >
                  Make appointment
                </a>
              )}
            </div>
          </div>
        </div>
      
      , document.body)}
    </div>
  );
}