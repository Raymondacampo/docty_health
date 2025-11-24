'use client';
import { useEffect, useState } from "react";
import { apiClient } from "../../utils/api";
import { useLoading } from '../../utils/LoadingContext';
import { useAlert } from "@/app/context/AlertContext";

const Field = ({ title, content }: { title: string; content: string }) => {
  return (
    <div className="w-full flex flex-col border-b-3 border-gray-200 pb-2 px-1">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p>{content}</p>
    </div>
  );
};

const EditFullNameField = ({
  firstName,
  lastName,
  onSave,
  onCancel,
}: {
  firstName: string;
  lastName: string;
  onSave: (firstName: string, lastName: string) => void;
  onCancel: () => void;
}) => {
  const [firstNameInput, setFirstNameInput] = useState(firstName);
  const [lastNameInput, setLastNameInput] = useState(lastName);

  return (
    <div className="w-full flex flex-col border-b-3 border-gray-200 pb-2 px-1">
      <h2 className="text-xl font-semibold">Full Name</h2>
      <div className="flex gap-2">
        <input
          type="text"
          value={firstNameInput}
          onChange={(e) => setFirstNameInput(e.target.value)}
          placeholder="First Name"
          className="border border-gray-300 rounded p-2 mt-2 w-1/2"
        />
        <input
          type="text"
          value={lastNameInput}
          onChange={(e) => setLastNameInput(e.target.value)}
          placeholder="Last Name"
          className="border border-gray-300 rounded p-2 mt-2 w-1/2"
        />
      </div>
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => onSave(firstNameInput, lastNameInput)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const EditPhoneNumberField = ({
  value,
  onSave,
  onCancel,
}: {
  value: string;
  onSave: (value: string) => void;
  onCancel: () => void;
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false); // Add saving state

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^\+?[\d\s-]{10,15}$/;
    return phoneRegex.test(phone) && !/[a-zA-Z]/.test(phone);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (!validatePhoneNumber(newValue) && newValue !== '') {
      setError('Please enter a valid phone number (10-15 digits, spaces, or hyphens allowed)');
    } else {
      setError('');
    }
  };

  const handleSave = () => {
    if (saving) return; // Prevent multiple saves
    setSaving(true);
    onSave(inputValue);
    setTimeout(() => setSaving(false), 100); // Simulate save delay
  };

  useEffect(() => {
    setSaving(false); // Reset saving state when value changes or component re-renders
  }, [inputValue]);

  return (
    <div className="w-full flex flex-col border-b-3 border-gray-200 pb-2 px-1">
      <h2 className="text-xl font-semibold">Phone Number</h2>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        className={`border border-gray-300 rounded p-2 mt-2 ${error ? 'border-red-500' : ''}`}
        placeholder="e.g., +1234567890"
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      <div className="flex gap-2 mt-2">
        <button
          onClick={handleSave}
          disabled={!!error || inputValue === '' || saving}
          className={`px-4 py-2 rounded ${
            error || inputValue === '' || saving
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const EditbornDateField = ({
  value,
  onSave,
  onCancel,
}: {
  value: string;
  onSave: (value: string) => void;
  onCancel: () => void;
}) => {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (value) {
      const [yearVal, monthVal, dayVal] = value.split('-');
      setYear(yearVal || '');
      setMonth(monthVal || '');
      setDay(dayVal || '');
    }
  }, [value]);

  const validateDate = (year: string, month: string, day: string) => {
    const dateStr = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateStr)) return false;
    const date = new Date(dateStr);
    const now = new Date();
    return !isNaN(date.getTime()) && date < now;
  };

  const handleSave = () => {
    const dateStr = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    if (!validateDate(year, month, day)) {
      setError('Please enter a valid date in the past (YYYY-MM-DD)');
      return;
    }
    setError('');
    console.log('Saving date of birth:', dateStr);
    onSave(dateStr);
  };

  return (
    <div className="w-full flex flex-col border-b-3 border-gray-200 pb-2 px-1">
      <h2 className="text-xl font-semibold">Date of Birth</h2>
      <div className="flex gap-2 mt-2">
        <input
          type="text"
          value={day}
          onChange={(e) => setDay(e.target.value.slice(0, 2))}
          placeholder="DD"
          className={`border border-gray-300 rounded p-2 w-16 ${error ? 'border-red-500' : ''}`}
          maxLength={2}
        />
        <input
          type="text"
          value={month}
          onChange={(e) => setMonth(e.target.value.slice(0, 2))}
          placeholder="MM"
          className={`border border-gray-300 rounded p-2 w-16 ${error ? 'border-red-500' : ''}`}
          maxLength={2}
        />
        <input
          type="text"
          value={year}
          onChange={(e) => setYear(e.target.value.slice(0, 4))}
          placeholder="YYYY"
          className={`border border-gray-300 rounded p-2 w-24 ${error ? 'border-red-500' : ''}`}
          maxLength={4}
        />
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      <div className="flex gap-2 mt-2">
        <button
          onClick={handleSave}
          disabled={!day || !month || !year || !!error}
          className={`px-4 py-2 rounded ${
            !day || !month || !year || !!error
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const EditGenderField = ({
  value,
  onSave,
  onCancel,
}: {
  value: string;
  onSave: (value: string) => void;
  onCancel: () => void;
}) => {
  const [selectedGender, setSelectedGender] = useState(value === 'M' ? 'Male' : value === 'F' ? 'Female' : '');

  const handleGenderChange = (gender: string) => {
    setSelectedGender(gender);
  };

  return (
    <div className="w-full flex flex-col border-b-3 border-gray-200 pb-2 px-1">
      <h2 className="text-xl font-semibold">Gender</h2>
      <div className="flex gap-4 mt-2">
        <label className="flex items-center">
          <input
            type="radio"
            name="gender"
            checked={selectedGender === 'Male'}
            onChange={() => handleGenderChange('Male')}
            className="mr-2"
          />
          Male
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="gender"
            checked={selectedGender === 'Female'}
            onChange={() => handleGenderChange('Female')}
            className="mr-2"
          />
          Female
        </label>
      </div>
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => onSave(selectedGender.charAt(0))}
          disabled={!selectedGender}
          className={`px-4 py-2 rounded ${
            !selectedGender
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default function PersonalDataPage() {
  const { setIsLoading } = useLoading();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showAlert } = useAlert();
  type PersonalData = {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string | null;
    born_date: string | null;
    gender: string | null;
  };
  const [personalData, setPersonalData] = useState<PersonalData | null>(null);
  const [editStates, setEditStates] = useState({
    fullName: false,
    email: false,
    phoneNumber: false,
    bornDate: false,
    gender: false,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 200);

    const fetchPersonalData = async () => {
      try {
        const response = await apiClient.get('/auth/personal-data/');
        setPersonalData(response.data);
      } catch (error) {
        console.error('Error fetching personal details:', error);
        setError('Failed to load personal data');
      } finally {
        return () => clearTimeout(timer);
      }
    };
    fetchPersonalData();
  }, []);

  const toggleEdit = (field: keyof typeof editStates) => {
    setEditStates((prev) => {
      console.log(`Toggling edit state for ${field}: ${!prev[field]}`);
      return { ...prev, [field]: !prev[field] };
    });
    setError(null);
  };

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSave = async (field: keyof PersonalData | 'fullName', value: string | { firstName: string; lastName: string }) => {
    if (!personalData) {
      setErrorMessage('No personal data available to update.');
      setLoading(false);
      return;
    }
    setErrorMessage(null);
    try {
      let updatedData = { ...personalData };
      if (field === 'fullName' && typeof value !== 'string') {
        updatedData = { ...updatedData, first_name: value.firstName, last_name: value.lastName };
      } else if (typeof value === 'string') {
        updatedData = { ...updatedData, [field]: value };
      }
      const response = await apiClient.put('/auth/personal-data/', updatedData);
      showAlert('Personal data updated successfully', 'success');
      setPersonalData(response.data);
      toggleEdit(field === 'fullName' ? 'fullName' : (field as keyof typeof editStates));
    } catch (error) {
      showAlert(`Failed to update ${field}. Please try again.`, 'error');
      setErrorMessage(`Failed to update ${field}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  if (error && !personalData) return <div className="text-red-500">{error}</div>;

  return (
    <div className="my-[10dvh] max-w-5xl xl:ml-16 text-black">
      <h1 className="text-2xl mb-8">Personal Data</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="xl:px-4 flex flex-col gap-6">
        <div className="relative flex">
          {editStates.fullName ? (
            <EditFullNameField
              firstName={personalData?.first_name || ''}
              lastName={personalData?.last_name || ''}
              onSave={(firstName, lastName) => handleSave('fullName', { firstName, lastName })}
              onCancel={() => toggleEdit('fullName')}
            />
          ) : (
            <>
              <Field
                title="Full Name"
                content={personalData ? `${personalData.first_name} ${personalData.last_name}` : 'Loading...'}
              />
              <button
                onClick={() => toggleEdit('fullName')}
                className="absolute right-0 top-0 border-b text-blue-900 font-semibold"
              >
                Edit
              </button>
            </>
          )}
        </div>
        <div className="relative flex">
          <Field
            title="Email"
            content={personalData?.email || 'Loading...'}
          />
        </div>
        <div className="relative flex">
          {editStates.phoneNumber ? (
            <EditPhoneNumberField
              value={personalData?.phone_number || ''}
              onSave={(value) => [handleSave('phone_number', value), toggleEdit('phoneNumber')]}
              onCancel={() => toggleEdit('phoneNumber')}
            />
          ) : (
            <>
              <Field
                title="Phone Number"
                content={personalData?.phone_number || 'None'}
              />
              <button
                onClick={() => toggleEdit('phoneNumber')}
                className="absolute right-0 top-0 border-b text-blue-900 font-semibold"
              >
                Edit
              </button>
            </>
          )}
        </div>
        <div className="relative flex">
          {editStates.bornDate ? (
            <EditbornDateField
              value={personalData?.born_date || ''}
              onSave={(value) => [handleSave('born_date', value), toggleEdit('bornDate')]}
              onCancel={() => toggleEdit('bornDate')}
            />
          ) : (
            <>
              <Field
                title="Date of Birth"
                content={personalData?.born_date || 'None'}
              />
              <button
                onClick={() => toggleEdit('bornDate')}
                className="absolute right-0 top-0 border-b text-blue-900 font-semibold"
              >
                Edit
              </button>
            </>
          )}
        </div>
        <div className="relative flex">
          {editStates.gender ? (
            <EditGenderField
              value={personalData?.gender || ''}
              onSave={(value) => handleSave('gender', value)}
              onCancel={() => toggleEdit('gender')}
            />
          ) : (
            <>
              <Field
                title="Gender"
                content={personalData?.gender ? (personalData.gender === 'M' ? 'Male' : 'Female') : 'None'}
              />
              <button
                onClick={() => toggleEdit('gender')}
                className="absolute right-0 top-0 border-b text-blue-900 font-semibold"
              >
                Edit
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}