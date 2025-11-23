'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/app/utils/api';
import { useLoading } from '@/app/utils/LoadingContext';
import { useAlert } from '@/app/context/AlertContext';

export default function ChangePassword() {
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { setIsLoading } = useLoading();
  const { showAlert } = useAlert();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    if (password !== password2) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      await apiClient.post('/auth/password_change/', { new_password: password });
      setSuccess(true);
      showAlert('Password changed successfully', 'success');
      setTimeout(() => router.push('/settings/security'), 1000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to change password');
      showAlert(err.response?.data?.error || 'Failed to change password', 'error');
      console.error('Password change error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center pt-16">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-[#3d5a80] mb-6 text-center">Change Password</h1>
        {success ? (
          <p className="text-blue-900 text-center">
            Password changed successfully! Redirecting...
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4285f4] focus:border-[#4285f4] text-black"
                required
                minLength={8}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4285f4] focus:border-[#4285f4] text-black"
                required
                minLength={8}
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#060648] text-white rounded-md hover:bg-[#0541a6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#060648]"
            >
              Change Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}