import React from "react";
import SpecialtySearchBar from "@/app/components/SpecialtySearchbar";
import InsuranceSearchBar from "@/app/components/InsuranceSearchbar";
import CityStateSearchBar from "@/app/components/CityStateSearchbar";
import SexFilter from "./Sex";
import TakesDatesFilter from "./TakesAppointment";
import ExperienceFilter from "./Experience";
import { motion, AnimatePresence } from 'framer-motion';


interface SearchFiltersProps {
  specialty: string;
  onSpecialty: (value: string) => void;
  location: string;
  onLocation: (value: string) => void;
  ensurance: string;
  onEnsurance: (value: string) => void;
  sex: string;
  onSex: (value: string) => void;
  takes_appointments: boolean;
  onTake:(value: boolean) => void;
  appointmentType?: string | null;
  onAppointment: (value: string) => void;
  experienceValue: string;
  setExperienceValue: (value: string) => void;
  onClose: () => void;
  onApply?: () => void;
  isXsScreen: boolean;
}

export default function SearchFilters({
  specialty,
  onSpecialty,
  location,
  onLocation,
  ensurance,
  onEnsurance,
  sex,
  onSex,
  takes_appointments,
  onTake,
  appointmentType,
  onAppointment,
  experienceValue,
  setExperienceValue,
  onClose,
  onApply,
  isXsScreen,
}: SearchFiltersProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ width: 0, opacity: 0, scaleX: 0, transformOrigin: 'left' }}
        animate={{ width: 'auto', opacity: 1, scaleX: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className={`h-[100dvh] w-full inset-0  flex justify-center gap-5
          xl:items-center xl:w-auto xl:h-auto
          sm:max-w-[350px] sm:top-0 sm:left-0 sm:fixed shadow-sm z-60 
          ` + (isXsScreen ? "fixed pb-12" : "xl:relative")}
      >
        <div
          className={`p-4 w-full bg-white flex-col justify-start items-start gap-8 flex h-auto
            xl:w-80 xl:h-auto
            sm:w-full sm:rounded-lg sm:overflow-none sm:left-0 ` + (isXsScreen ? "overflow-y-auto" : "")}
        >
          <div className="self-stretch flex-col justify-start items-start gap-[21px] flex">
            <div className="relative self-stretch justify-between gap-2 flex">
              <div className="text-[#060648] text-2xl tracking-wider">
                Search filters
              </div>
              <button
                onClick={onClose}
                className="right-2 text-black hover:text-gray-700 xl:hidden cursor-pointer"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 18L18 6M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div className="self-stretch flex-col justify-start items-start gap-5 flex px-2">
              <div className="w-full flex flex-col justify-start gap-1.5">
                <div className="font-lg text-lg text-gray-700">Specialty</div>
                <div className="h-[40px] border rounded-md border-black">
                  <SpecialtySearchBar
                    value={specialty}
                    onChange={onSpecialty}
                    round={"rounded-md text-sm"}
                  />
                </div>
              </div>
              <div className="w-full flex flex-col justify-start gap-1.5">
                <div className="font-lg text-lg text-gray-700">City</div>
                <div className="h-[40px] border border-black rounded-md">
                  <CityStateSearchBar
                    value={location}
                    onChange={onLocation}
                    round={"rounded-md text-sm"}
                  />
                </div>
              </div>
              <div className="w-full flex flex-col justify-start gap-1.5">
                <div className="font-lg text-lg text-gray-700">Insurance</div>
                <div className="h-[40px] border border-black rounded-md">
                  <InsuranceSearchBar
                    value={ensurance}
                    onChange={onEnsurance}
                    round={"rounded-md text-sm"}
                  />
                </div>
              </div>
            </div>
          </div>
          <ExperienceFilter value={experienceValue} onChange={setExperienceValue} />
          <SexFilter value={sex} onChange={onSex} />
          <TakesDatesFilter taking_appointments={takes_appointments} appointment_type={appointmentType} onChange={onTake} onAppointment={onAppointment} />
          {isXsScreen && onApply && (
              <div className="bg-white w-full fixed bottom-0 left-0 py-2 border-t justify-end items-center flex">
                  <button
                      onClick={onApply}
                      className="w-auto ml-auto mr-4 px-4 py-2 bg-[#2b2774] text-white rounded-md hover:bg-blue-900 text-sm "
                  >
                      Apply Filters
                  </button>                
              </div>

          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}