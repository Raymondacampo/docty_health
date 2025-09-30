import React, { useState, useEffect } from "react";
import { publicApiClient } from "@/app/utils/api";
import Pagination from "@/app/components/Pagination";
import Doctor from "./Doctor";
import doctor_profile from "@/assets/images/doctor_profile.png";

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
    </div>
  );
};

interface DoctorsResultsProps {
  specialty: string;
  location: string;
  ensurance: string;
  sex: string;
  takes_dates: string;
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
        const params = new URLSearchParams({
          ...(specialty && { specialty }),
          ...(location && { location }),
          ...(ensurance && { ensurance }),
          ...(sex && { sex }),
          ...(takes_dates && { takes_dates }),
          ...(experienceValue !== "any" && { experience_min: experienceValue }),
          page: currentPage.toString(),
        });
        const response = await publicApiClient.get(`/doctors/search/?${params.toString()}`);
        const data = {
            "count": 6,
            "next": null,
            "previous": null,
            "results": [
                {
                    "id": 2,
                    "user": {
                        "id": 4,
                        "first_name": "El pepe",
                        "last_name": "Bolenos asynol",
                        "email": "Elpepe@gmail.com",
                        "profile_picture": doctor_profile.src
                    },
                    "exequatur": "374628",
                    "experience": 12,
                    "sex": "M",
                    "taking_dates": true,
                    "takes_virtual": false,
                    "takes_in_person": false,
                    "description": "In the sun-drenched coastal city of Santo Domingo, where the pulse of the Caribbean meets the rhythm of modern medicine, Dr. Raymond Acampo Sandoval stands as a beacon of compassion and precision in the world of cardiology. Born under the whispering palms of a Dominican village, Raymond's early life was a tapestry woven from the threads of family, tradition, and an unwavering commitment to healing. With over 19 years of experience, he has become a trusted figure in his community, known for his holistic approach to patient care and his dedication to advancing the field of cardiology.",
                    "specialties": [
                        {
                            "id": 1,
                            "name": "Cardiologist"
                        }
                    ],
                    "clinics": [
                        {
                            "id": 2,
                            "name": "Modern Medical Center",
                            "city": "Santo Domingo",
                            "state": "Distrito Nacional",
                            "location": {
                                "latitude": 18.475941199999998,
                                "longitude": -69.9575012
                            },
                            "address": "Avenida Charles Sumner Esq, C. Jose Lopez 5, Santo Domingo, Dominican Republic"
                        }
                    ],
                    "ensurances": [
                        {
                            "id": 1,
                            "name": "senasa",
                            "logo": "/media/ensurance_logos/senasa.jpg"
                        }
                    ],
                    "average_rating": 4.0,
                    "review_count": 1,
                    "has_availability": true,
                    "is_favorited": false,
                    "cities": [
                        "Santo Domingo"
                    ]
                },
                {
                    "id": 4,
                    "user": {
                        "id": 8,
                        "first_name": "pepe",
                        "last_name": "gonzales marquinez",
                        "email": "elpepesito@gmail.com",
                        "profile_picture": doctor_profile.src
                    },
                    "exequatur": "967897",
                    "experience": 19,
                    "sex": "M",
                    "taking_dates": false,
                    "takes_virtual": false,
                    "takes_in_person": false,
                    "description": "In the sun-drenched coastal city of Santo Domingo, where the pulse of the Caribbean meets the rhythm of modern medicine, Dr. Raymond Acampo Sandoval stands as a beacon of compassion and precision in the world of cardiology. Born under the whispering palms of a Dominican village, Raymond's early life was a tapestry woven from the threads of family, tradition, and an unwavering commitment to healing. With over 19 years of experience, he has become a trusted figure in his community, known for his holistic approach to patient care and his dedication to advancing the field of cardiology.",
                    "specialties": [
                        {
                            "id": 1,
                            "name": "Cardiologist"
                        }
                    ],
                    "clinics": [],
                    "ensurances": [
                        {
                            "id": 1,
                            "name": "senasa",
                            "logo": "/media/ensurance_logos/senasa.jpg"
                        }
                    ],
                    "average_rating": 5.0,
                    "review_count": 1,
                    "has_availability": false,
                    "is_favorited": false,
                    "cities": []
                },
                {
                    "id": 3,
                    "user": {
                        "id": 5,
                        "first_name": "El pepe",
                        "last_name": "Bolenos asynol",
                        "email": "Elpepe@gmail.com",
                        "profile_picture": doctor_profile.src
                    },
                    "exequatur": "374628",
                    "experience": 12,
                    "sex": "M",
                    "taking_dates": true,
                    "takes_virtual": false,
                    "takes_in_person": false,
                    "description":null,
                    "specialties": [
                        {
                            "id": 1,
                            "name": "Cardiologist"
                        }
                    ],
                    "clinics": [
                        {
                            "id": 2,
                            "name": "Modern Medical Center",
                            "city": "Santo Domingo",
                            "state": "Distrito Nacional",
                            "location": {
                                "latitude": 18.475941199999998,
                                "longitude": -69.9575012
                            },
                            "address": "Avenida Charles Sumner Esq, C. Jose Lopez 5, Santo Domingo, Dominican Republic"
                        }
                    ],
                    "ensurances": [
                        {
                            "id": 1,
                            "name": "senasa",
                            "logo": "/media/ensurance_logos/senasa.jpg"
                        }
                    ],
                    "average_rating": 4.0,
                    "review_count": 1,
                    "has_availability": true,
                    "is_favorited": false,
                    "cities": [
                        "Santo Domingo"
                    ]
                },
        ]};
        

        let results = data.results;

        if (sortBy === "relevance") {
          results.sort((a: any, b: any) => b.average_rating - a.average_rating);
        } else if (sortBy === "expertise") {
          results.sort((a: any, b: any) => b.experience - a.experience);
        }

        onCountChange(data.count);
        setDoctors(results);
        setTotalPages(Math.ceil(data.count / 6));
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

  },[]);
//   [specialty, location, ensurance, sex, takes_dates, experienceValue, currentPage, sortBy, onCountChange]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex-col xl:order-1 order-2 justify-start items-center lg:px-8 gap-4 inline-flex w-full">
      <div className="xl:w-full xs:w-[90%] max-w-[95%]">
      <Filters sortBy={sortBy} setSortBy={setSortBy} onFiltersToggle={onFiltersToggle} />
      </div>
      
      <div className="gap-4 flex flex-col w-full lg:px-0 sm:px-4 ">
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
              <img src="/images/dclogo.png" alt="No results" className="h-[75px] w-[75px] mt-4" />
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