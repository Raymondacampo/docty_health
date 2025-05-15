import { useState } from "react";
import SpecialtySearchBar from "@/components/search/SpecialtySearchBar";
import CityStateSearchBar from "@/components/search/CityStateSearchBar";
import { useRouter } from "next/router";
import { FaSearch } from "react-icons/fa";
import { PlusIcon } from '@heroicons/react/24/solid';

export default function SearchBar() {
    const router = useRouter();
    const [specialty, setSpecialty] = useState("");
    const [location, setLocation] = useState("");
    const [phoneMenu, setPhoneMenu] = useState(false);
    const [error, setError] = useState(false); // State for error handling

    const handleSearch = () => {
        if (!specialty) {
            setError(true); // Set error if specialty is empty
            return;
        }
        setError(false); // Clear error if specialty is present
        if (specialty || location) {
            router.push({
                pathname: "/search",
                query: { specialty, location },
            });
        }
    };

    // Clear error when specialty is selected
    const handleSpecialtyChange = (newSpecialty) => {
        setSpecialty(newSpecialty);
        if (newSpecialty) {
            setError(false);
        }
    };

    return (
        <div className="w-full h-auto pt-24 pb-12 ml-auto mr-auto flex-col justify-center items-center gap-16 flex relative px-4 sm:pt-36">
            <div className="w-auto h-auto bg-white/0 rounded-[15px] flex-col justify-start items-center gap-8 inline-flex animate-slide-up relative z-10">
                <div className="h-auto font-bold text-center tracking-wide text-[#293241] [text-shadow:_0px_4px_4px_rgb(0_0_0_/_0.25)] xl:text-7xl sm:text-6xl xs:text-5xl">
                    DoctyHealth
                </div>
                <div className="text-center w-[90%] max-w-2xl text-black font-thin tracking-[0.5px] text-sm">
                    Doctify is your doctor search and appointment booking web app designed to simplify access to healthcare in the Dominican Republic.
                </div>
                <img
                    src="images/stethoscope_icon_tilted.png"
                    className="absolute z-0 animate-diagonal-move sm:h-[300px] sm:top-[-115px] sm:right-[-200px] sm:block xs:hidden"
                />
            </div>
            <div className="w-full max-w-4xl border-black justify-center flex-col items-start flex gap-4 relative z-10 text-black bg-white border animate-slide-up 
                xl:flex-row xl:gap-0 xl:p-0 xl:w-[90%]
                lg:flex-row lg:gap-0 lg:p-0 lg:w-[90%]
                md:flex-row md:gap-0 md:p-0 
                sm:flex-row sm:gap-0 sm:p-0 sm:border sm:rounded-xl sm:block 
                xs:rounded-lg xs:shadow-[0px_2px_4px_0px_rgba(0,0,0,0.5)] xs:border-0 xs:hidden">
                <div className="w-full flex flex-col justify-between items-center gap-4 rounded-lg p-4 pb-6 ml-4 sm:border-2 xs:border-none">
                    <div className="w-full flex gap-4 justify-start ml-4">
                        <div className="text-[#293241] text-2xl font-bold tracking-[1px]">Find your doctor</div>
                    </div>
                    <div className="w-full flex justify-center">
                        <div className={`w-full min-w-[210px] max-w-xs h-[60px] border rounded-l-lg ${error ? 'border-red-700/70 border-2 shadow-inner' : 'border-none'}`}
                        style={{ boxShadow: 'inset 0 2px 4px 0 rgba(239, 68, 68, 0.5)' }}>
                            <SpecialtySearchBar
                                value={specialty}
                                onChange={handleSpecialtyChange}
                                round={`rounded-l-md border-gray-400/80 sm:rounded-r-none xs:rounded-l-md xs:rounded-r-lg sm:border-r-0 xs:border`}
                            />
                            {error && (
                                <div className="absolute text-red-500 text-xs mt-1">
                                    Please select a specialty
                                </div>
                            )}
                        </div>
                        <div className="w-full min-w-[235px] h-[60px] max-w-xs border-l border-gray-400/80 sm:border-r-0 sm:rounded-none xs:rounded-lg xs:border">
                            <CityStateSearchBar
                                value={location}
                                onChange={setLocation}
                                round="xs:rounded-r-lg xs:rounded-lg"
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            className="w-auto h-[60px] bg-[#293241] max-w-[200px] shadow-[-2px_2px_4px_0px_rgba(0,0,0,0.5)] border border-black justify-center items-center gap-2.5 inline-flex text-white font-['Inter'] 
                            sm:py-4 sm:relative sm:left-[-20px] sm:translate-x-0 sm:bottom-0
                            xs:py-2 xs:rounded-full xs:bottom-4 xs:w-[95%] xs:left-1/2 xs:-translate-x-1/2
                            hover:bg-[#3d5a80]"
                        >
                            Search <FaSearch className="w-7 h-7" />
                        </button>
                    </div>
                </div>
            </div>
            <button onClick={() => setPhoneMenu(true)} className="gap-4 w-[90%] border border-gray-400 justify-between items-center flex-nowrap rounded-full sm:hidden xs:flex">
                <div className="flex px-4 text-black">Search for a doctor</div>
                <div className="flex bg-[#293241] p-3 rounded-full relative right-[-1px]">
                    <FaSearch className="w-6 h-6" />
                </div>
            </button>
            <img
                src="images/cross_r_no_bg.png"
                className="absolute top-0 z-0 sm:h-[200px] sm:left-[-75px] xs:h-[100px] xs:left-[-40px]"
            />
            <img
                src="images/cross_l_no_bg.png"
                className="h-[150px] absolute right-0 bottom-1 z-0 sm:h-[150px] sm:bottom-[-50px] xs:h-[100px] xs:bottom-[-70px]"
            />
            {phoneMenu && (
                <div className="fixed top-0 text-black bg-[#3d5a80] w-screen h-screen">aaaaaaa</div>
            )}
        </div>
    );
}