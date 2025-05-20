import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient, publicApiClient } from '@/utils/api';
import ClinicSearchBar from '../search/ClinicSearchBar';

export default function ScheduleCreationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDoctor, setIsDoctor] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    inPerson: false,
    virtual: false,
    location: '',
    hours: [],
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check if user is a doctor on mount
  useEffect(() => {
    const checkDoctorStatus = async () => {
      try {
        const response = await apiClient.get('/auth/is_doctor/');
        setIsDoctor(response.data.is_doctor);
        if (!response.data.is_doctor) {
          setError('Only doctors can create schedules');
        }
      } catch (err) {
        setIsDoctor(false);
        setError('Please log in to create a schedule');
      }
    };
    checkDoctorStatus();
  }, []);

  // Generate all hours of the day in HH:00 format
  const allHours = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      if (type === 'checkbox') {
        if (name === 'inPerson') {
          return { ...prev, inPerson: checked, virtual: false, location: checked ? prev.location : '' };
        } else if (name === 'virtual') {
          return { ...prev, virtual: checked, inPerson: false, location: '' };
        }
      }
      return { ...prev, [name]: value };
    });
    setError(null);
  };

  const handleHourChange = (hour) => {
    setFormData((prev) => {
      const hours = prev.hours.includes(hour)
        ? prev.hours.filter((h) => h !== hour)
        : [...prev.hours, hour];
      return { ...prev, hours };
    });
    setError(null);
  };

  const handleLocationChange = (location) => {
    setFormData((prev) => ({ ...prev, location }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validate form
    if (!formData.title.trim()) {
      setError('Title is required');
      setLoading(false);
      return;
    }
    if (!formData.inPerson && !formData.virtual) {
      setError('Select at least one of In-Person or Virtual');
      setLoading(false);
      return;
    }
    if (formData.inPerson && !formData.location) {
      setError('Please select a clinic for in-person schedule');
      setLoading(false);
      return;
    }
    if (formData.hours.length === 0) {
      setError('Select at least one hour');
      setLoading(false);
      return;
    }

    try {
      let placeId = null;
      if (formData.inPerson && formData.location) {
        if (!formData.location) {
          console.log(clinics, formData.location);
          setError('Selected a clinic');
          setLoading(false);
          return;
        }
        placeId = formData.location.id;
      }

      // Prepare payload
      const payload = {
        title: formData.title,
        hours: formData.hours,
        place: placeId, // null for virtual-only schedules
      };

      // Submit to API using apiClient (authenticated)
      const response = await apiClient.post('/auth/create_schedule/', payload);
      console.log('Schedule created:', response.data);
      setIsOpen(false);
      // Reset form
      setFormData({
        title: '',
        inPerson: false,
        virtual: false,
        location: '',
        hours: [],
      });
    } catch (err) {
      console.error('Error creating schedule:', err);
      if (err.response?.status === 401) {
        setError('Unauthorized: Please log in again');
      } else if (err.response?.status === 400 && err.response?.data?.error === 'User is not a doctor') {
        setError('Only doctors can create schedules');
      } else {
        setError(
          err.response?.data?.hours?.[0] ||
          err.response?.data?.error ||
          'Failed to create schedule'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setError(null);
    setFormData({
      title: '',
      inPerson: false,
      virtual: false,
      location: '',
      hours: [],
    });
  };

  return (
    <div>
      <button
        onClick={() => isDoctor && setIsOpen(true)}
        className={`px-4 py-2 bg-blue-600 text-white rounded-md transition ${
          isDoctor ? 'hover:bg-blue-700' : 'opacity-50 cursor-not-allowed'
        }`}
        disabled={!isDoctor}
      >
        Create Schedule
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold text-black mb-4">
                Create Schedule
              </h2>
              <form onSubmit={handleSubmit}>
                {/* Title */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="mt-1 px-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="e.g., Morning Schedule"
                  />
                </div>

                {/* Checkboxes: In-Person and Virtual */}
                <div className="mb-4 flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="inPerson"
                      checked={formData.inPerson}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">In-Person</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="virtual"
                      checked={formData.virtual}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Virtual</span>
                  </label>
                </div>

                {/* ClinicSearchBar for In-Person */}
                {formData.inPerson && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Clinic
                    </label>
                    <ClinicSearchBar
                      value={formData.location}
                      onChange={handleLocationChange}
                      round="rounded-md"
                      restrictToDoctorClinics={true}
                    />
                  </div>
                )}

                {/* Hours Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Available Hours
                  </label>
                  <div className="mt-2 grid grid-cols-4 gap-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2">
                    {allHours.map((hour) => (
                      <label key={hour} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.hours.includes(hour)}
                          onChange={() => handleHourChange(hour)}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{hour}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-4 text-red-500 text-sm">{error}</div>
                )}

                {/* Submit and Cancel Buttons */}
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}