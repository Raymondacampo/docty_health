import SignupForm from "@/components/forms/SignupForm"
import Benefits from "@/components/forms/Benefits"
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Signup() {
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

    return(
        <div className="w-full flex-col justify-center items-center gap-16 inline-flex
        md:pt-9
        sm:px-2 
        xs:px-0 xs:pb-9">
            <div class="pt-8 pb-12 bg-[#98c1d1]/20 rounded-[15px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] items-center inline-flex
            lg:gap-24 lg:justify-start
            md:justify-between md:gap-16 md:flex-row md:w-auto
            sm:px-8 sm:w-[95%] 
            xs:flex-col xs:gap-8 xs:w-full xs:px-2">
                <SignupForm/>
                <Benefits/>
            </div>
            </div>
    )
}