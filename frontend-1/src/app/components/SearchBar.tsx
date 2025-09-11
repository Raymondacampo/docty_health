'use client';
import { useState } from "react";
import SpecialtySearchBar from "./SpecialtySearchbar";
import CityStateSearchBar from "./CityStateSearchbar";
import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import { HeartIcon, PuzzlePieceIcon, CloudIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import InsuranceSearchBar from "./InsuranceSearchbar";
// Define component props interface for AccessButton
interface AccessButtonProps {
  specialty: string;
  icon: React.ReactNode;
}

export default function SearchBar() {
    const router = useRouter();
    const [specialty, setSpecialty] = useState<string>("");
    const [location, setLocation] = useState<string>("");
    const [insurances, setInsurance] = useState<string>("");
    const [phoneMenu, setPhoneMenu] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const handleSearch = () => {
        if (!specialty) {
        setError(true);
        return;
        }
        setError(false);
        if (specialty || location) {
        const params = new URLSearchParams();
        if (specialty) params.append('specialty', specialty);
        if (location) params.append('location', location);
        router.push(`/search?${params.toString()}`);
        }
    };

    const handleSpecialtyChange = (newSpecialty: string) => {
        setSpecialty(newSpecialty);
        if (newSpecialty) {
        setError(false);
        }
    };

  return (
    <div className="max-w-7xl h-auto pt-[16dvh] mx-auto flex flex-col gap-6 relative z-10">
        <h1 className="text-5xl text-black max-w-xl font-semibold pl-2">Agenda tu cita con los doctores que necesites</h1>
        <div className="w-full h-18 flex bg-white border-2 border-black rounded-md">
            <div className="w-[30.6%]">
                <SpecialtySearchBar
                    value={specialty}
                    onChange={handleSpecialtyChange}
                    round={`font-semibold`}
                />                
            </div>
            <div className="w-[30.6%] border-l-2 border-gray-200/50">
                <CityStateSearchBar
                    value={location}
                    onChange={setLocation}
                    round="font-semibold"
                />          
            </div>
            <div className="w-[30.6%] border-l-2 border-gray-200/50">
                <InsuranceSearchBar
                    value={insurances}
                    onChange={setInsurance}
                    round="font-semibold"
                />          
            </div>
            <div className="w-[8.2%] h-full ">
                <button
                onClick={handleSearch}
                className="w-full h-full flex justify-center items-center bg-[#293241] hover:bg-[#3d5a80]"
                >
                <FaSearch className="w-7 h-7" />
                </button>
            </div>
        </div>
    </div>
  );
}