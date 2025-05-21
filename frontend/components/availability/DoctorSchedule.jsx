import { useState, useEffect, useRef } from 'react';
import { FaEllipsisV } from 'react-icons/fa';
import { apiClient } from '@/utils/api';
import ScheduleCreationModal from './ScheduleCreationModal';
import CustomAlert from '@/components/CustomAlert';

export default function DoctorSchedule({ schedule, onUpdate }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertStatus, setAlertStatus] = useState(null);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clear alert after 5 seconds
  useEffect(() => {
    console.log('Alert state:', { alertMessage, alertStatus });
    if (alertMessage) {
      const timer = setTimeout(() => {
        console.log('Clearing alert');
        setAlertMessage(null);
        setAlertStatus(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  // Handle edit button click
  const handleEdit = () => {
    console.log('Opening edit modal for schedule:', schedule);
    setIsEditModalOpen(true);
    setIsMenuOpen(false);
  };

  // Handle delete button click
  const handleDelete = async () => {
    console.log('Deleting schedule:', schedule.id);
    setAlertMessage(null);
    try {
      await apiClient.delete(`/auth/delete_schedule/${schedule.id}/`);
      console.log('Schedule deleted successfully');
      setAlertMessage('Schedule deleted successfully');
      setAlertStatus('success');
      setIsMenuOpen(false);
      onUpdate();
    } catch (err) {
      console.error('Error deleting schedule:', err);
      let errorMessage = 'Failed to delete schedule';
      if (err.response?.status === 401) {
        errorMessage = 'Unauthorized: Please log in again';
      } else if (err.response?.status === 403) {
        errorMessage = 'Only doctors can delete schedules';
      } else if (err.response?.status === 404) {
        errorMessage = 'Schedule not found';
      }
      setAlertMessage(errorMessage);
      setAlertStatus('error');
    }
  };

  // Handle modal close or submit
  const handleModalClose = (success = false, error = null) => {
    console.log('Closing edit modal, success:', success, 'error:', error);
    setIsEditModalOpen(false);
    if (success) {
      setAlertMessage('Schedule updated successfully');
      setAlertStatus('success');
      onUpdate();
    } else if (error) {
      setAlertMessage(error);
      setAlertStatus('error');
    }
  };

  return (
    <>
      <CustomAlert message={alertMessage} status={alertStatus} />
      <div className="relative flex justify-between items-center bg-white shadow-md rounded-lg p-4 text-gray-700">
        <div>
          <h3 className="font-semibold text-base">{schedule.title}</h3>
        </div>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="Schedule options"
          >
            <FaEllipsisV className="h-5 w-5 text-gray-500" />
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 shadow-lg rounded-md z-10">
              <button
                onClick={handleEdit}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      <ScheduleCreationModal
        initialData={{
          title: schedule.title,
          inPerson: !!schedule.place,
          virtual: !schedule.place,
          location: schedule.place ? `${schedule.place.name}, ${schedule.place.city}, ${schedule.place.state}` : '',
          hours: schedule.hours,
        }}
        scheduleId={schedule.id}
        isEditMode={true}
        isOpen={isEditModalOpen}
        hideButton={true}
        onUpdate={() => handleModalClose(true)}
        onCreate={() => handleModalClose(true)}
        onError={(error) => handleModalClose(false, error)}
      />
    </>
  );
}