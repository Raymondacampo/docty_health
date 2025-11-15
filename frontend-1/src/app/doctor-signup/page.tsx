'use client';

import { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { publicApiClient } from '@/app/utils/api';
import SearchBar from './components/SearchBar';
import Loading from '../components/LoadingComponent';
import {login} from '@/app/utils/auth';

interface FormFieldProps {
  title: string;
  type: string;
  name: string;
  placeholder?: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  err?: string;
  options?: { value: string; label: string }[];
  extra?: string;
  checked?: boolean;
  value?: string;
}

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  exequatur: string;
  experience: string;
  password: string;
  confirm_password: string;
  sex: string;
  specialty: string;
  clinic: string;
  ensurance: string;
  born_date: string;
  [key: string]: string; // Add index signature
}

interface Errors {
  [key: string]: string | undefined;
}

const FormField = ({ title, type, name, placeholder, onChange, err, extra, checked, value }: FormFieldProps) => {
  if (type === 'checkbox') {
    return (
      <div className={`self-stretch flex items-center gap-[10px] ${extra}`}>
        <input
          type="checkbox"
          name={name}
          value={value}
          onChange={onChange}
          checked={checked}
          className="h-5 w-5 text-[#060648] rounded border-gray-500/40 focus:ring-[#060648]"
        />
        <label htmlFor={name} className="text-[#3d5a80] font-medium text-sm">{title}</label>
        {err && <span className="text-red-500 text-sm ml-2">{err}</span>}
      </div>
    );
  }
  return (
    <div className={`w-full flex-col justify-start items-start gap-[5px] flex ${extra}`}>
      <label htmlFor={name} className="text-[#3d5a80] text-sm">{title}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        autoComplete={type === 'password' ? 'new-password' : undefined}
        className={`w-full px-4 py-3 focus:outline-none text-black rounded-lg border-2 border-gray-500/40 justify-start items-center gap-2.5 inline-flex `}
      />
      {err && <span className="text-red-500 text-sm">{err}</span>}
    </div>
  );
};

