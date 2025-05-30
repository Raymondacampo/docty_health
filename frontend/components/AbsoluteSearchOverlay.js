import { useState } from "react";
import { useRouter } from "next/router";
import SpecialtySearchBar from "@/components/search/SpecialtySearchBar";
import CityStateSearchBar from "@/components/search/CityStateSearchBar";
import { FaSearch } from 'react-icons/fa';

export default function AbsoluteSearchOverlay({ setShow }) {
  const router = useRouter();
  const [specialty, setSpecialty] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    if (specialty) {
      router.push({
        pathname: "/search",
        query: { specialty, location },
      });
      setShow(false); // Close overlay after search
    }
  };

  const handleClose = () => {
    setShow(false);
  };

  return (
    <div className="absolute h-screen w-screen top-0 left-0 z-20 flex justify-center items-center
    sm:bg-black/30 sm:backdrop-blur-md
      xs:w-full xs:h-screen xs:bg-white">
      <div className="relative bg-white max-w-4xl mx-auto flex flex-col  items-center gap-8 p-4
        sm:border sm:rounded-md sm:h-auto sm:w-[90%] sm:justify-center
        xs:flex-col xs:p-4 xs:shadow-[0px_2px_4px_0px_rgba(0,0,0,0.5)] xs:border-0 xs:h-full xs:w-full">
        {/* Close Button */}
        <div className="flex w-full justify-between ">
            <div className="text-center text-[#293241] text-3xl font-bold tracking-[1px] ">
            Find your doctor!
            </div>  
            <button
            onClick={handleClose}
            className=" p-2 rounded-full hover:bg-[#293241]/20 transition-colors duration-200"
            aria-label="Close search overlay"
            >
            <div className="relative w-6 h-6">
                <span className="absolute top-1/2 left-0 w-full h-0.5 bg-[#293241] transform rotate-45"></span>
                <span className="absolute top-1/2 left-0 w-full h-0.5 bg-[#293241] transform -rotate-45"></span>
            </div>
            </button>
          
        </div>

        <div className="w-full flex flex-col gap-4 sm:border-2 rounded-lg
            xs:border-none
          sm:flex-row sm:gap-0">
          <div className="w-full h-[50px] rounded-lg">
            <SpecialtySearchBar
              value={specialty}
              onChange={setSpecialty}
              round="rounded-l-lg border-gray-200 sm:rounded-r-none xs:rounded-l-lg xs:rounded-r-lg sm:border-r-0 xs:border"
            />
          </div>
          <div className="w-full h-[50px] border-l sm:border-r-0 sm:rounded-none xs:rounded-lg xs:border">
            <CityStateSearchBar
              value={location}
              onChange={setLocation}
              round=" border-gray-200 xs:rounded-r-lg xs:rounded-lg"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={!specialty}
            className={`w-full h-[50px] bg-[#293241] shadow-[-2px_2px_4px_0px_rgba(0,0,0,0.5)] border border-black justify-center items-center gap-2.5 inline-flex text-white font-['Inter']  
              sm:py-4 sm:relative sm:left-[-4px] sm:translate-x-0  sm:bottom-0
              xs:py-2 xs:rounded-lg xs:absolute xs:bottom-4 xs:w-[95%] xs:left-1/2 xs:-translate-x-1/2
              ${!specialty ? "opacity-50 cursor-not-allowed" : "hover:bg-[#3d5a80]"}`}
          >
            Search <FaSearch className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}