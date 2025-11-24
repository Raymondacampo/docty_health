'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { login } from '../../utils/auth';
import { useLoading } from '../../utils/LoadingContext';
import Loading from '../../components/LoadingComponent';

export default function GoogleCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setIsLoading } = useLoading();
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handleCallback = async () => {
      setIsLoading(true);
      const code = searchParams.get('code');
      const redirectUrl = searchParams.get('state');

      if (!code) {
        setError('No authorization code received.');
        setIsLoading(false);
        return;
      }

      try {
        await login(code, true, true, redirectUrl); // isGoogle=true, isGoogleCallback=true
        if (redirectUrl) {
            router.replace(redirectUrl);
        } else {
            // Default path if no redirect URL was provided
            router.replace('/dashboard'); 
        }
      } catch (err: any) {
        console.error('Google callback error:', err.response?.data || err.message);
        setError('Failed to authenticate with Google. Please try again.');
        setIsLoading(false);
      }
    };

    handleCallback();
  }, [searchParams, setIsLoading, router]);

  if (error) {
    return (
      <div className='flex flex-col w-full h-screen justify-center items-center'>
        <div className='text-red-500 font-bold text-2xl'>{error}</div>
        <a href='/login' className='text-blue-500 mt-4'>Back to Login</a>
      </div>
    );
  }

  return (
    <Loading />
  ); // Handled by global Loading component
}