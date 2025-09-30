'use client';
import doctors_bg from "@/assets/images/doctors_bg.png";
import Image from "next/image";
import SearchBar from "@/app/components/SearchBar";
import ActiveAppointments from "../appointments/components/ActiveAppointments";
import { useState, useEffect } from "react";
import ThreeFavDocs from "./components/ThreeFavDocs";
import { apiClient } from "../utils/api";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "../utils/auth";
import { fetchActiveAppointments } from "../lib/appointments";

// const active_appointments = [
//     {
//         "appointment_id": 1,
//         "week_availability": {
//             "id": 1,
//             "doctor": 2,
//             "week": "2025-09-17"
//         },
//         "weekday": {
//             "id": 1,
//             "week_availability": 1,
//             "day": "2025-09-17",
//             "hours": "['08:00', '08:30', '09:00']",
//             "place": 1
//         },
//         "time": "08:30",
//         "active": true,
//         "patient": {
//             "id": 2,
//             "first_name": "Raymond",
//             "last_name": "A’campo",
//             "profile_picture": undefined
//         }
//     }
// ]


export default function AccountPage() {
    const [isDoctor, setIsDoctor] = useState(false);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [active_appointments, setActiveAppointments] = useState<any[]>([]);
    const [favoriteDoctors, setFavoriteDoctors] = useState<any[]>([]);
    // const isauth = isAuthenticated();
    useEffect(() => {
        // Fetch user role from API or context
        const fetchUserRole = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get('/auth/me/');
                setLoading(false);
                setIsDoctor(response.data.is_doctor); // Adjust based on actual API response
            } catch (error) {
                console.error('Error fetching user role:', error);
                router.push('/login'); // Redirect to login on error
            }
        };

        const fetchPersonalData = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get('/auth/personal-data/');
                console.log(response.data);
                setFavoriteDoctors(response.data.favorite_doctors || []);
                setLoading(false);
                // Process personal details as needed
            } catch (error) {
                console.error('Error fetching personal details:', error);
            }
        };


        const loadAppointments = async () => {
            try {
                const activeAppointments = await fetchActiveAppointments();
                setActiveAppointments(activeAppointments.active_appointments || []);
                console.log('Active:', activeAppointments);

            } catch (error) {
                console.error('Error loading appointments:', error);
            }
            };

        const checkAuthAndFetch = async () => {
            const auth = await isAuthenticated();
            if (!auth) {
            console.log("User is not authenticated");
            router.push('/login');
            } else {
            console.log("User is authenticated");
            fetchUserRole();
            fetchPersonalData();
            loadAppointments();
            }
        };
        checkAuthAndFetch();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="relative flex flex-col">
            <div className="relative h-auto lg:min-h-[80dvh]">
            <div className="absolute inset-0 z-0 opacity-30">
                <Image
                src={doctors_bg.src}
                alt="Background"
                layout="fill"
                objectFit="cover"
                quality={100}
                objectPosition="25% 25%"
                />        
            </div>
            <div className="px-2">
                <SearchBar small={true}/>            
            </div>

            <div className="bg-white w-full z-10 min-h-[50dvh] relative mt-8 px-2 sm:px-4 py-16">
                <div className="xl:px-[5rem] w-full mx-auto flex flex-col lg:flex-row justify-center gap-4">
                    <div className="flex w-full justify-center sm:max-w-3xl mr-8">
                        <ActiveAppointments
                            appointments={active_appointments}
                            is_doctor={isDoctor}
                            onCancel={() => {console.log("Refresh appointments");}}
                            darker={true}
                            // setAlert={setAlert}
                        />                       
                    </div>
                    <ThreeFavDocs docs={favoriteDoctors}/>             
                </div>
            </div>
            </div>        
        </div>
        );
    }