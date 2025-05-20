import React, { useState, useEffect } from 'react';
import { apiClient } from '@/utils/api';
import ClinicSearch from '../account/ClinicSearch';
const ScheduleForm = () => {
  // State for modal visibility
  const [isOpen, setIsOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    isVirtual: false,
    isInPerson: true,
    place: '',
    hours: [],
  });

  // State for API data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generate 24-hour time slots (00:00 to 23:00)
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: type === 'checkbox' ? checked : value };

      // Reset place if switching to virtual
      if (name === 'isVirtual' && checked) {
        return { ...newData, isInPerson: false, place: '' };
      }
      // Reset virtual if switching to in-person
      if (name === 'isInPerson' && checked) {
        return { ...newData, isVirtual: false };
      }
      return newData;
    });
  };

  // Handle hours checkbox changes
  const handleHoursChange = (time) => {
    setFormData((prev) => {
      const hours = prev.hours.includes(time)
        ? prev.hours.filter((t) => t !== time)
        : [...prev.hours, time].sort(); // Sort for consistent order
      return { ...prev, hours };
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        place: formData.isVirtual ? null : formData.place,
        hours: formData.hours,
        title: formData.title || undefined, // Let backend generate default title if empty
      };

      await apiClient.post('/schedules/', payload);

      // Reset form and close modal
      setFormData({
        title: '',
        isVirtual: false,
        isInPerson: true,
        place: '',
        hours: [],
      });
      setIsOpen(false);
      alert('Schedule created successfully!');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create schedule. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Button to open modal */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Create Schedule
        </button>
      )}

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4">Create Schedule</h2>
            <form onSubmit={handleSubmit}>
              {/* Title */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Title (optional)</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter schedule title"
                />
              </div>

              {/* Checkboxes */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Appointment Type</label>
                <div className="flex space-x-4 mt-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isInPerson"
                      checked={formData.isInPerson}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    In-Person
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isVirtual"
                      checked={formData.isVirtual}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Virtual
                  </label>
                </div>
              </div>

              {/* In-Person Clinic Selection */}

              {formData.isInPerson &&(
                <ClinicSearch
                  onSelect={(clinic) => setFormData((prev) => ({ ...prev, place: clinic.id }))}
                  selectedClinic={formData.place}
                  className="mb-4"
                />
              )}

              {/* Hours Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Available Hours</label>
                <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto mt-2">
                  {timeSlots.map((time) => (
                    <label key={time} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.hours.includes(time)}
                        onChange={() => handleHoursChange(time)}
                        className="mr-2"
                      />
                      {time}
                    </label>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

              {/* Submit and Cancel Buttons */}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || formData.hours.length === 0}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                  {loading ? 'Creating...' : 'Create Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleForm;