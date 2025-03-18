// components/GoogleButton.js
import { useRouter } from 'next/router';

export default function GoogleButton() {
  const router = useRouter();

  const handleGoogleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = 'https://juanpabloduarte.com/auth/google/callback';
    const scope = 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid'; // Full scope URLs
    const responseType = 'code';
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${encodeURIComponent(scope)}`;

    window.location.href = googleAuthUrl;
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center gap-2"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10S2 17.514 2 12 6.486 2 12 2zm-.225 14.854v-1.61h-4.02v1.61h4.02zm.45-3.316c0-3.22 2.013-4.885 4.02-4.885 1.88 0 3.015 1.242 3.015 2.963v5.838h-1.61v-5.672c0-1.105-.683-1.828-1.405-1.828-1.006 0-2.02 1.105-2.02 3.527v3.973h-1.61v-3.916z"
          fill="#fff"
        />
      </svg>
      Sign in with Google
    </button>
  );
}