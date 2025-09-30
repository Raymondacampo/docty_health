import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { login } from "../utils/auth";
import { useRouter } from 'next/navigation'; // App Router

export default function GoogleButton({ setError }: { setError: (error: string) => void }) {
  const router = useRouter();

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          if (!credentialResponse.credential) {
            console.error("Google Credential is undefined");
            setError("Google authentication failed: No credential received.");
            return;
          }
          console.log("Google Credential:", credentialResponse.credential);
          try {
            await login(credentialResponse.credential, true);
          } catch (error) {
            console.error("Google login failed:", error);
            setError("Google login failed. Please try again.");
          }
        }}
        onError={() => {
          console.error("Google Login Failed");
          setError("Google authentication failed. Please try again.");
        }}
      />
    </GoogleOAuthProvider>
  );
}