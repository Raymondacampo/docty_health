import CreateWeekScheduleModal from "@/components/availability/CreateWeekScheduleModal";
import WeekSchedulesList from "@/components/availability/WeekSchedulesList";
import SidebarToggle from "@/components/account/SideBarToggle";
import NavBar from "@/components/account/NavBar";
import { useState } from "react";
export default function Availability() {
    const [isNavOpen, setIsNavOpen] = useState(true); // State for NavBar toggle


  return (
    <div className="flex w-full min-h-screen">
      {!isNavOpen && (
        <SidebarToggle onToggle={() => setIsNavOpen(true)} />
      )}
      <NavBar isOpen={isNavOpen} onToggle={() => setIsNavOpen(false)} selection={'ava'}/>
      <div className="flex-1 justify-center items-start gap-2.5 inline-flex">
        <div className="py-4 rounded-[20px] justify-center items-start gap-16 inline-flex mt-2 sm:px-0 xs:w-full">
          <div className="w-full min-h-[500px] self-stretch py-8 bg-white justify-start items-start gap-6 flex flex-col flex-wrap shadow-[0px_4px_6px_2px_rgba(0,0,0,0.15)] 
            lg:px-20 
            md:px-10 
            sm:px-20 sm:rounded-[20px] sm:max-w-[900px] 
            xs:px-4">
              <div className="w-full flex justify-between items-start
              sm:flex-row xs:flex-col">                
                <div className="flex flex-col items-start">
                  <h1 className="font-bold mb-2 sm:text-3xl xs:text-2xl">Availability</h1>
                  <p className="mb-4">This is the availability page.</p>
                </div>
                <CreateWeekScheduleModal />
              </div>
              <WeekSchedulesList />              
          </div>
        </div>
      </div>

      {/* Add more components or content as needed */}
    </div>
  );
}