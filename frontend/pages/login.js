import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import LoginForm from "@/components/forms/LoginForm";

// const isTokenExpired = (token) => {
//     if (!token) return true; // No token means it's "expired" or invalid
//     try {
//       const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode payload
//       const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds
//       return Date.now() > expirationTime; // True if current time is past expiration
//     } catch (error) {
//       console.error("Invalid token format:", error);
//       return true; // Treat malformed tokens as expired/invalid
//     }
//   };

export default function LoginPage() {
    //  const { user, loading } = useUser(); // Use the hook
    // console.log(user)
    // if (loading) return <div>Loading profile...</div>;

    return (
        <div className="w-full py-9 px-4 flex-col justify-center items-center gap-16 inline-flex">
            <LoginForm/>
        </div>
    )
}
//