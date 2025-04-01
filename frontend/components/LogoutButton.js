'use client';

import { useAuth } from '@/context/auth'; // Adjusted path to match your structure

const LogoutButton = () => {
  const { logout } = useAuth();

  return (
    <button
      onClick={logout}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
    >
      Log Ousst
    </button>
  );
};

export default LogoutButton;