import React, { useState, useEffect } from "react";
import { publicApiClient } from "@/app/utils/api";
import Pagination from "@/app/components/Pagination";
import Doctor from "./Doctor";
import dclogo from '@/assets/images/dclogo.png';
import Loading from "@/app/components/LoadingComponent";

interface FiltersProps {
  sortBy: string;
  setSortBy: (value: string) => void;
  onFiltersToggle: () => void;
}

const Filters: React.FC<FiltersProps> = ({ sortBy, setSortBy, onFiltersToggle }) => {
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  return (
    <div className="w-full flex items-center justify-between mt-4">
        <button
        onClick={onFiltersToggle}
        className="px-3 py-1.5 bg-[#293241] rounded-sm cursor-pointer border border-[#293241] text-white text-sm tracking-wide xl:hidden flex items-center gap-2"
      >
        Filters
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V19a1 1 0 01-.447.832l-4 2.5A1 1 0 019 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
          />
        </svg>
      </button>
      <div className="justify-start items-center gap-[5px] inline-flex">
        <div className="h-auto text-black text-md font-medium tracking-wide sm:flex xs:hidden">Sort</div>
        <select
          value={sortBy}
          onChange={handleSortChange}
          className="text-black border cursor-pointer border-gray-300 p-1 rounded-md text-xs tracking-wide bg-transparent focus:outline-none"
        >
          <option className="cursor-pointer" value="relevance">By relevance</option>
          <option className="cursor-pointer" value="expertise">By expertise</option>
        </select>
      </div>
    </div>
  );
};

interface DoctorsResultsProps {
  specialty: string;
  location: string;
  ensurance: string;
  sex: string;
  takes_dates: boolean;
  appointmentType?: string | null;
  experienceValue: string;
  onFiltersToggle: () => void;
  onCountChange: (count: number) => void;
}

export default function DoctorsResults({
  specialty,
  location,
  ensurance,
  sex,
  takes_dates,
  appointmentType,
  experienceValue,
  onFiltersToggle,
  onCountChange,
}: DoctorsResultsProps) {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>("relevance");

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const paramsObj: Record<string, string> = {};
        if (specialty) paramsObj.specialty = specialty;
        if (location) paramsObj.location = location;
        if (ensurance) paramsObj.ensurance = ensurance;
        if (sex) paramsObj.sex = sex;
        if (takes_dates) paramsObj.takes_dates = "true";
        if (appointmentType) paramsObj.appointment_type = appointmentType;
        if (experienceValue !== "any") paramsObj.experience_min = experienceValue;
        paramsObj.page = currentPage.toString();
        const params = new URLSearchParams(paramsObj);
        console.log("Fetching doctors with params:", params.toString());
        const response = await publicApiClient.get(`/doctors/search/?${params.toString()}`);
        console.log("API Response:", response.data);
        let results = response.data.results;

        if (sortBy === "relevance") {
          results.sort((a: any, b: any) => b.average_rating - a.average_rating);
        } else if (sortBy === "expertise") {
          results.sort((a: any, b: any) => b.experience - a.experience);
        }

        onCountChange(response.data.count);
        setDoctors(results);
        setTotalPages(Math.ceil(response.data.count / 6));
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };
    if (specialty || location) {
      fetchDoctors();
    }
    fetchDoctors();

  },[specialty, location, ensurance, sex, takes_dates, appointmentType, experienceValue, currentPage, sortBy, onCountChange]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <Loading text="Loading doctors..." />;
  }

  return (
    <div className="flex-col mx-auto xl:order-1 order-2 justify-start items-center lg:px-8 gap-4 inline-flex w-full">
      <div className="lg:w-full w-[95%]">
      <Filters sortBy={sortBy} setSortBy={setSortBy} onFiltersToggle={onFiltersToggle} />
      </div>
      
      <div className="gap-4 flex justify-center flex-col w-full lg:px-0 sm:px-4 ">
        {loading ? (
        //   <LoadingComponent isLoading={loading} />
        <h1>Loading...</h1>
        ) : doctors.length > 0 ? (
          doctors.map((doctor: any) => <Doctor key={doctor.id} doctor={doctor} />)
        ) : (
          <div className="w-full h-80 flex justify-center items-center">
            <div className="flex flex-col justify-center items-center gap-1">
              <div className="text-[#060648] text-2xl font-semibold">No doctors found</div>
              <p className="text-[#060648]">Try adjusting your search criteria.</p>
              <img src={dclogo.src} alt="No results" className="h-[75px] w-[75px] mt-4" />
            </div>
          </div>
        )}        
      </div>

      {totalPages > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}