export default function DoctorSignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    last_name: '',
    email: '',
    exequatur: '',
    experience: '',
    password: '',
    confirm_password: '',
    sex: '',
    specialty: '',
    clinic: '',
    ensurance: '',
    born_date: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    let newErrors: Errors = { ...errors };
    if (value.trim() === '') {
      newErrors[name] = `${name.replace('_', ' ').replace('confirm password', 'Repeat password')} is required`;
    } else {
      delete newErrors[name];
    }

    if (name === 'email' && value.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (name === 'password' && value.trim() !== '') {
      if (value.length < 8) {
        newErrors.password = 'Password must be at least 8 characters long';
      }
    }

    if (name === 'confirm_password' && value.trim() !== '') {
      if (value !== formData.password) {
        newErrors.confirm_password = 'Passwords do not match';
      }
    }

    if (name === 'experience' && value.trim() !== '') {
      if (!/^\d+$/.test(value) || parseInt(value) < 0) {
        newErrors.experience = 'Years of experience must be a positive number';
      }
    }

    if (name === 'sex' && value.trim() !== '' && !['M', 'F'].includes(value)) {
      newErrors.sex = 'Please select either Male or Female';
    }

    setErrors(newErrors);
  };

  const handleSpecialtyChange = (value: string) => {
    setFormData({ ...formData, specialty: value });
    let newErrors: Errors = { ...errors };
    if (value.trim() === '') {
      newErrors.specialty = 'Specialty is required';
    } else {
      delete newErrors.specialty;
    }
    setErrors(newErrors);
  };

  const handleClinicChange = (value: string) => {
    setFormData({ ...formData, clinic: value });
    let newErrors: Errors = { ...errors };
    if (value.trim() === '') {
      newErrors.clinic = 'Clinic is required';
    } else {
      delete newErrors.clinic;
    }
    setErrors(newErrors);
  };

  const handleEnsuranceChange = (value: string) => {
    setFormData({ ...formData, ensurance: value });
    let newErrors: Errors = { ...errors };
    delete newErrors.ensurance; // Ensurance is optional
    setErrors(newErrors);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setIsCreating(true);
    setErrors({});

    let validationErrors: Errors = {};
    Object.keys(formData).forEach((key) => {
      if (formData[key].trim() === '' && key !== 'ensurance') {
        validationErrors[key] = `${key.replace('_', ' ').replace('confirm password', 'Repeat password')} is required`;
      }
    });

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      validationErrors.email = 'Please enter a valid email address';
    }

    if (formData.password && formData.password.length < 8) {
      validationErrors.password = 'Password must be at least 8 characters long';
    }

    if (formData.confirm_password && formData.confirm_password !== formData.password) {
      validationErrors.confirm_password = 'Passwords do not match';
    }

    if (formData.experience && (!/^\d+$/.test(formData.experience) || parseInt(formData.experience) < 0)) {
      validationErrors.experience = 'Years of experience must be a positive number';
    }

    if (formData.sex && !['M', 'F'].includes(formData.sex)) {
      validationErrors.sex = 'Please select either Male or Female';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    const submitData: any = { ...formData };
    delete submitData.specialty;
    delete submitData.clinic;
    delete submitData.ensurance;
    submitData.experience = parseInt(formData.experience, 10);

    try {
      const specialtyRes = await publicApiClient.get("/all_specialties/");
      const clinicRes = await publicApiClient.get("/all_clinics/");
      const ensuranceRes = await publicApiClient.get("/all_ensurances/");
      const specialty = specialtyRes.data.find((s: any) => s.name === formData.specialty);
      const clinic = clinicRes.data.find((c: any) => c.name === formData.clinic);
      const ensurance = ensuranceRes.data.find((e: any) => e.name === formData.ensurance);

      if (!specialty) {
        validationErrors.specialty = 'Selected specialty not found';
      } else {
        submitData.specialties = [specialty.id];
      }

      if (!clinic) {
        validationErrors.clinic = 'Selected clinic not found';
      } else {
        submitData.clinics = [clinic.id];
      }

      if (formData.ensurance && !ensurance) {
        validationErrors.ensurance = 'Selected ensurance not found';
      } else {
        submitData.ensurances = ensurance ? [ensurance.id] : [];
      }

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setLoading(false);
        return;
      }
      submitData.specialties = [specialty.id];
      submitData.clinics = [clinic.id];
      submitData.ensurances = ensurance ? [ensurance.id] : [];
      console.log("Submitting data:", submitData);
      const { data } = await publicApiClient.post('/auth/doctor_signup/', submitData);
      console.log("Signup successful", data);
      await login(data.access);
      localStorage.setItem('refresh_token', data.refresh);   
      setLoading(false);
      setTimeout(() => router.push('/account'), 500); // slight delay for UX
    //   

    } catch (err: any) {
      console.error("Error:", err.response?.data || err);
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        setErrors({ non_field_errors: 'An error occurred. Please try again.' });
      }
    }
  };

  const sexOptions = [
    { value: 'M', label: 'Male' },
    { value: 'F', label: 'Female' },
  ];

  if (loading || isCreating) {
    return <Loading text={isCreating ? "Creating account..." : "Loading..."} />;
  }

  return (
    <div className="flex flex-col w-full mt-[12dvh] px-2 h-auto mb-[14dvh] justify-center items-center">
      <div className="self-stretch text-start w-full max-w-xl mx-auto text-[#293241] font-bold text-3xl sm:text-4xl mb-4 sm:mb-6 tracking-wide">
        Create your doctor account!
      </div>
      <form className="w-full max-w-xl flex-col justify-start items-start gap-16 flex" onSubmit={handleSubmit}>

        <div className="self-stretch flex-col justify-center items-center gap-8 flex">
          <div className="self-stretch flex-col justify-start items-start gap-6 flex">
                <FormField title="Email" type="text" name="email" placeholder="yourmail@example.com" onChange={handleChange} err={errors.email} />
                
                <div className='grid grid-cols-10 gap-2 w-full'>
                  <FormField title="First name" type="text" name="first_name" placeholder="Your first name" onChange={handleChange} err={errors.first_name} extra='col-span-4' />
                  <FormField title="Last name" type="text" name="last_name" placeholder="Your last name" onChange={handleChange} err={errors.last_name} extra='col-span-6' />
                </div>
                  <FormField
                    title="Date of birth"
                    type="date"
                    name="born_date"
                    placeholder="Date of Birth"
                    onChange={handleChange}
                    err={errors.born_date}
                  />
                <div className="self-stretch flex-col justify-start items-start">
                  <p className="text-sm font-medium text-[#3d5a80] mb-2">Sex</p>
                    <div className="flex flex-col gap-4">
                      <FormField
                        title="Male"
                        type="checkbox"
                        name="sex"
                        onChange={handleChange}
                        checked={formData.sex === 'M'}
                        value="M"
                      />
                      <FormField
                        title="Female"
                        type="checkbox"
                        name="sex"
                        onChange={handleChange}
                        checked={formData.sex === 'F'}
                        value="F"
                      />
                    </div>
                    {errors.sex && <span className="text-red-500 text-sm">{errors.sex}</span>}
                  </div>
                <FormField title="Password" type="password" name="password" placeholder="Password" onChange={handleChange} err={errors.password} />
                <FormField title="Repeat password" type="password" name="confirm_password" placeholder="Repeat password" onChange={handleChange} err={errors.confirm_password} />

                <div className='flex w-full justify-between gap-2'>
                  <div className="w-full flex-col justify-start items-start gap-[5px] flex">
                    <div className="text-sm text-[#3d5a80] tracking-wide">Specialty</div>
                    <SearchBar
                      value={formData.specialty}
                      onChange={handleSpecialtyChange}
                      endpoint="/all_specialties/"
                      placeholder="Search for a specialty"
                    />
                    {errors.specialty && <span className="text-red-500 text-sm">{errors.specialty}</span>}
                  </div>                
                  <div className="w-full flex-col justify-start items-start gap-[5px] flex">
                    <div className="text-sm text-[#3d5a80] tracking-wide">Clinic</div>
                    <SearchBar
                      value={formData.clinic}
                      onChange={handleClinicChange}
                      endpoint="/all_clinics/"
                      placeholder="Search for a clinic"
                    />
                    {errors.clinic && <span className="text-red-500 text-sm">{errors.clinic}</span>}
                  </div>
                </div>
                <div className='flex w-full justify-between gap-2'>
                  <div className="w-full flex-col justify-start items-start gap-[5px] flex">
                    <div className="text-sm text-[#3d5a80] tracking-wide">Ensurance (optional)</div>
                    <SearchBar
                      value={formData.ensurance}
                      onChange={handleEnsuranceChange}
                      endpoint="/all_ensurances/"
                      placeholder="Search for an ensurance (optional)"
                    />
                    {errors.ensurance && <span className="text-red-500 text-sm">{errors.ensurance}</span>}
                  </div>  
                  <div className='w-full flex'>
                    <FormField title="Exequatur" type="text" name="exequatur" placeholder="0000-000" onChange={handleChange} err={errors.exequatur} />
                  </div>
                </div>
                <div className="w-full flex items-center gap-[5px]">
                  <label
                    htmlFor="experience"
                    className="text-[#3d5a80] text-sm"
                  >
                    Years of experience
                  </label>

                    <input
                      type="text"
                      name="experience"
                      inputMode="numeric"
                      pattern="\d*"
                      maxLength={2}
                      autoComplete="off"
                      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        // allow control/meta keys and navigation
                        if (e.ctrlKey || e.metaKey) return;
                        const allowedKeys = [
                          'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'
                        ];
                        if (allowedKeys.includes(e.key)) return;

                        // if it's a single printable character and not a digit, block it
                        if (e.key.length === 1 && !/^[0-9]$/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onPaste={(e: React.ClipboardEvent<HTMLInputElement>) => {
                        e.preventDefault(); // we'll handle paste manually
                        const paste = e.clipboardData.getData('text') || '';
                        const digits = paste.replace(/\D/g, '');
                        if (!digits) return; // nothing numeric to paste

                        const input = e.currentTarget;
                        const current = input.value || '';
                        // compute how many chars we can accept (respect maxLength)
                        const max = 2;
                        const available = Math.max(0, max - current.length);

                        const toInsert = digits.slice(0, available);
                        // create new value
                        const newValue = (current + toInsert).slice(0, max);

                        // call your handleChange safely (no event pooling issues)
                        handleChange({
                          target: { name: 'experience', value: newValue }
                        } as unknown as ChangeEvent<HTMLInputElement | HTMLSelectElement>);
                      }}
                      onChange={(e) => {
                        // defensive: in case some non-digit slipped in (edge cases), normalize before calling
                        const onlyNums = e.target.value.replace(/\D/g, '').slice(0, 2);
                        handleChange({
                          target: { name: 'experience', value: onlyNums }
                        } as unknown as ChangeEvent<HTMLInputElement | HTMLSelectElement>);
                      }}
                      className="w-16 px-4 py-3 focus:outline-none text-black rounded-lg border-2 border-gray-500/40"
                    />


                  {errors.experience && (
                    <span className="text-red-500 text-sm">{errors.experience}</span>
                  )}
                </div>

                {/* <FormField 
                title="Years of experience"
                type="text" name="experience" 
                placeholder="How long have you been a doctor?" 
                onChange={handleChange} 
                err={errors.experience}
                extra='max-w-xs' /> */}
              </div>
            <button
              type="submit"
              disabled={loading}
              className="p-2.5 px-4 mt-6 self-stretch bg-[#060648] rounded-[10px] justify-center items-center gap-2.5 inline-flex cursor-pointer"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </div>

      </form>
    </div>
  );
}