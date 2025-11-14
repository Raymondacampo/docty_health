import React from "react";

interface SearchHeadProps {
  specialty: string;
  location: string;
  ensurance: string;
  sex: string;
  count: number;
}

export default function SearchHead({ specialty, location, ensurance, sex, count }: SearchHeadProps) {
  return (
    <div className="w-auto h-auto py-[21px] bg-gradient-to-r from-[#293241] to-[#3d5a80] flex-col justify-center items-center gap-2.5 flex overflow-hidden
    sm:px-16 px-2">
      <div className="w-auto self-stretch justify-between items-center gap-4 flex
      xl:justify-center xl:flex-row
      lg:justify-center lg:flex-row
      md:justify-center md:flex-row
      xs:flex-col">
        <div className="justify-center w-full h-auto items-center  flex flex-wrap gap-y-1 gap-x-4
        md:w-auto">
          <div className="flex gap-x-2 flex-wrap justify-center w-auto h-auto text-white tracking-wide text-center text-sm">
            {sex !== 'both' && (sex === 'M' ? <div className="text-lg">Male </div> : <div className="text-lg">Female </div> )}  
            <div className="text-lg">{specialty ? `${specialty}s` : 'Doctors'} </div>
            {location && <div className="flex items-center gap-2">in <div className="text-lg">{location}</div></div>} 
            {ensurance && ensurance != 'any' && <div className="flex items-center gap-2">with ensurance <div className="text-lg">{ensurance}</div></div>}
          </div>
          <div className="w-auto text-white text-xs font-medium tracking-wider text-center">
            ({count} results)
          </div>
        </div>
      </div>
    </div>
  );
}