import { useState } from "react";
import GoogleButton from "../GoogleButton"
import { useAuth } from "@/context/auth";
import axios from 'axios';

const FormField = ({title, type, name, placeholder, onChange, err}) => {
    return(
        <div class="self-stretch flex-col justify-start items-start gap-[5px] flex">
            <div class="self-stretch text-[#3d5a80] text-base font-normal font-['Inter'] tracking-wide">{title}</div>
            <input type={type} name={name} placeholder={placeholder} onChange={onChange} class="text-sm self-stretch px-4 py-3 focus:outline-none text-black rounded-[5px] border border-black justify-start items-center gap-2.5 inline-flex">
            </input>
            {err && <span className="text-red-500 text-sm">{err}</span>}
        </div>
    )
}

const Form = ({onChange, errors, loading}) => {
    return (
        <div class="self-stretch flex-col justify-center items-center gap-4 flex">
            <div class="self-stretch  flex-col justify-start items-start gap-4 flex">
                <FormField title='Email' type='text' name='email' placeholder='yourmail@example.com' onChange={onChange} err={errors.email}/>
                <FormField title='First name' type='text' name='first_name' placeholder='your name' onChange={onChange} err={errors.first_name }/>
                <FormField title='Last name' type='text' name='last_name' placeholder='your last name' onChange={onChange} err={errors.lasst_name }/>
                <FormField title='Password' type='password' name='password' placeholder='Your password' onChange={onChange} err={errors.password}/>
                <FormField title='Repeat password' type='password' name='confirm_password' placeholder='Repeat password' onChange={onChange} err={errors.password2}/>
            </div>
            <div class="w-full flex-col justify-start items-center gap-4 flex">
                <div class="w-full flex-col justify-end items-center gap-2.5 flex">
                    <button type="submit" disabled={loading} class=" p-2.5 px-4 self-stretch bg-[#ee6c4d] rounded-[10px] border border-[#ee6c4d] justify-center items-center gap-2.5 inline-flex">
                        <div class="text-white text-base font-['Inter'] tracking-wide">{loading ? 'Creating account...' : 'Sign Up'}</div>
                    </button>
                </div>
                <div><span class="text-[#293241] text-xs font-light font-['Inter'] tracking-wide">Are you a doctor?</span><span class="text-[#4285f4] text-sm font-light font-['Inter'] tracking-wide"> </span><a href="" class="text-[#ee6c4d] text-xs font-light font-['Inter'] tracking-wide">Sign up as a doctor</a></div>
            </div>
        </div>
    )
}

