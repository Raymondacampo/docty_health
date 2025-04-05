import SpecialtySearchBar from "./SpecialtySearchBar";
import EnsuranceSearchBar from "./EnsuranceSearchBar";
import LocationSearchBar from "./LocationSearchBar";
import SexFilter from "./SexFilter";
import TakesDatesFilter from "./TakesDatesFilter";
import ExperienceFilter from "./ExperienceFilter";

export default function SearchFilters({ specialty, onSpecialty, location, onLocation, ensurance, onEnsurance, sex, onSex, takes_dates, onTake,experienceValue, setExperienceValue, onClose }) {
    return(
        <div className="xl:w-auto xl:h-auto xl:relative xs:fixed xs:w-[100%] xs:h-[100%] xs:top-0 xs:left-0 backdrop-blur-md bg-white/30 z-10 flex justify-center items-center gap-5 overflow-y-scroll
">
            <div class=" p-4 bg-white  rounded-lg flex-col justify-start items-start gap-8 flex 
            xl:w-80 xl:h-auto xl:shadow-[0px_4px_4px_0px_rgba(0,0,0,0.15)]
            sm:w-[60%] sm:h-auto sm:shadow-[0px_4px_4px_4px_rgba(0,0,0,0.30)]
            xs:w-full xs:h-full">
                <div class="self-stretch flex-col justify-start items-start gap-[21px] flex">
                    <div className="relative self-stretch justify-between gap-2 flex">
                        <div class="text-[#060648] text-2xl font-['Inter'] tracking-wider">Search filters</div>   
                        <button onClick={onClose} className="right-2 text-black hover:text-gray-700
                        xl:hidden xs:block">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                    
                    <div class="self-stretch flex-col justify-start items-start gap-5 flex px-2 ">
                        <div className="w-full flex flex-col justify-start gap-1.5">
                            <div className="font-lg text-lg text-gray-700">Specialty</div>
                            <div className="h-[40px] border rounded-md border-black ">
                                <SpecialtySearchBar value={specialty} onChange={onSpecialty} round={'rounded-md text-sm'}/>   
                            </div>                        
                        </div>
                        <div className="w-full flex flex-col justify-start gap-1.5">
                            <div className="font-lg text-lg text-gray-700">Clinic</div>
                            <div className="h-[40px] border border-black rounded-md ">
                                <LocationSearchBar value={location} onChange={onLocation} round={'rounded-md text-sm'}/>   
                            </div>                        
                        </div>
                        <div className="w-full flex flex-col justify-start gap-1.5">
                            <div className="font-lg text-lg text-gray-700">Ensurance</div>
                            <div className="h-[40px] border border-black rounded-md ">
                                <EnsuranceSearchBar value={ensurance} onChange={onEnsurance} round={'rounded-md text-sm'}/>   
                            </div>                        
                        </div>
                    </div>
                </div>
                <ExperienceFilter value={experienceValue} onChange={setExperienceValue} />
                <SexFilter value={sex} onChange={onSex}/>
                <TakesDatesFilter value={takes_dates} onChange={onTake}/>
                {/* <SexSelection/>
                <MeetingMethod/> */}
            </div>            
        </div>

    )
}