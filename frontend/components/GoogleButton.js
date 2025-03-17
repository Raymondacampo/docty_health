import { GoogleOAuthProvider} from '@react-oauth/google';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/auth';
import GoogleButton from './GoogleLogin';
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