export default function SignupForm (){ 
    const { login } = useAuth();
    const [formData, setFormData] = useState({
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      password2: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setErrors({});
  
      try {
        const { data } = await axios.post(
          'https://juanpabloduarte.com/api/signup/',
          formData
        );
  
        // Store tokens and user data
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        
        // Update auth context
        login(data.access, data.refresh, data.user);
        
        // Redirect to profile
        window.location.href = '/profile';
      } catch (err) {
        if (err.response?.data) {
          setErrors(err.response.data);
        } else {
          setErrors({ non_field_errors: ['An error occurred. Please try again.'] });
        }
        setLoading(false);
      }
    };
  
    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });

            // Validate the field and update the errors state
        if (value.trim() === '') {
            setErrors({
            ...errors,
            [e.target.name]: `${e.target.name.replace('_', ' ')} should not be empty`, // Customize the error message
            });
        } else {
            // If the field is not empty, remove the error for that field
            const newErrors = { ...errors };
            delete newErrors[e.target.name];
            setErrors(newErrors);
        }
    };

    return(
        <div class="border-black/25 border py-8 bg-white rounded-[15px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex-col justify-center items-center gap-6 inline-flex
        sm:px-8
        xs:w-full xs:max-w-md xs:px-4">
           <div class="self-stretch text-center text-[#293241] text-xl font-['Inter'] tracking-wide">Create your account!</div>
           <GoogleButton/>
           <div class="text-[#293241] text-xl">or</div>
           <form className="self-stretch" onSubmit={handleSubmit}>
                {errors.non_field_errors && (
                    <div className="mb-4 text-red-500">{errors.non_field_errors}</div>
                )}
                <div class="self-stretch flex-col justify-center items-center gap-4 flex">
                    <div class="self-stretch  flex-col justify-start items-start gap-4 flex">
                    <div class="self-stretch flex-col justify-start items-start gap-[5px] flex">
                        <div class="self-stretch text-[#3d5a80] text-base font-normal font-['Inter'] tracking-wide">Email</div>
                        <input type='text' name='email'  placeholder='your name' onChange={handleChange} class="text-black self-stretch  px-4 py-3 focus:outline-none rounded-[5px] border border-black justify-start items-center gap-2.5 inline-flex">
                        </input>
                        {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                    </div>
                    <div class="self-stretch flex-col justify-start items-start gap-[5px] flex">
                        <div class="self-stretch text-[#3d5a80] text-base font-normal font-['Inter'] tracking-wide">First name</div>
                        <input type='text' name='first_name'     placeholder='Your first name' onChange={handleChange} class="text-black self-stretch  px-4 py-3 focus:outline-none rounded-[5px] border border-black justify-start items-center gap-2.5 inline-flex">
                        </input>
                        {errors.first_name && <span className="text-red-500 text-sm">{errors.first_name}</span>}
                    </div>
                    <div class="self-stretch flex-col justify-start items-start gap-[5px] flex">
                        <div class="self-stretch text-[#3d5a80] text-base font-normal font-['Inter'] tracking-wide">Last name</div>
                        <input type='text' name='last_name'  placeholder='your last name' onChange={handleChange} class="text-black self-stretch  px-4 py-3 focus:outline-none rounded-[5px] border border-black justify-start items-center gap-2.5 inline-flex">
                        </input>
                        {errors.last_name && <span className="text-red-500 text-sm">{errors.last_name}</span>}
                    </div>
                    <div class="self-stretch flex-col justify-start items-start gap-[5px] flex">
                        <div class="self-stretch text-[#3d5a80] text-base font-normal font-['Inter'] tracking-wide">Password</div>
                        <input type='password' name='password'   placeholder='Password' onChange={handleChange} class="text-black self-stretch  px-4 py-3 focus:outline-none rounded-[5px] border border-black justify-start items-center gap-2.5 inline-flex">
                        </input>
                        {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
                    </div>
                    <div class="self-stretch flex-col justify-start items-start gap-[5px] flex">
                        <div class="self-stretch text-[#3d5a80] text-base font-normal font-['Inter'] tracking-wide">Repeat assword</div>
                        <input type='password' name='password2'  placeholder='Repeat password' onChange={handleChange} class="text-black self-stretch  px-4 py-3 focus:outline-none rounded-[5px] border border-black justify-start items-center gap-2.5 inline-flex">
                        </input>
                        {errors.password2 && <span className="text-red-500 text-sm">{errors.password2}</span>}
                    </div>
                    </div>
                    <div class="w-full flex-col justify-start items-center gap-4 flex">
                        <div class="w-full flex-col justify-end items-center gap-2.5 flex">
                            <button type="submit" disabled={loading} class=" p-2.5 px-4 self-stretch bg-[#ee6c4d] rounded-[10px] border border-[#ee6c4d] justify-center items-center gap-2.5 inline-flex">
                                <div class="text-white text-base font-['Inter'] tracking-wide">{loading ? 'Creating account...' : 'Sign Up'}</div>
                            </button>
                        </div>
                        <div><span class="text-[#293241] text-xs font-light font-['Inter'] tracking-wide">Are you a doctor?</span><span class="text-[#4285f4] text-sm font-light font-['Inter'] tracking-wide"> </span><a href="" class="text-[#ee6c4d] text-xs font-light font-['Inter'] tracking-wide">Sign up as a doctor</a></div>
                    </div>
                </div>   
           </form>

        </div>
    )
}