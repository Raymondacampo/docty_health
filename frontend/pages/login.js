import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/auth";
import LoginForm from "@/components/forms/LoginForm";
import { isAuthenticated } from "@/utils/auth";
import axios from "axios";
export default function LoginPage() {
    const root = useRouter()

    useEffect(() => {
        const loadUser = async () => {
            try {
                const accessToken = localStorage.getItem("access_token");  // ✅ Ensure the correct token is used
                console.log("Token being sent:", accessToken);

                if (accessToken) {
                    root.push('/profile')
                    console.error("No access token found");
                    return;
                }
                        
            } catch (error) {
                console.error("Error loading user:", error);
            } 
        }

        loadUser();
    })

    return (
        <div className="w-full py-9 px-2 flex-col justify-center items-center gap-16 inline-flex">
            <LoginForm/>
        </div>
    )
}
//