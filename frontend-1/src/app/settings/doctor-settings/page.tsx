'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLoading } from '@/app/utils/LoadingContext';
import ClinicSearch from './components/clinic/ClinicSearch';
import { ClinicMenu } from './components/clinic/ClinicMenu';
import SpecialtySearch from './components/specialty/SpecialtySearch';
import { SpecialtyMenu } from './components/specialty/SpecialtyMenu';
import InsuranceSearch from './components/insurance/InsuranceSearch';
import { InsuranceMenu } from './components/insurance/InsuranceMenu';
import { apiClient } from '@/app/utils/api';
import { useAlert } from '@/app/context/AlertContext';

interface FieldProps {
  title: string;
  content: string;
  wide?: boolean;
}

interface ModFieldProps {
  title: string;
  content: string;
  bb?: boolean;
  onModify: () => void;
  isModifying: boolean;
  onCancel: () => void;
  items?: Array<{ id: number; name: string }>;
  onSaveDescription?: (description: string) => Promise<void>;
  onReload: ({msg, status}: {msg: string, status: string}) => void;
}

interface Item {
  id: number;
  name: string;
}

interface DoctorData {
  exequatur: string;
  experience: number;
  description: string;
  specialties: { id: number; name: string }[];
  clinics: { id: number; name: string }[];
  ensurances: { id: number; name: string; logo?: string | null }[];
  documents: { id: number; url: string; description: string }[];
  taking_dates: boolean;
  takes_virtual: boolean;
  takes_in_person: boolean;
}

const Field: React.FC<FieldProps> = ({ title, content, wide }) => {
  return (
    <div className="w-full flex justify-between items-center border-b-3 border-gray-200 pb-2 px-1">
      <div className={wide ? 'flex justify-between w-full pb-3' : ''}>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p>{content}</p>
      </div>
    </div>
  );
};

const ModField: React.FC<ModFieldProps> = ({ title, content, bb, onModify, isModifying, onCancel, items, onSaveDescription, onReload }) => {
  const [description, setDescription] = useState<string>(content);

  useEffect(() => {
    if (title === 'Description') {
      setDescription(content);
    }
  }, [content]);

  const handleSaveDescriptionLocal = async () => {
    if (title === 'Description' && onSaveDescription) {
      await onSaveDescription(description);
    }
  };

  return (
    <div className={`w-full flex justify-between items-start pb-2 px-1 ${bb ? '' : 'border-b-3 border-gray-200'}`}>
      <div className="flex flex-col w-full gap-2 pb-3">
        <h2 className="text-xl font-semibold">{title}</h2>
        {isModifying ? (
          <div className="flex flex-col gap-2">
            {items && items.length > 0 && (
              <ul className="flex gap-2">
                {items.map((item) => (
                  <li key={item.id} className="flex justify-between gap-3 items-center bg-gray-200 px-3 p-1.5 rounded-md">
                    {item.name}
                    {title === 'Specialties' && (
                      <SpecialtyMenu
                        specialty={item}
                        onDelete={onReload}
                      />
                    )}
                    {title === 'Clinics' && (
                      <ClinicMenu clinic={item} onDelete={onReload} />
                    )}
                    {title === 'Insurances' && (
                      <InsuranceMenu
                        Insurance={item}
                        onDelete={onReload}
                      />
                    )}
                  </li>
                ))}
              </ul>
            )}
            {title === 'Specialties' && (
              <SpecialtySearch onSpecialtyAdded={onReload} />
            )}
            {title === 'Clinics' && (
              <ClinicSearch onClinicAdded={onReload} />
            )}
            {title === 'Insurances' && (
              <InsuranceSearch onInsuranceAdded={onReload} />
            )}
            {title === 'Description' && (
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Edit description..."
                className="text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4285f4] focus:border-[#4285f4] text-sm"
                rows={10}
              />
            )}
          </div>
        ) : (
          <p>{content}</p>
        )}
      </div>
      {isModifying ? (
        <div className="flex gap-2">
          {title === 'Description' && (
            <button
              onClick={handleSaveDescriptionLocal}
              className="text-white hover:bg-[#060648]/85 bg-[#060648] cursor-pointer text-sm font-normal px-2.5 py-1 rounded-md"
            >
              Save
            </button>
          )}
          <button
            onClick={onCancel}
            className="text-white hover:bg-[#060648]/85 bg-[#060648] cursor-pointer text-sm font-normal px-2.5 py-1 rounded-md"
          >
            Cancel
          </button>
        </div>
      ) : (
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onModify();
          }}
          className="text-blue-600 hover:underline"
        >
          <p>Modify</p>
        </Link>
      )}
    </div>
  );
};

export default function DoctorSettingsPage() {
  const { setIsLoading } = useLoading();
  const [modifyingField, setModifyingField] = useState<string | null>(null);
  const [user, setUser] = useState<DoctorData | null>(null);
  const { showAlert } = useAlert();

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/auth/personal-data/');
      setUser(response.data.doctor);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const onReload = () => {
    fetchUser();
    setModifyingField(null);
    };

  const handleModify = (field: string) => {
    setModifyingField(field);
  };

  const handleCancel = () => {
    setModifyingField(null);
  };

  const handleSaveDescription = async (description: string) => {
    try {
      await apiClient.put('/auth/update_description/', { description });
      showAlert('Description updated successfully', 'success');
      // Refetch user data to update the UI
      const response = await apiClient.get('/auth/personal-data/');
      setUser(response.data.doctor);
      setModifyingField(null);
      onReload();
    } catch (error) {
      showAlert('Failed to save description. Please try again.', 'error');
    }
  };

  const specialtiesContent = user?.specialties?.map(s => s.name).join(', ') || 'No specialties';
  const clinicsContent = user?.clinics?.map(c => c.name).join(', ') || 'No clinics';
  const insurancesContent = user?.ensurances?.map(e => e.name).join(', ') || 'No insurances';

  return (
    <div className="my-[10dvh] max-w-5xl xl:ml-16 text-black">
      <h1 className="text-2xl mb-8">Doctor Settings</h1>
      <div className="xl:px-4 flex flex-col gap-6">
        <Field title="Exequatur" content={user?.exequatur || '123456789'} wide />
        <Field title="Experience" content={`${user?.experience || 5} years`} wide />
        <ModField
          title="Specialties"
          content={specialtiesContent}
          onModify={() => handleModify('Specialties')}
          isModifying={modifyingField === 'Specialties'}
          onCancel={handleCancel}
          items={user?.specialties || []}
          onReload={onReload}
        />
        <ModField
          title="Clinics"
          content={clinicsContent}
          onModify={() => handleModify('Clinics')}
          isModifying={modifyingField === 'Clinics'}
          onCancel={handleCancel}
          items={user?.clinics || []}
          onReload={onReload}
        />
        <ModField
          title="Insurances"
          content={insurancesContent}
          onModify={() => handleModify('Insurances')}
          isModifying={modifyingField === 'Insurances'}
          onCancel={handleCancel}
          items={user?.ensurances || []}
          onReload={onReload}
        />
        <ModField
          title="Description"
          content={user?.description ?? 'No description available'}
          bb
          onModify={() => handleModify('Description')}
          isModifying={modifyingField === 'Description'}
          onCancel={handleCancel}
          onSaveDescription={handleSaveDescription}
          onReload={onReload}
        />
      </div>
    </div>
  );
}