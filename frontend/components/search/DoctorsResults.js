// components/search/DoctorsResults.js
import { useState, useEffect } from "react";
import { publicApiClient } from "@/utils/api";
import Pagination from "../Pagination";

const Doctor = ({ doctor }) => {
  // ... (unchanged Doctor component)
};

const Filters = ({ sortBy, setSortBy, onFiltersToggle }) => {
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <div className="w-full flex items-center justify-between">
      <div className="justify-start items-center gap-[5px] inline-flex">
        <div className="h-auto text-black text-md font-medium tracking-wide sm:flex xs:hidden">Sort</div>
        <select
          value={sortBy}
          onChange={handleSortChange}
          className="text-black border border-gray-300 p-1 rounded-md text-xs tracking-wide bg-transparent focus:outline-none"
        >
          <option value="relevance">By relevance</option>
          <option value="expertise">By expertise</option>
        </select>
      </div>
      <button
        onClick={onFiltersToggle}
        className="px-3 py-1.5 bg-[#293241] rounded-[5px] border border-[#293241] text-white text-sm tracking-wide xl:hidden flex items-center gap-2"
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
    </div>
  );
};

export default function DoctorsResults({
  specialty,
  location,
  ensurance,
  sex,
  takes_dates,
  experienceValue,
  onFiltersToggle,
  onCountChange,
}) {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("relevance");

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          ...(specialty && { specialty }),
          ...(location && { location }),
          ...(ensurance && { ensurance }),
          ...(sex && { sex }),
          ...(takes_dates && { takes_dates }),
          ...(experienceValue !== "any" && { experience_min: experienceValue }),
          page: currentPage,
        });
        const response = await publicApiClient.get(`/doctors/search/?${params.toString()}`);
        const data = response.data;
        let results = data.results;

        if (sortBy === "relevance") {
          results.sort((a, b) => b.average_rating - a.average_rating);
        } else if (sortBy === "expertise") {
          results.sort((a, b) => b.experience - a.experience);
        }

        onCountChange(data.count);
        setDoctors(results);
        setTotalPages(Math.ceil(data.count / 10));
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
  }, [specialty, location, ensurance, sex, takes_dates, experienceValue, currentPage, sortBy]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex-col justify-start items-center gap-4 inline-flex w-full xl:max-w-2xl lg:max-w-3xl md:max-w-2xl sm:max-w-xl">
      <Filters sortBy={sortBy} setSortBy={setSortBy} onFiltersToggle={onFiltersToggle} />
      {loading ? (
        <p className="text-[#060648]">Loading doctors...</p>
      ) : doctors.length > 0 ? (
        doctors.map((doctor) => <Doctor key={doctor.id} doctor={doctor} />)
      ) : (
        <div className="w-full h-80 flex justify-center items-center">
          <div className="flex flex-col justify-center items-center gap-1">
            <div className="text-[#060648] text-2xl font-semibold">No doctors found</div>
            <p className="text-[#060648]">Try adjusting your search criteria.</p>
            <img src="/images/dclogo.png" alt="No results" className="h-[75px] w-[75px] mt-4" />
          </div>
        </div>
      )}
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