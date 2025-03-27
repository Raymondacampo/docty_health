// pages/change_password.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function ChangePassword() {
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(null); // Track token validity
  const router = useRouter();
  const { token } = router.query;

  console.log('Token:', token);

  // Validate token on page load
  useEffect(() => {
    if (router.isReady && token) {
      const validateToken = async () => {
        try {
          const accessToken = localStorage.getItem("access_token");
          await axios.post(
            'http://localhost:8000/api/auth/validate_token/', // New endpoint
            { token },
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
          setIsTokenValid(true); // Token is valid
        } catch (err) {
          setIsTokenValid(false); // Token is invalid or expired
          setError(err.response?.data?.error || 'Invalid or expired token');
        }
      };
      validateToken();
    } else if (router.isReady && !token) {
      router.push('/'); // No token, redirect
    }
  }, [router.isReady, token, router]);

  // Redirect if token is invalid
  useEffect(() => {
    if (router.isReady && isTokenValid === false) {
      router.push('/');
    }
  }, [isTokenValid, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== password2) {
      setError('Passwords do not match');
      return;
    }

    try {
      const accessToken = localStorage.getItem("access_token");
      await axios.post(
        'http://localhost:8000/api/auth/password_change/',
        { 
          token,
          new_password: password 
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setSuccess(true);
      setError('');
      setTimeout(() => router.push('/settings'), 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to change password. Please try again.';
      setError(errorMessage);
      console.error(err);
    }
  };

  // Loading state while validating token
  if (!router.isReady || isTokenValid === null) {
    return <div>Loading...</div>;
  }

  // Only show form if token is valid
  if (!isTokenValid) {
    return <div>Redirecting...</div>; // This won’t show long due to redirect
  }

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mt-16">
        <h1 className="text-2xl text-[#3d5a80] font-bold mb-6 text-center">Change Password</h1>
        
        {success ? (
          <div className="text-blue-900 text-center">
            Password changed successfully! Redirecting to settings...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4285f4] focus:border-[#4285f4]"
                required
                minLength={8}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4285f4] focus:border-[#4285f4]"
                required
                minLength={8}
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#ee6c4d] text-white rounded-md hover:bg-[#c65b40] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4285f4]"
            >
              Change Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}