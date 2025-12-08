import { useState, useEffect, FormEvent, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '@/app/utils/api';
import ClinicSearchBar from './ClinicSearchBar';
import { useLoading } from '@/app/utils/LoadingContext';
import { useAlert } from '@/app/context/AlertContext';
// Define types
export type Clinic = {
  id: number | string;
  name: string;
}

interface ScheduleFormData {
  title: string;
  inPerson: boolean;
  virtual: boolean;
  location: Clinic | '';
  hours: string[];
}

interface ScheduleCreationModalProps {
  initialData?: ScheduleFormData;
  scheduleId?: number | string | null;
  isEditMode?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  hideButton?: boolean;
  onUpdate?: () => void;
  onCreate?: () => void;
  onError?: (error: string) => void;
}

export default function ScheduleCreationModal({
  initialData = {
    title: '',
    inPerson: false,
    virtual: false,
    location: '',
    hours: [],
  },
  scheduleId = null,
  isEditMode = false,
  isOpen = false,
  hideButton = false,
  onUpdate = () => {},
  onCreate = () => {},
  onError = () => {},
  onClose = () => {},
}: ScheduleCreationModalProps) {
  const { setIsLoading } = useLoading();
  const { showAlert } = useAlert();
  const loading = useLoading().isLoading;
  const [modalOpen, setModalOpen] = useState<boolean>(isOpen);
  const [formData, setFormData] = useState<ScheduleFormData>(initialData);
  const [error, setError] = useState<string | null>(null);
  // const [loading, setLoading] = useState<boolean>(false);
  const [clinic, setClinic] = useState<Clinic | null>(null);

  // Sync external isOpen prop
  useEffect(() => {
    setModalOpen(isOpen);
  }, [isOpen]);

  // Generate 24 hours in HH:00 format
  const allHours: string[] = Array.from({ length: 24 }, (_, i) => {
    return `${i.toString().padStart(2, '0')}:00`;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => {
      if (type === 'checkbox') {
        if (name === 'inPerson') {
          return {
            ...prev,
            inPerson: checked,
            virtual: false,
            location: checked ? prev.location : '',
          };
        }
        if (name === 'virtual') {
          return {
            ...prev,
            virtual: checked,
            inPerson: false,
            location: '',
          };
        }
      }
      return { ...prev, [name]: value };
    });
    setError(null);
  };

  const handleHourChange = (hour: string) => {
    setFormData((prev) => {
      const hours = prev.hours.includes(hour)
        ? prev.hours.filter((h) => h !== hour)
        : [...prev.hours, hour];
      return { ...prev, hours };
    });
    setError(null);
  };

  const handleLocationChange = (location: Clinic | '') => {
    setFormData((prev) => ({ ...prev, location }));
    setError(null);
  };

  useEffect(() => {
    handleLocationChange(clinic || '');
  }, [clinic]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Validation
    if (!formData.inPerson && !formData.virtual) {
      const msg = 'Select at least one of In-Person or Virtual';
      setError(msg);
      onError(msg);
      setIsLoading(false);
      return;
    }

    if (formData.inPerson && !formData.location) {
      const msg = 'Please select a clinic for in-person schedule';
      setError(msg);
      onError(msg);
      setIsLoading(false);
      return;
    }

    if (formData.hours.length === 0) {
      const msg = 'Select at least one hour';
      setError(msg);
      onError(msg);
      setIsLoading(false);
      return;
    }

    try {
      const placeId = formData.inPerson && formData.location ? (formData.location as Clinic).id : null;

      const payload = {
        title: formData.title,
        hours: formData.hours,
        place: placeId,
      };

      if (isEditMode && scheduleId) {
        await apiClient.put(`/auth/update_schedule/${scheduleId}/`, payload);
        showAlert('Schedule updated', 'success');
        onUpdate();
      } else {
        await apiClient.post('/auth/create_schedule/', payload);
        showAlert('Schedule created', 'success');
        onCreate();
      }

      // Reset form and close modal
      setModalOpen(false);
      setFormData({
        title: '',
        inPerson: false,
        virtual: false,
        location: '',
        hours: [],
      });
    } catch (err: any) {
      console.error('Error processing schedule:', err);

      let errorMessage = `Failed to ${isEditMode ? 'update' : 'create'} schedule`;

      if (err.response?.status === 401) {
        errorMessage = 'Unauthorized: Please log in again';
      } else if (err.response?.data?.error === 'User is not a doctor') {
        errorMessage = 'Only doctors can create schedules';
      } else if (err.response?.status === 404 && isEditMode) {
        errorMessage = 'Schedule not found';
      } else if (err.response?.data?.hours?.[0]) {
        errorMessage = err.response.data.hours[0];
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }

      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setModalOpen(false);
    setError(null);
    setFormData(initialData); // Restore initial data on close
    onClose();
  };

  const handleOpen = () => {
      setModalOpen(true);
      setFormData(initialData);
      setError(null);
  };

  return (
    <div>
      {/* {!hideButton && (
        <button
          onClick={handleOpen}
          className={`px-4 py-2 hover:bg-[#060648]/85 bg-[#060648] text-white rounded-md transition-all`}
        >
          {isEditMode ? 'Edit Schedule' : 'Create Schedule'}
        </button>
      )} */}

      <AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {isEditMode ? 'Edit Schedule' : 'Create New Schedule'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Morning Shift"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#060648] text-black"
                    required
                  />
                </div>

                {/* Consultation Type */}
                <div className="flex gap-6">
                  {/* In-Person */}
                  <label className="flex items-center cursor-pointer gap-3">
                    <span className="relative w-5 h-5 flex items-center justify-center">
                      <span className="w-full h-full rounded-full border-2 border-[#2b2774] bg-white" />
                      {formData.inPerson && (
                        <span className="absolute w-[10px] h-[10px] rounded-full bg-[#2b2774]" />
                      )}
                      <input
                        type="checkbox"
                        name="inPerson"
                        checked={formData.inPerson}
                        onChange={handleInputChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </span>
                    <span className="text-gray-700">In-Person</span>
                  </label>

                  {/* Virtual */}
                  <label className="flex items-center cursor-pointer gap-3">
                    <span className="relative w-5 h-5 flex items-center justify-center">
                      <span className="w-full h-full rounded-full border-2 border-[#2b2774] bg-white" />
                      {formData.virtual && (
                        <span className="absolute w-[10px] h-[10px] rounded-full bg-[#2b2774]" />
                      )}
                      <input
                        type="checkbox"
                        name="virtual"
                        checked={formData.virtual}
                        onChange={handleInputChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </span>
                    <span className="text-gray-700">Virtual</span>
                  </label>
                </div>
                {/* Clinic Selection (only if in-person) */}
                {formData.inPerson && (
                  <div className='relative'>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Clinic</label>
                    <ClinicSearchBar value={clinic} onChange={setClinic} />
                  </div>
                )}

                {/* Available Hours */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Hours
                  </label>
                  <div className="grid grid-cols-4 gap-3 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-4 bg-gray-50/70 scrollbar-thin scrollbar-thumb-gray-400">
                    {allHours.map((hour) => {
                      const isSelected = formData.hours.includes(hour);

                      return (
                        <label
                          key={hour}
                          className="group cursor-pointer select-none"
                        >
                          {/* Hidden real checkbox */}
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleHourChange(hour)}
                            className="sr-only" // Tailwind's "screen reader only" – perfect accessibility
                          />

                          {/* Pill button */}
                          <div
                            className={`
                              px-4 py-2.5 rounded-full text-center text-sm font-medium
                              transition-all duration-200 ease-out
                              shadow-sm group-hover:shadow-md
                              ${isSelected
                                ? 'bg-[#2b2774] text-white shadow-purple-500/20'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-[#2b2774]/5 hover:border-[#2b2774]/40'
                              }
                            `}
                          >
                            {hour}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                    {error}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    className="px-5 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2 hover:bg-[#060648]/85 bg-[#060648] text-white rounded-md transition disabled:opacity-50"
                  >
                      {loading
                        ? isEditMode
                          ? 'Updating...'
                          : 'Creating...'
                        : isEditMode
                        ? 'Update Schedule'
                        : 'Create Schedule'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
      </AnimatePresence>
    </div>
  );
}