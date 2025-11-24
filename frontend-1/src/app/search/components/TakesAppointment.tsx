import React, { useState } from "react";

interface TakesDatesFilterProps {
  taking_appointments: boolean;
  appointment_type?: string | null;
  onChange: (value: boolean) => void;
  onAppointment: (value: string) => void;
}

export default function TakesDatesFilter({ taking_appointments, appointment_type, onChange, onAppointment }: TakesDatesFilterProps) {
  const [isDoctyChecked, setIsDoctyChecked] = useState<boolean>(taking_appointments === true);
  const [isVirtualChecked, setIsVirtualChecked] = useState<boolean>(appointment_type === "virtual");
  const [isInPersonChecked, setIsInPersonChecked] = useState<boolean>(appointment_type === "in_person");

  const handleDoctyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsDoctyChecked(checked);
    if (!checked) {
      setIsVirtualChecked(false);
      setIsInPersonChecked(false);
      onChange(false); // No filter applied
    } else {
      onChange(true); // Default to just taking_dates=true
    }
  };

  const handleVirtualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsVirtualChecked(checked);
    if (checked) {
      setIsInPersonChecked(false); // Mutually exclusive for simplicity
      onAppointment("virtual");
    } else if (isInPersonChecked) {
      onAppointment("virtual");
    } else {
       onAppointment("virtual");;
    }
  };

  const handleInPersonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsInPersonChecked(checked);
    if (checked) {
      setIsVirtualChecked(false); // Mutually exclusive for simplicity
      onAppointment("in_person");
    } else if (isVirtualChecked) {
      onAppointment("in_person");
    } else {
      onAppointment("in_person");
    }
  };

  return (
    <div className="text-black px-2">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-md font-medium text-black">Takes appointments</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isDoctyChecked}
            onChange={handleDoctyChange}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2b2774]"></div>
        </label>

      </div>
      {isDoctyChecked && (
        <div className="w-full flex flex-col gap-2">
          <div className="flex items-center gap-2 justify-between">
          <span className="text-sm text-gray-700">Virtually</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isVirtualChecked}
                onChange={handleVirtualChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2b2774]"></div>
            </label>
            
          </div>
          <div className="flex items-center gap-2 justify-between">
          <span className="text-sm text-gray-700">In Person</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isInPersonChecked}
                onChange={handleInPersonChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2b2774]"></div>
            </label>
            
          </div>
        </div>
      )}
    </div>
  );
}