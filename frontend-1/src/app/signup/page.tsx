'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '../utils/api';
import { login } from '../utils/auth';

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
  date_of_birth: string;
  gender: string;
}

interface Errors {
  [key: string]: string | string[] | undefined;
  non_field_errors?: string[];
  email?: string;
  first_name?: string;
  last_name?: string;
  password?: string;
  confirm_password?: string;
  date_of_birth?: string;
  gender?: string;
}

interface FormFieldProps {
  text: string;
  type: string;
  name: string;
  placeholder?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  err?: string;
  extra?: string;
  checked?: boolean;
  value?: string;
}

const FormField = ({ text, type, name, placeholder, onChange, err, extra, checked, value }: FormFieldProps) => {
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
        <label htmlFor={name} className="text-sm font-medium text-gray-700">{text}</label>
        {err && <span className="text-red-500 text-sm ml-2">{err}</span>}
      </div>
    );
  }
  return (
    <div className={`self-stretch flex-col justify-start items-start gap-[5px] flex ${extra}`}>
      <label htmlFor={name} className="text-sm font-medium text-gray-700">{text}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        autoComplete={type === 'password' ? 'new-password' : undefined}
        onChange={onChange}
        className={`self-stretch px-4 py-3 focus:outline-none text-black rounded-lg border-2 border-gray-500/40 justify-start items-center gap-2.5 inline-flex `}
      />
      {err && <span className="text-red-500 text-sm">{err}</span>}
    </div>
  );
};

export default function SignupForm() {
//   const { user, loading } = useUser();
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
    date_of_birth: '',
    gender: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setLoading] = useState<boolean>(false);

//   useEffect(() => {
//     if (user) {
//       router.push('/account');
//     }
//   }, [user, router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    let newValue = type === 'checkbox' ? (checked ? value : '') : value;
    
    // For gender field, ensure only one checkbox is selected
    if (type === 'checkbox' && name === 'gender') {
      // Uncheck the other checkbox by clearing gender if needed
      if (checked) {
        setFormData({ ...formData, gender: value });
      } else if (formData.gender === value) {
        setFormData({ ...formData, gender: '' });
      } else {
        setFormData({ ...formData, gender: formData.gender });
      }
    } else {
      setFormData({ ...formData, [name]: newValue });
    }

    let newErrors: Errors = { ...errors };
    if (newValue.trim() === '' && name !== 'gender') {
      newErrors[name] = `${name.replace('_', ' ').replace('confirm password', 'Repeat password')} is required`;
    } else {
      delete newErrors[name];
    }

    if (name === 'email' && newValue.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newValue)) {
        newErrors.email = 'Please enter a valid email address';
      } else {
        delete newErrors.email;
      }
    }

    if (name === 'password' && newValue.trim() !== '') {
      if (newValue.length < 8) {
        newErrors.password = 'Password must be at least 8 characters long';
      } else {
        delete newErrors.password;
      }
    }

    if (name === 'confirm_password' && newValue.trim() !== '') {
      if (newValue !== formData.password) {
        newErrors.confirm_password = 'Passwords do not match';
      } else {
        delete newErrors.confirm_password;
      }
    }

    if (name === 'gender') {
      if (newValue.trim() !== '' && !['M', 'F'].includes(newValue)) {
        newErrors.gender = 'Please select a valid option';
      } else {
        delete newErrors.gender;
      }
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    let validationErrors: Errors = {};
    Object.keys(formData).forEach((key) => {
      if ((formData[key as keyof FormData] as string).trim() === '' && key !== 'confirm_password' && key !== 'gender') {
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

    if (!formData.gender || !['M', 'F'].includes(formData.gender)) {
      validationErrors.gender = 'Please select your gender';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      const { data } = await apiClient.post('/auth/signup/', formData);
      await login(data.access);
      localStorage.setItem('refresh_token', data.refresh);
      setTimeout(() => router.push('/account'), 500); // slight delay for UX
    } catch (err: any) {
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        setErrors({ non_field_errors: ['An error occurred. Please try again.'] });
      }
      setLoading(false);
    }
  };

//   if (loading || isLoading) {
//     return <LoadingComponent isLoading={true} />;
//   }

  return (
    <div className="flex flex-col w-full mt-[14dvh] px-2 h-auto mb-[14dvh] justify-center items-center">
      <div className="self-stretch text-start w-full max-w-xl mx-auto text-[#293241] font-bold text-3xl sm:text-4xl mb-4 sm:mb-6 tracking-wide">Create your account!</div>
      <form className="w-full max-w-xl flex-col justify-start items-start gap-16 flex" onSubmit={handleSubmit}>
        {errors.non_field_errors && (
          <div className="mb-4 text-red-500">
            {Array.isArray(errors.non_field_errors)
              ? errors.non_field_errors.map((error, index) => <div key={index}>{error}</div>)
              : errors.non_field_errors}
          </div>
        )}
        <div className="self-stretch flex-col justify-center items-center gap-8 flex">
          <div className="self-stretch flex-col justify-start items-start gap-6 flex">
            <FormField
              text="Email"
              type="text"
              name="email"
              placeholder="yourmail@example.com"
              onChange={handleChange}
              err={errors.email}
            />
            <div className='grid grid-cols-10 gap-2 w-full'>
              <FormField
                text="First Name"
                type="text"
                name="first_name"
                placeholder="Your first name"
                onChange={handleChange}
                err={errors.first_name}
                extra='col-span-4'
              />
              <FormField
                text="Last Name"
                type="text"
                name="last_name"
                placeholder="Your last name"
                onChange={handleChange}
                err={errors.last_name}
                extra='col-span-6'
              />              
            </div>
            <FormField
              text="Date of birth"
              type="date"
              name="date_of_birth"
              placeholder="Date of Birth"
              onChange={handleChange}
              err={errors.date_of_birth}
            />
            <div className="self-stretch flex-col justify-start items-start">
              <p className="text-sm font-medium text-gray-700 mb-2">Sex</p>
              <div className="flex flex-col gap-4">
                <FormField
                  text="Male"
                  type="checkbox"
                  name="gender"
                  onChange={handleChange}
                  checked={formData.gender === 'M'}
                  value="M"
                />
                <FormField
                  text="Female"
                  type="checkbox"
                  name="gender"
                  onChange={handleChange}
                  checked={formData.gender === 'F'}
                  value="F"
                />
              </div>
              {errors.gender && <span className="text-red-500 text-sm">{errors.gender}</span>}
            </div>
            <FormField
              text="Password"
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              err={errors.password}
            />
            <FormField
              text="Repeat Password"
              type="password"
              name="confirm_password"
              placeholder="Repeat password"
              onChange={handleChange}
              err={errors.confirm_password}
            />
          </div>
          <div className="w-full flex-col justify-start items-center gap-4 flex">
            <div className="w-full flex-col justify-end items-center gap-2.5 flex">
              <button
                type="submit"
                disabled={isLoading}
                className="py-3 px-4 self-stretch bg-[#060648] rounded-lg justify-center items-center gap-2.5 inline-flex"
              >
                <div className="text-white text-base tracking-wide">
                  {isLoading ? 'Creating account...' : 'Sign Up'}
                </div>
              </button>
            </div>
            <div>
              <span className="text-[#293241] text-xs font-semibold tracking-wide">Are you a doctor?</span>
              <span className="text-[#4285f4] text-sm font-semibold tracking-wide"> </span>
              <a href="/doctor-signup" className="text-blue-500 text-sm font-semibold tracking-wide">Sign up as a doctor</a>
            </div>  
          </div>
        </div>
      </form>
    </div>
  );
}