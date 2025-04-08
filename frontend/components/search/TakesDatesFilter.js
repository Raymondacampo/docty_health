import { useState } from "react";

export default function TakesDatesFilter({ value, onChange }) {
  const [isDoctifyChecked, setIsDoctifyChecked] = useState(value === "true" || value === "virtual" || value === "in_person");
  const [isVirtualChecked, setIsVirtualChecked] = useState(value === "virtual");
  const [isInPersonChecked, setIsInPersonChecked] = useState(value === "in_person");

  const handleDoctifyChange = (e) => {
    const checked = e.target.checked;
    setIsDoctifyChecked(checked);
    if (!checked) {
      setIsVirtualChecked(false);
      setIsInPersonChecked(false);
      onChange(""); // No filter applied
    } else {
      onChange("true"); // Default to just taking_dates=true
    }
  };

  const handleVirtualChange = (e) => {
    const checked = e.target.checked;
    setIsVirtualChecked(checked);
    if (checked) {
      setIsInPersonChecked(false); // Mutually exclusive for simplicity
      onChange("virtual");
    } else if (isInPersonChecked) {
      onChange("in_person");
    } else {
      onChange("true");
    }
  };

  const handleInPersonChange = (e) => {
    const checked = e.target.checked;
    setIsInPersonChecked(checked);
    if (checked) {
      setIsVirtualChecked(false); // Mutually exclusive for simplicity
      onChange("in_person");
    } else if (isVirtualChecked) {
      onChange("virtual");
    } else {
      onChange("true");
    }
  };

  return (
    <div className="text-black px-2">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-md font-medium text-black">Doctify appointments</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isDoctifyChecked}
            onChange={handleDoctifyChange}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2b2774]"></div>
        </label>

      </div>
      {isDoctifyChecked && (
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