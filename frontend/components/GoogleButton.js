import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/auth';

export default function GoogleButton() {
    const { login } = useAuth();
    return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
            <GoogleLogin
            onSuccess={(credentialResponse) => {
                login(credentialResponse.credential)
            }}
            onError={() => console.log('Login Failed')}
            />
        </GoogleOAuthProvider>
      );
}