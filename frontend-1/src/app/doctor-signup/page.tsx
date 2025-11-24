// app/doctor-signup/page.tsx
'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { publicApiClient } from '@/app/utils/api';
import { login } from '@/app/utils/auth';
import SearchBar from './components/SearchBar';
import Loading from '@/app/components/LoadingComponent';

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
  born_date: string;
  sex: string;
  exequatur: string;
  experience: string;
  specialty: string;
  clinic: string;
  ensurance: string;
}

interface Errors {
  [key: string]: string | string[] | undefined;
  non_field_errors?: string[];
}

export default function DoctorSignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
    born_date: '',
    sex: '',
    exequatur: '',
    experience: '',
    specialty: '',
    clinic: '',
    ensurance: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? (checked ? value : '') : value;

    setFormData(prev => ({ ...prev, [name]: newValue }));
    validateField(name, newValue);
  };

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };

    if (value.trim() === '' && name !== 'ensurance') {
      newErrors[name] = `${name.replace(/_/g, ' ')} is required`;
    } else {
      delete newErrors[name];
    }

    // Specific validations
    if (name === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (name === 'password' && value && value.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (name === 'confirm_password' && value !== formData.password) {
      newErrors.confirm_password = 'Passwords do not match';
    }
    if (name === 'experience' && value && (isNaN(Number(value)) || Number(value) < 0)) {
      newErrors.experience = 'Must be a positive number';
    }

    setErrors(newErrors);
  };

  const handleSearchChange = (field: 'specialty' | 'clinic' | 'ensurance') => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (value.trim() === '' && field !== 'ensurance') {
      setErrors(prev => ({ ...prev, [field]: `${field} is required` }));
    } else {
      setErrors(prev => { const { [field]: _, ...rest } = prev; return rest; });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Final validation
    const validationErrors: Errors = {};
    (Object.keys(formData) as (keyof FormData)[]).forEach(key => {
      if (!formData[key] && key !== 'ensurance') {
        validationErrors[key] = `${key.replace(/_/g, ' ')} is required`;
      }
    });

    if (formData.password && formData.password.length < 8) validationErrors.password = 'Password too short';
    if (formData.confirm_password !== formData.password) validationErrors.confirm_password = 'Passwords do not match';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) validationErrors.email = 'Invalid email';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      // Fetch reference data
      const [specialtiesRes, clinicsRes, ensurancesRes] = await Promise.all([
        publicApiClient.get('/all_specialties/'),
        publicApiClient.get('/all_clinics/'),
        publicApiClient.get('/all_ensurances/'),
      ]);

      const specialty = specialtiesRes.data.find((s: any) => s.name === formData.specialty);
      const clinic = clinicsRes.data.find((c: any) => c.name === formData.clinic);
      const ensurance = ensurancesRes.data.find((e: any) => e.name === formData.ensurance);

      if (!specialty) return setErrors({ specialty: 'Invalid specialty selected' });
      if (!clinic) return setErrors({ clinic: 'Invalid clinic selected' });

      const payload = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        confirm_password: formData.confirm_password,
        born_date: formData.born_date,
        sex: formData.sex,
        exequatur: formData.exequatur.trim(),
        experience: parseInt(formData.experience, 10),
        specialties: [specialty.id],
        clinics: [clinic.id],
        ensurances: ensurance ? [ensurance.id] : [],
      };

      const { data } = await publicApiClient.post('/auth/doctor_signup/', payload);

      await login(data.access);
      localStorage.setItem('refresh_token', data.refresh);

      setTimeout(() => router.push('/account'), 500);
    } catch (err: any) {
      console.error('Doctor signup error:', err);
      const errData = err.response?.data;
      setErrors(errData || { non_field_errors: ['Something went wrong. Please try again.'] });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loading text="Creating doctor account..." />;

  return (
    <div className="flex flex-col w-full mt-[14dvh] px-4 mb-[14dvh] justify-center items-center">
      <h1 className="text-3xl sm:text-4xl font-bold text-[#293241] text-center sm:text-left mb-8">
        Create your doctor account!
      </h1>

      <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-8">
        {errors.non_field_errors && (
          <div className="text-red-500 text-center">
            {Array.isArray(errors.non_field_errors)
              ? errors.non_field_errors.map((e, i) => <div key={i}>{e}</div>)
              : errors.non_field_errors}
          </div>
        )}

        {/* Email */}
        <div>
          <label className="block font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="doctor@example.com"
            className="mt-1 w-full px-4 py-3 rounded-lg border-2 border-gray-400/40 focus:outline-none focus:border-[#060648]"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Name row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block  font-medium text-gray-700">First name</label>
            <input type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} className="mt-1 w-full px-4 py-3 rounded-lg border-2 border-gray-400/40" />
            {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
          </div>
          <div>
            <label className="block font-medium text-gray-700">Last name</label>
            <input type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} className="mt-1 w-full px-4 py-3 rounded-lg border-2 border-gray-400/40" />
            {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
          </div>
        </div>

        {/* Birth date & sex */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-gray-700">Date of birth</label>
            <input type="date" name="born_date" value={formData.born_date} onChange={handleInputChange} className="mt-1 w-full px-4 py-3 rounded-lg border-2 border-gray-400/40" />
            {errors.born_date && <p className="text-red-500 text-sm mt-1">{errors.born_date}</p>}
          </div>

          <div>
            <p className="font-medium text-gray-700 mb-2">sex</p>
            <div className="space-y-2">
              {['M', 'F'].map(g => (
                <label key={g} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="sex"
                    value={g}
                    checked={formData.sex === g}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-[#060648] rounded"
                  />
                  <span>{g === 'M' ? 'Male' : 'Female'}</span>
                </label>
              ))}
            </div>
            {errors.sex && <p className="text-red-500 text-sm mt-1">{errors.sex}</p>}
          </div>
        </div>

        {/* Passwords */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-gray-700">Password</label>
            <input type="password" name="password" autoComplete='new-password' value={formData.password} onChange={handleInputChange} className="mt-1 w-full px-4 py-3 rounded-lg border-2 border-gray-400/40" />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          <div>
            <label className="block font-medium text-gray-700">Confirm password</label>
            <input type="password" name="confirm_password" autoComplete='new-password' value={formData.confirm_password} onChange={handleInputChange} className="mt-1 w-full px-4 py-3 rounded-lg border-2 border-gray-400/40" />
            {errors.confirm_password && <p className="text-red-500 text-sm mt-1">{errors.confirm_password}</p>}
          </div>
        </div>

        {/* Professional info */}
        <div className="space-y-6">
          <div>
            <label className="block font-medium text-gray-700">Specialty</label>
            <SearchBar
              value={formData.specialty}
              onChange={handleSearchChange('specialty')}
              endpoint="/all_specialties/"
              placeholder="Search specialty..."
            />
            {errors.specialty && <p className="text-red-500 text-sm mt-1">{errors.specialty}</p>}
          </div>

          <div>
            <label className="block font-medium text-gray-700">Clinic / Hospital</label>
            <SearchBar
              value={formData.clinic}
              onChange={handleSearchChange('clinic')}
              endpoint="/all_clinics/"
              placeholder="Search clinic..."
            />
            {errors.clinic && <p className="text-red-500 text-sm mt-1">{errors.clinic}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700">Ensurance (optional)</label>
              <SearchBar
                value={formData.ensurance}
                onChange={handleSearchChange('ensurance')}
                endpoint="/all_ensurances/"
                placeholder="Search ensurance..."
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700">Exequatur</label>
              <input
                type="text"
                name="exequatur"
                value={formData.exequatur}
                onChange={handleInputChange}
                placeholder="0000-000"
                className="mt-1 w-full px-4 py-3 rounded-lg border-2 border-gray-400/40"
              />
              {errors.exequatur && <p className="text-red-500 text-sm mt-1">{errors.exequatur}</p>}
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-700">Years of experience</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="\d*"
              maxLength={2}
              name="experience"
              value={formData.experience}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 2);
                handleInputChange({ target: { name: 'experience', value: val } } as any);
              }}
              className="mt-1 w-full max-w-xs px-4 py-3 rounded-lg border-2 border-gray-400/40"
            />
            {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-[#060648] text-white font-semibold rounded-lg hover:bg-[#050530] transition disabled:opacity-70"
        >
          {isLoading ? 'Creating Account...' : 'Create Doctor Account'}
        </button>
      </form>
    </div>
  );
}