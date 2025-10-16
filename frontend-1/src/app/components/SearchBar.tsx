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

export default function SearchBar({small}: {small?: boolean}) {
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
    <div className="max-w-4xl h-auto mt-[14dvh] mx-auto flex flex-col  relative z-20 bg-white border-2 border-black rounded-lg py-4 px-2 gap-2
    lg:bg-transparent lg:border-none  lg:rounded-none lg:gap-6 lg:mt-[12dvh] lg:max-w-7xl">
        <h1 className={`text-black font-semibold pl-2 
        ${small ? 'lg:text-3xl text-xl text-center' : 'text-2xl lg:text-5xl max-w-xl'}`}>
            Agenda tu cita con los doctores que necesites</h1>
        <div className="w-full flex flex-col 
        lg:bg-white lg:border-2 lg:border-black lg:rounded-lg lg:flex-row lg:h-18 lg:py-0 ">
            <div className="lg:w-[30.6%] h-17 lg:border-none border-b-1 border-gray-200/50">
                <SpecialtySearchBar
                    value={specialty}
                    onChange={handleSpecialtyChange}
                    round={`font-semibold`}
                />                
            </div>
            <div className="lg:w-[30.6%] h-17 border-b-1 border-gray-200/50 lg:border-l-2 ">
                <CityStateSearchBar
                    value={location}
                    onChange={setLocation}
                    round="font-semibold"
                />          
            </div>
            <div className="lg:w-[30.6%] h-17 border-b-1 border-gray-200/50 lg:border-l-2 ">
                <InsuranceSearchBar
                    value={insurances}
                    onChange={setInsurance}
                    round="font-semibold"
                />          
            </div>
            <div className="lg:w-[8.2%] mt-2 h-12 
            lg:h-full lg:mt-0 ">
                <button
                onClick={handleSearch}
                className="w-full h-full relative lg:-right-1 rounded-lg flex justify-center items-center bg-[#293241] hover:bg-[#3d5a80] lg:rounded-l-none lg:rounded-r-lg"
                >
                <span className="text-white font-bold text-lg mr-4 lg:hidden">Find doctor</span>
                <FaSearch className="lg:w-7 lg:h-7 w-5 h-5 text-white" />
                </button>
            </div>
        </div>
    </div>
  );
}