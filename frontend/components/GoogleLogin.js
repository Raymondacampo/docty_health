import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/context/auth";

// In GoogleButton.js
export default function GoogleButton({ setError }) {
    const { login } = useAuth();
  
    return (
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
        <GoogleLogin
            onSuccess={async (credentialResponse) => {
            console.log("Google Credential:", credentialResponse.credential);
            try {
              await login(credentialResponse.credential);
            } catch (error) {
              setError("Google login failed. Please try again.");
            }
          }}
          onError={() => {
            console.log("Google Login Failed");
            setError("Google authentication failed. Please try again.");
          }}
        />
      </GoogleOAuthProvider>
    );
  }