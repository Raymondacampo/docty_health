'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { publicApiClient } from '../utils/api';
import { login, isAuthenticated } from '../utils/auth';
import GoogleButton from '../components/GoogleLogin';

interface Credentials {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState<Credentials>({ email: '', password: '' });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      setIsAuth(authenticated);
      if (authenticated) {
        router.push('/account');
      }
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // setLoading(true);
    setError('');
    try {
      const { data } = await publicApiClient.post('/auth/login/', credentials);
      console.log('Login successful:', data);
      localStorage.setItem('refresh_token', data.refresh);
      await login(data.access);
      setTimeout(() => router.push('/account'), 500); // slight delay for UX
    } catch (err: any) {
      console.error('Login failed:', err.response?.data || err.message);
      setError('Invalid email or password');
    } 
  };

  if (isAuth === null || loading) {
    return (
      <div className='flex flex-col w-full h-screen justify-center items-center'>
        <div className='text-[#293241] font-bold text-2xl'>Loading...</div>
      </div>
    );
  }

  return (
    <div className='flex flex-col w-full sm:mt-[14dvh] mt-[19dvh] h-[47dvh] mb-[14dvh] px-2 justify-center items-center'>
      <div className='self-stretch text-center text-[#293241] font-bold text-3xl sm:text-4xl mb-8 tracking-wide'>Login to your account!</div>
      <form onSubmit={handleSubmit} className='w-full max-w-sm flex-col justify-start items-start gap-4 flex'>
        <div className='self-stretch flex-col justify-start items-start gap-4 flex'>
          <div className='self-stretch flex-col justify-start items-start gap-[5px] flex'>
            <input
              type='text'
              name='email'
              placeholder='Email'
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              className='text-black self-stretch px-4 py-3 focus:outline-none rounded-3xl border border-black justify-start items-center gap-2.5 inline-flex'
            />
          </div>
          <div className='self-stretch flex-col justify-start items-start flex'>
            <input
              type='password'
              name='password'
              placeholder='Password'
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              autoComplete='off'
              className='text-black self-stretch focus:outline-none px-4 py-3 rounded-3xl border border-black justify-start items-center gap-2.5 inline-flex'
            />
            <div className='flex justify-between w-full pt-2'>
              {error && <p className='text-red-500 text-sm mb-4'>{error}</p>}
              <p className='font-bold text-nowrap text-end text-black/70 text-sm relative right-0'>Forgot your password?</p>              
            </div>

          </div>
          
        </div>
        <div className='self-stretch flex-col justify-center items-center gap-4 flex'>
          <div className='self-stretch flex-col justify-center items-center gap-2.5 flex'>
            <button
              type='submit'
              disabled={loading}
              className='self-stretch py-3 cursor-pointer bg-[#060648] rounded-3xl justify-center items-center gap-2.5 inline-flex'
            >
              <div className='text-white  font-bold tracking-wide'>{loading ? 'Logging in...' : 'Login'}</div>
            </button>
          </div>
        </div>
      </form>
      <div className='w-full max-w-sm flex-col my-2 justify-center items-center gap-2.5 flex'>
        <GoogleButton setError={setError} />
      </div>
      <div className='flex flex-col justify-center items-center'>
        <div>
          <span className='text-[#293241] text-xs font-semibold tracking-wide'>Not a member?</span>
          <span className='text-[#4285f4] text-sm font-semibold tracking-wide'> </span>
          <a href='/doctor_signup' className='text-blue-500 text-sm font-semibold tracking-wide'>Create account</a>
        </div>
        <div>
          <span className='text-[#293241] text-xs font-semibold tracking-wide'>Are you a doctor?</span>
          <span className='text-[#4285f4] text-sm font-semibold tracking-wide'> </span>
          <a href='/doctor-signup' className='text-blue-500 text-sm font-semibold tracking-wide'>Sign up as a doctor</a>
        </div>
      </div>
    </div>
  );
}