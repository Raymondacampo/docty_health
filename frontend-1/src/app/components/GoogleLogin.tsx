'use client';
import { useRouter } from 'next/navigation';
import { useLoading } from '../utils/LoadingContext';

export default function GoogleButton({ setError, redirect }: { setError: (error: string) => void; redirect?: string }) {
  const router = useRouter();
  const { setIsLoading } = useLoading();

  const initiateGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
      const redirectUri = `${window.location.origin}/auth/callback`;
      const scope = 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile';

      const state = redirect ? `&state=${encodeURIComponent(redirect)}` : '';

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent${state}`;

      window.location.href = authUrl;
    } catch (error) {
      console.error('Error initiating Google login:', error);
      setError('Failed to initiate Google login. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={initiateGoogleLogin}
      className="flex items-center justify-center rounded-3xl w-full py-2.5 px-5 cursor-pointer bg-white border-1 hover:bg-gray-100 shadow-md transition-all duration-200"
    >
      <svg
        className="w-5 h-5 mr-2"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#2f6ad9"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1.02.68-2.32 1.08-3.71 1.08-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
      <span className="text-black text-sm font-medium font-['Roboto',sans-serif] tracking-wide">
        Sign in with Google
      </span>
    </button>
  );
}