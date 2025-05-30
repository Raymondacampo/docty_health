'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { apiClient, publicApiClient } from '@/utils/api';
import SearchBar from '../SearchBar';

const FormField = ({ title, type, name, placeholder, onChange, err, options }) => {
  return (
    <div className="self-stretch flex-col justify-start items-start gap-[5px] flex">
      <div className="self-stretch text-[#3d5a80] text-base font-normal font-['Inter'] tracking-wide">{title}</div>
      {type === 'select' ? (
        <select
          name={name}
          onChange={onChange}
          className="text-sm self-stretch px-3 py-3 focus:outline-none text-black rounded-[5px] border border-black justify-start items-center gap-2.5 inline-flex"
        >
          <option value="" disabled selected>{placeholder}</option>
          {options && options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          onChange={onChange}
          className="text-sm self-stretch px-4 py-3 focus:outline-none text-black rounded-[5px] border border-black justify-start items-center gap-2.5 inline-flex"
        />
      )}
      {err && <span className="text-red-500 text-sm">{err}</span>}
    </div>
  );
};

export default function DoctorSignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
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
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    let newErrors = { ...errors };
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

  const handleSpecialtyChange = (value) => {
    setFormData({ ...formData, specialty: value });
    let newErrors = { ...errors };
    if (value.trim() === '') {
      newErrors.specialty = 'Specialty is required';
    } else {
      delete newErrors.specialty;
    }
    setErrors(newErrors);
  };

  const handleClinicChange = (value) => {
    setFormData({ ...formData, clinic: value });
    let newErrors = { ...errors };
    if (value.trim() === '') {
      newErrors.clinic = 'Clinic is required';
    } else {
      delete newErrors.clinic;
    }
    setErrors(newErrors);
  };

  const handleEnsuranceChange = (value) => {
    setFormData({ ...formData, ensurance: value });
    let newErrors = { ...errors };
    delete newErrors.ensurance; // Ensurance is optional
    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
  
    let validationErrors = {};
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
  
    const submitData = { ...formData };
    delete submitData.specialty;
    delete submitData.clinic;
    delete submitData.ensurance;
    submitData.experience = parseInt(formData.experience, 10);
  
    try {
      const specialtyRes = await publicApiClient.get("/all_specialties/");
      const clinicRes = await publicApiClient.get("/all_clinics/");
      const ensuranceRes = await publicApiClient.get("/all_ensurances/");
      const specialty = specialtyRes.data.find(s => s.name === formData.specialty);
      const clinic = clinicRes.data.find(c => c.name === formData.clinic);
      const ensurance = ensuranceRes.data.find(e => e.name === formData.ensurance);

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

      const { data } = await publicApiClient.post('/auth/doctor_signup/', submitData);
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      router.push('/profile');

    } catch (err) {
      console.error("Error:", err.response?.data || err);
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        setErrors({ non_field_errors: ['An error occurred. Please try again.'] });
      }
      setLoading(false);
    }
  };

  const sexOptions = [
    { value: 'M', label: 'Male' },
    { value: 'F', label: 'Female' },
  ];

  return (
    <div className="w-auto border-black/25 border py-8 bg-white rounded-[15px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex-col justify-center items-center gap-8 inline-flex 
    sm:px-8 sm:max-w-2xl
    xs:w-full xs:max-w-md xs:px-4">
      <div className="self-stretch text-center text-[#293241] text-2xl font-bold tracking-wide">Create your Doctor account!</div>
      <form className="self-stretch" onSubmit={handleSubmit}>
        <div className="self-stretch flex-col justify-center items-center gap-4 flex">
          <div className="self-stretch justify-start items-start flex-col flex">
            <div className='flex w-full
            md:flex-row md:gap-16
            xs:flex-col '>
              <div className='flex flex-col gap-2
              md:w-[300px] xs:w-full'>
                <FormField title="Email" type="text" name="email" placeholder="yourmail@example.com" onChange={handleChange} err={errors.email} />
                <FormField title="First name" type="text" name="first_name" placeholder="Your first name" onChange={handleChange} err={errors.first_name} />
                <FormField title="Last name" type="text" name="last_name" placeholder="Your last name" onChange={handleChange} err={errors.last_name} />
                <FormField
                  title="Sex"
                  type="select"
                  name="sex"
                  placeholder="Select your sex"
                  onChange={handleChange}
                  err={errors.sex}
                  options={sexOptions}
                />
                <FormField title="Password" type="password" name="password" placeholder="Password" onChange={handleChange} err={errors.password} />
                <FormField title="Repeat password" type="password" name="confirm_password" placeholder="Repeat password" onChange={handleChange} err={errors.confirm_password} />                 
              </div>

              <div className='flex flex-col gap-2
              md:w-[300px] xs:w-full'>
                <div className="self-stretch flex-col justify-start items-start gap-[5px] flex">
                  <div className="self-stretch text-[#3d5a80] text-base font-normal font-['Inter'] tracking-wide">Specialty</div>
                  <SearchBar
                    value={formData.specialty}
                    onChange={handleSpecialtyChange}
                    endpoint="/all_specialties/"
                    placeholder="Search for a specialty"
                  />
                  {errors.specialty && <span className="text-red-500 text-sm">{errors.specialty}</span>}
                </div>
                <div className="self-stretch flex-col justify-start items-start gap-[5px] flex">
                  <div className="self-stretch text-[#3d5a80] text-base font-normal font-['Inter'] tracking-wide">Clinic</div>
                  <SearchBar
                    value={formData.clinic}
                    onChange={handleClinicChange}
                    endpoint="/all_clinics/"
                    placeholder="Search for a clinic"
                  />
                  {errors.clinic && <span className="text-red-500 text-sm">{errors.clinic}</span>}
                </div>
                <div className="self-stretch flex-col justify-start items-start gap-[5px] flex">
                  <div className="self-stretch text-[#3d5a80] text-base font-normal font-['Inter'] tracking-wide">Ensurance (optional)</div>
                    <SearchBar
                      value={formData.ensurance}
                      onChange={handleEnsuranceChange}
                      endpoint="/all_ensurances/"
                      placeholder="Search for an ensurance (optional)"
                    />
                    {errors.ensurance && <span className="text-red-500 text-sm">{errors.ensurance}</span>}
                  </div>
                  <FormField title="Exequatur" type="text" name="exequatur" placeholder="0000-000" onChange={handleChange} err={errors.exequatur} />
                  <FormField title="Years of experience" type="text" name="experience" placeholder="How long have you been a doctor?" onChange={handleChange} err={errors.experience} />         
         
                </div>
              </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="p-2.5 px-4 mt-6 self-stretch bg-[#ee6c4d] rounded-[10px] border border-[#ee6c4d] justify-center items-center gap-2.5 inline-flex"
                >
                  <div className="text-white text-base font-['Inter'] tracking-wide">{loading ? 'Creating account...' : 'Sign Up'}</div>
                </button>  
            </div>
        </div>
      </form>
    </div>
  );
}