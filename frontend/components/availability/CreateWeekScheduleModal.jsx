import React, { useState, useEffect, useRef } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { startOfWeek, addWeeks, addDays, format } from 'date-fns';
import ClinicSearchBar from '../search/ClinicSearchBar';

const CreateWeekScheduleModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [weekDays, setWeekDays] = useState([]);
  const [showActionButtons, setShowActionButtons] = useState(false);
  const [selectedHours, setSelectedHours] = useState([]);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [appointmentType, setAppointmentType] = useState('inPerson');
  const dropdownRef = useRef(null);

  const currentDate = new Date(2025, 4, 22);
  const weeks = [
    {
      label: 'This Week',
      start: startOfWeek(currentDate, { weekStartsOn: 1 }),
      end: addDays(startOfWeek(currentDate, { weekStartsOn: 1 }), 6),
    },
    {
      label: 'Next Week',
      start: addWeeks(startOfWeek(currentDate, { weekStartsOn: 1 }), 1),
      end: addDays(addWeeks(startOfWeek(currentDate, { weekStartsOn: 1 }), 1), 6),
    },
    {
      label: 'Third Week',
      start: addWeeks(startOfWeek(currentDate, { weekStartsOn: 1 }), 2),
      end: addDays(addWeeks(startOfWeek(currentDate, { weekStartsOn: 1 }), 2), 6),
    },
  ];

  const hoursOfDay = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

  const handleDropdownClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  const resetForm = () => {
    setIsOpen(false);
    setSelectedWeek(null);
    setSelectedDay(null);
    setWeekDays([]);
    setShowActionButtons(false);
    setSelectedHours([]);
    setSelectedClinic(null);
    setAppointmentType('inPerson');
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleDropdownClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleDropdownClickOutside);
    };
  }, [isDropdownOpen]);

  const handleWeekSelect = (weekIndex) => {
    setSelectedWeek(weekIndex);
    setSelectedDay(null);
    setWeekDays([]);
    setShowActionButtons(false);
    setSelectedHours([]);
    setSelectedClinic(null);
    setAppointmentType('inPerson');
    setIsDropdownOpen(false);
  };

  const getSelectedWeekText = () => {
    if (selectedWeek === null) return 'Select a week';
    const week = weeks[selectedWeek];
    return `${week.label} (${format(week.start, 'MMMM do')} to ${format(week.end, 'MMMM do')})`;
  };

  const getDaysForWeek = (weekStart) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = addDays(weekStart, i);
      days.push({
        fullName: format(day, 'EEEE'),
        initials: format(day, 'EEE').toUpperCase(),
        label: format(day, 'EEEE, MMMM do'),
        date: format(day, 'yyyy-MM-dd'),
      });
    }
    return days;
  };

  const handleDayClick = (date) => {
    console.log('Selected date:', date);
    setSelectedDay(date);
    const existingDay = weekDays.find((wd) => wd.day === date);
    setSelectedHours(existingDay ? existingDay.hours : []);
    setSelectedClinic(existingDay ? existingDay.place : null);
    setAppointmentType(existingDay ? existingDay.appointmentType : 'inPerson');
    setShowActionButtons(true);
  };

  const handleHourChange = (hour) => {
    setSelectedHours((prev) =>
      prev.includes(hour)
        ? prev.filter((h) => h !== hour)
        : [...prev, hour].sort()
    );
  };

  const handleAppointmentTypeChange = (type) => {
    setAppointmentType(type);
    if (type === 'virtual') {
      setSelectedClinic(null);
    }
  };

  const handleClinicChange = (clinic) => {
    setSelectedClinic({ id: clinic.id, name: clinic.name });
  };

  const handleCancelAction = () => {
    setSelectedDay(null);
    setSelectedHours([]);
    setSelectedClinic(null);
    setAppointmentType('inPerson');
    setShowActionButtons(false);
  };

  const handleDoneAction = () => {
    if (selectedHours.length === 0 || (appointmentType === 'inPerson' && !selectedClinic)) return;
    setWeekDays((prev) => {
      const existingIndex = prev.findIndex((wd) => wd.day === selectedDay);
      const newEntry = {
        day: selectedDay,
        hours: selectedHours,
        place: appointmentType === 'inPerson' ? selectedClinic : null,
        appointmentType
      };
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newEntry;
        return updated;
      }
      return [...prev, newEntry];
    });
    setSelectedDay(null);
    setSelectedHours([]);
    setSelectedClinic(null);
    setAppointmentType('inPerson');
    setShowActionButtons(false);
  };

  const handleRemoveAction = () => {
    setWeekDays((prev) => prev.filter((wd) => wd.day !== selectedDay));
    setSelectedDay(null);
    setSelectedHours([]);
    setSelectedClinic(null);
    setAppointmentType('inPerson');
    setShowActionButtons(false);
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Create Week Schedule
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <button
              onClick={resetForm}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              aria-label="Close modal"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            <h2 className="text-2xl font-semibold mb-4">Create Week Schedule</h2>
            <div className="space-y-4">
              <div className="relative" ref={dropdownRef}>
                <label htmlFor="weekInput" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Week
                </label>
                <input
                  id="weekInput"
                  type="text"
                  value={getSelectedWeekText()}
                  onClick={() => setIsDropdownOpen(true)}
                  readOnly
                  className="w-full border border-gray-300 rounded-md p-2 cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {isDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-auto">
                    {weeks.map((week, index) => (
                      <div
                        key={index}
                        onClick={() => handleWeekSelect(index)}
                        className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                          selectedWeek === index ? 'bg-blue-100' : ''
                        }`}
                      >
                        {`${week.label} (${format(week.start, 'MMMM do')} to ${format(week.end, 'MMMM do')})`}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedWeek !== null && (
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Select Days</h3>
                  <div className="flex flex-wrap gap-2">
                    {getDaysForWeek(weeks[selectedWeek].start).map((day) => (
                      <button
                        key={day.date}
                        onClick={() => handleDayClick(day.date)}
                        className={`px-3 py-1 rounded-md transition-colors ${
                          selectedDay === day.date
                            ? 'bg-blue-600 text-white'
                            : weekDays.some((wd) => wd.day === day.date)
                            ? 'bg-blue-600 text-white border-2 border-blue-800'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        <span className="sm:hidden">{day.initials}</span>
                        <span className="hidden sm:block">{day.fullName}</span>
                      </button>
                    ))}
                  </div>
                  {showActionButtons && (
                    <div className="mt-4">
                      <p className="text-gray-700 mb-2">
                        {getDaysForWeek(weeks[selectedWeek].start).find((d) => d.date === selectedDay)?.label}
                      </p>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Hours
                        </label>
                        <div className="grid grid-cols-4 gap-2 max-h-40 overflow-auto">
                          {hoursOfDay.map((hour) => (
                            <label key={hour} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedHours.includes(hour)}
                                onChange={() => handleHourChange(hour)}
                                className="mr-2"
                              />
                              {hour}
                            </label>
                          ))}
                        </div>
                        {selectedHours.length === 0 && (
                          <p className="text-red-500 text-sm mt-2">Please select at least one hour.</p>
                        )}
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Appointment Type
                        </label>
                        <div className="flex gap-4">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={appointmentType === 'inPerson'}
                              onChange={() => handleAppointmentTypeChange('inPerson')}
                              className="mr-2"
                            />
                            In Person
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={appointmentType === 'virtual'}
                              onChange={() => handleAppointmentTypeChange('virtual')}
                              className="mr-2"
                            />
                            Virtual
                          </label>
                        </div>
                      </div>
                      {appointmentType === 'inPerson' && (
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Clinic
                          </label>
                          <ClinicSearchBar
                            restrictToDoctorClinics={true}
                            value={selectedClinic?.name || ''}
                            onChange={handleClinicChange}
                            round="rounded-md"
                          />
                          {!selectedClinic && (
                            <p className="text-red-500 text-sm mt-2">Please select a clinic.</p>
                          )}
                        </div>
                      )}
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={handleCancelAction}
                          className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleRemoveAction}
                          className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                          Remove
                        </button>
                        <button
                          onClick={handleDoneAction}
                          disabled={selectedHours.length === 0 || (appointmentType === 'inPerson' && !selectedClinic)}
                          className={`px-3 py-1 rounded-md ${
                            selectedHours.length === 0 || (appointmentType === 'inPerson' && !selectedClinic)
                              ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (selectedWeek !== null) {
                    console.log('Data to post:', {
                      week: format(weeks[selectedWeek].start, 'yyyy-MM-dd'),
                      weekdays: weekDays
                    });
                  }
                  resetForm();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateWeekScheduleModal;