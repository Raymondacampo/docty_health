import { useState } from "react";
import SpecialtySearchBar from "@/components/search/SpecialtySearchBar"
import CityStateSearchBar from "@/components/search/CityStateSearchBar";
import { useRouter } from "next/router";

export default function SearchBar(){
    const router = useRouter();
    const [specialty, setSpecialty] = useState("");
    const [location, setLocation] = useState("");

    const handleSearch = () => {
        if (specialty || location) {
          router.push({
            pathname: "/search",
            query: { specialty, location },
          });
        }
      };

    return(
        <div className="w-[90%] h-auto pt-24 pb-32 ml-auto mr-auto flex-col justify-center items-center gap-16 flex
        xl:pt-42 xl:pb-48
        lg:pt-42 lg:pb-48
        md:pt-36 md:pb-36
        sm:pt-36">
            <div className="w-auto h-auto bg-white/0 rounded-[15px] flex-col justify-start items-center gap-8 inline-flex">
                <div className="h-auto   text-center text-[#293241] text-4xl font-normal tracking-[1px] [text-shadow:_0px_4px_4px_rgb(0_0_0_/_0.25)]
                xl:text-6xl xl:tracking-[6.20px]
                lg:text-6xl lg:tracking-[3.20px]
                md:text-5xl md:tracking-[3.20px]
                sm:text-5xl">Find your doctor</div>
                <div className="text-center w-[90%] max-w-4xl text-black text-sm font-thin tracking-[0.5px]
                xl:text-lg lg:text-lg md:text-lg">Doctify is your doctor search and appointment booking web app designed to simplify access to healthcare in the Dominican Republic. </div>
            </div>
                <div className="w-full h-[60px] max-w-4xl border-black justify-center flex-col items-start flex gap-4 p-4 relative text-black
                xl:flex-row xl:gap-0 xl:p-0 xl:w-[90%]
                lg:flex-row lg:gap-0 lg:p-0 lg:w-[90%]
                md:flex-row md:gap-0 md:p-0 
                sm:flex-row sm:gap-0 sm:p-0 sm:border  sm:rounded-md 
                xs:rounded-lg xs:shadow-[0px_2px_4px_0px_rgba(0,0,0,0.5)] xs:border-0">
                  <div className="h-full w-full rounded-lg">
                    <SpecialtySearchBar value={specialty} onChange={setSpecialty} round={'rounded-l-lg border-r border-gray-200'} />  
                  </div>
                  
                  <CityStateSearchBar value={location} onChange={setLocation} round={'border-r border-gray-200'} />
                  <button onClick={handleSearch} 
                  className="h-[100%] w-full bg-[#293241] shadow-[-2px_2px_4px_0px_rgba(0,0,0,0.5)] border border-black justify-center items-center gap-2.5 inline-flex relative
                  sm:py-4 xs:py-2 xs:rounded-l-sm">
                  Search
                  </button>
            </div>
        </div>
    )
}