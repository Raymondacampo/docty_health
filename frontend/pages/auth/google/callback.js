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
      const { code } = router.query; // Extract authorization code from URL
      if (code) {
        try {
          // Send the code to your backend to exchange for tokens
          const { data } = await axios.post('https://juanpabloduarte.com/api/auth/google/', {
            code, // Send the authorization code instead of token
          });

          // Store tokens and user data
          localStorage.setItem('access_token', data.access);
          localStorage.setItem('refresh_token', data.refresh);

          // Update auth context
          login(data.access); // Pass access token (adjust if needed)

          // Redirect to profile
          router.push('/profile');
        } catch (error) {
          console.error('Google callback failed:', error.response?.data || error.message);
          router.push('/login'); // Redirect to login on failure
        }
      }
    };

    handleCallback();
  }, [router.query, login, router]);

  return <div>Authenticating...</div>; // Loading state while processing
}