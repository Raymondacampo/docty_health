// DoctorSchedule.tsx
import { useState } from 'react';
import { FaEllipsisV } from 'react-icons/fa';
import { apiClient } from '@/app/utils/api';
import ScheduleCreationModal from './ScheduleCreationModal';
import { useAlert } from '@/app/context/AlertContext';
import type { ScheduleType } from '../page';
import { isObject } from 'framer-motion';

interface DoctorScheduleProps {
  schedule: ScheduleType;
  onUpdate: () => void;
}

export default function DoctorSchedule({ schedule, onUpdate }: DoctorScheduleProps) {
  const { showAlert } = useAlert();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEdit = () => {
    console.log(schedule);
    setIsEditModalOpen(true);
    setIsMenuOpen(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this schedule permanently?')) return;

    try {
      await apiClient.delete(`/auth/delete_schedule/${schedule.id}/`);
      showAlert('Schedule deleted', 'success');
      onUpdate();
    } catch (err: any) {
      showAlert(err.response?.data?.error || 'Failed to delete', 'error');
    }
    setIsMenuOpen(false);
  };

  const closeModal = (success = false, error?: string) => {
    setIsEditModalOpen(false);
    if (success) {
      showAlert('Schedule updated', 'success');
      onUpdate();
    } else if (error) {
      showAlert(error, 'error');
    }
  };

  return (
    <div className="relative">
      {/* Main Card */}
      <div className="flex justify-between items-center bg-white shadow-md border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-800">{schedule.title}</h3>
          
          {schedule.clinic ? (
            <p className="text-sm text-gray-600 mt-1">{schedule.clinic.name}</p>
          ) : (
            <p className="text-sm text-gray-600 mt-1 italic">Virtual Schedule</p>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            {schedule.hours.length > 0 ? (
              schedule.hours.map((hour) => (
                <span
                  key={hour}
                  className="px-3 py-1 text-sm font-bold bg-[#060648]/10 text-[#060648] rounded-full"
                >
                  {hour}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-500">No hours</span>
            )}
          </div>
        </div>

        {/* Three Dots Button */}
        <button
          onClick={() => [setIsMenuOpen(!isMenuOpen), console.log(schedule)]}
          className="p-3 hover:bg-gray-100 rounded-full transition-colors"
        >
          <FaEllipsisV className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Dropdown Menu - Closes when clicking anywhere else because it's conditional */}
      {isMenuOpen && (
        <>
          {/* Backdrop - closes menu on click */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Actual Menu */}
          <div className="absolute right-4 top-full mt-2 w-48 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 overflow-hidden">
            <button
              onClick={handleEdit}
              className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Edit Schedule
            </button>
            <button
              onClick={handleDelete}
              className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              Delete Schedule
            </button>
          </div>
        </>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <ScheduleCreationModal
            initialData={{
            title: schedule.title,
            inPerson: !!schedule.place,
            virtual: !schedule.place,
            location: schedule.place || '',
            hours: schedule.hours,
            }}
            scheduleId={schedule.id}
            isEditMode={true}
            isOpen={isEditModalOpen}
            hideButton={true}
            onUpdate={() => closeModal(true)}
            onError={(err) => closeModal(false, err)}
            onClose={() => setIsEditModalOpen(false)}
        />        
    )}

    </div>
  );
}