// pages/auth/google/callback.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/auth';
import axios from 'axios';

export default function GoogleCallback() {
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const { code } = router.query;
      if (code) {
        try {
          const { data } = await axios.post('https://juanpabloduarte.com/api/auth/google/', { code });
          console.log('Response from backend:', data);
          if (!data.access) {
            console.error('No access token received');
            router.push('/login');
            return;
          }
          localStorage.setItem('access_token', data.access);
          localStorage.setItem('refresh_token', data.refresh);
          await login(data.access);
        } catch (error) {
          console.error('Google callback failed:', error.response?.data || error.message);
          router.push('/login');
        }
      }
    };
    handleCallback();
  }, [router.query, login, router]);

  return <div>Authenticating...</div>;
}