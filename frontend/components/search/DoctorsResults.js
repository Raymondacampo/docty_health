// DoctorsResults.js
import { useState, useEffect } from "react";
import { publicApiClient } from "@/utils/api";
import Pagination from "../Pagination";

const Doctor = ({ doctor }) => {
  const specialties = doctor.specialties.map(s => s.name).join(", ");
  const clinics = doctor.clinics.map(c => c.name).join(", ");
  const takingDates = doctor.taking_dates;
  const inPerson = doctor.clinics.length > 0;
  const averageRating = doctor.average_rating || 0;
  const reviewCount = doctor.review_count || 0;
  const hasAvailability = doctor.has_availability;

  return (
    <div className="w-full px-2 pb-2 rounded-lg border border-black/25 bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex-col justify-start items-center gap-4 flex md:gap-2.5 md:min-w-2xl">
      <div className="self-stretch px-1 justify-start items-center gap-4 inline-flex relative sm:flex-row xs:flex-col">
        <div className="w-[100px] h-[100px] bg-[#d9d9d9] rounded-full xs:mt-8"></div>
        <div className="grow shrink basis-0 flex-col justify-start items-start gap-2 inline-flex
        xs:w-[95%]">
          <div className="self-stretch flex-col justify-start items-start gap-[3px] flex">
            <div className="self-stretch py-[5px] border-b border-[#293241]/0 justify-between items-start inline-flex overflow-hidden">
              <div className="text-[#293241] text-lg font-medium font-['Inter'] tracking-wide sm:text-xl">
                Dr. {doctor.user.first_name} {doctor.user.last_name}
              </div>
              <div className="items-end gap-2 flex py-1 sm:relative xs:absolute xs:top-0 xs:right-0">
                <div className="h-auto justify-center items-center gap-1 flex">
                  <svg width="17" height="16" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.4999 11.24L3.8699 13.432C3.76324 13.4846 3.66424 13.506 3.5729 13.496C3.48224 13.4853 3.3939 13.454 3.3079 13.402C3.22124 13.3486 3.1559 13.2733 3.1119 13.176C3.0679 13.0786 3.0639 12.9723 3.0999 12.857L4.0659 8.74695L0.870902 5.97695C0.780902 5.90362 0.721569 5.81595 0.692902 5.71395C0.664236 5.61195 0.670569 5.51429 0.711903 5.42095C0.753236 5.32762 0.808236 5.25095 0.876902 5.19095C0.946236 5.13295 1.03957 5.09362 1.1569 5.07295L5.3729 4.70495L7.0169 0.812953C7.06224 0.702953 7.12757 0.62362 7.2129 0.574953C7.29824 0.526286 7.3939 0.501953 7.4999 0.501953C7.6059 0.501953 7.7019 0.526286 7.7879 0.574953C7.8739 0.62362 7.9389 0.702953 7.9829 0.812953L9.6269 4.70495L13.8419 5.07295C13.9599 5.09295 14.0536 5.13262 14.1229 5.19195C14.1922 5.25062 14.2476 5.32695 14.2889 5.42095C14.3296 5.51429 14.3356 5.61195 14.3069 5.71395C14.2782 5.81595 14.2189 5.90362 14.1289 5.97695L10.9339 8.74695L11.8999 12.857C11.9372 12.971 11.9336 13.077 11.8889 13.175C11.8442 13.273 11.7786 13.3483 11.6919 13.401C11.6066 13.4543 11.5182 13.486 11.4269 13.496C11.3362 13.506 11.2376 13.4846 11.1309 13.432L7.4999 11.24Z" fill="#293241"/>
                  </svg>
                  <p className="text-[#3d5a80] text-xs items-end font-light font-['Inter']">{averageRating}</p>
                </div>
                <div className="h-[17px] justify-start items-center gap-2.5 flex">
                  <div data-svg-wrapper>
                    <svg width="7" height="8" viewBox="0 0 7 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.33 0.669922C2.44683 0.669922 1.59983 1.02076 0.975335 1.64526C0.350839 2.26975 0 3.11675 0 3.99992C0 4.88309 0.350839 5.73009 0.975335 6.35459C1.59983 6.97908 2.44683 7.32992 3.33 7.32992C5.17815 7.32992 6.66 5.84807 6.66 3.99992C6.66 3.11675 6.30916 2.26975 5.68466 1.64526C5.06017 1.02076 4.21317 0.669922 3.33 0.669922Z" fill="#3D5A80"/>
                    </svg>
                  </div>
                  <div className="text-[#3d5a80] text-xs font-light font-['Inter'] tracking-wide whitespace-nowrap">{reviewCount} reviews</div>
                </div>
              </div>
            </div>
            <div className="self-stretch justify-start items-center gap-[9px] inline-flex">
              <div className="text-[#293241] text-xs font-['Inter'] tracking-wide">{specialties.toUpperCase()}</div>
            </div>
          </div>
          <div className="self-stretch h-auto flex-col justify-start items-start gap-1 flex">
            {hasAvailability && (
              <div className="justify-center items-center gap-[9px] inline-flex">
                <div data-svg-wrapper>
                  <svg width="13" height="14" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M7.5 15.5C8.48491 15.5 9.46018 15.306 10.3701 14.9291C11.2801 14.5522 12.1069 13.9997 12.8033 13.3033C13.4997 12.6069 14.0522 11.7801 14.4291 10.8701C14.806 9.96018 15 8.98491 15 8C15 7.01509 14.806 6.03982 14.4291 5.12987C14.0522 4.21993 13.4997 3.39314 12.8033 2.6967C12.1069 2.00026 11.2801 1.44781 10.3701 1.0709C9.46018 0.693993 8.48491 0.5 7.5 0.5C5.51088 0.5 3.60322 1.29018 2.1967 2.6967C0.790176 4.10322 0 6.01088 0 8C0 9.98912 0.790176 11.8968 2.1967 13.3033C3.60322 14.7098 5.51088 15.5 7.5 15.5ZM7.30667 11.0333L11.4733 6.03333L10.1933 4.96667L6.61 9.26583L4.75583 7.41083L3.5775 8.58917L6.0775 11.0892L6.7225 11.7342L7.30667 11.0333Z" fill="#3D5A80"/>
                  </svg>
                </div>
                <div className="w-[97px] h-[18px] text-[#3d5a80] text-xs font-normal font-['Inter'] tracking-wide">Doctify dates</div>
              </div>
            )}
            {inPerson && (
              <div className="justify-start items-center gap-2.5 inline-flex">
                <div data-svg-wrapper className="relative">
                  <svg width="12" height="15" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.23498 8.5C9.2062 8.5 10.8042 6.82107 10.8042 4.75C10.8042 2.67893 9.2062 1 7.23498 1C5.26376 1 3.66577 2.67893 3.66577 4.75C3.66577 6.82107 5.26376 8.5 7.23498 8.5Z" fill="#3D5A80" stroke="#3D5A80"/>
                    <path d="M10.8042 10H11.0555C11.5774 10.0002 12.0812 10.2005 12.4724 10.5635C12.8636 10.9264 13.1152 11.4269 13.1799 11.971L13.459 14.314C13.4841 14.5251 13.4662 14.7393 13.4064 14.9426C13.3467 15.1458 13.2465 15.3334 13.1125 15.4928C12.9785 15.6523 12.8137 15.78 12.6292 15.8674C12.4446 15.9549 12.2445 16 12.042 16H2.42799C2.22554 16 2.02538 15.9549 1.84082 15.8674C1.65626 15.78 1.49151 15.6523 1.3575 15.4928C1.22349 15.3334 1.1233 15.1458 1.06356 14.9426C1.00382 14.7393 0.985914 14.5251 1.01102 14.314L1.28942 11.971C1.35416 11.4267 1.60595 10.9259 1.99743 10.563C2.38891 10.2 2.89312 9.99979 3.41524 10H3.66579" fill="#3D5A80"/>
                    <path d="M10.8042 10H11.0555C11.5774 10.0002 12.0812 10.2005 12.4724 10.5635C12.8636 10.9264 13.1152 11.4269 13.1799 11.971L13.459 14.314C13.4841 14.5251 13.4662 14.7393 13.4064 14.9426C13.3467 15.1458 13.2465 15.3334 13.1125 15.4928C12.9785 15.6523 12.8137 15.78 12.6292 15.8674C12.4446 15.9549 12.2445 16 12.042 16H2.42799C2.22554 16 2.02538 15.9549 1.84082 15.8674C1.65626 15.78 1.49151 15.6523 1.3575 15.4928C1.22349 15.3334 1.1233 15.1458 1.06356 14.9426C1.00382 14.7393 0.985914 14.5251 1.01102 14.314L1.28942 11.971C1.35416 11.4267 1.60595 10.9259 1.99743 10.563C2.38891 10.2 2.89312 9.99979 3.41524 10H3.66579" stroke="#3D5A80" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="w-[68px] h-[19px] text-[#3d5a80] text-xs font-normal font-['Inter'] tracking-wide">In person</div>
              </div>
            )}
            <div className="self-stretch justify-start items-center gap-3 inline-flex">
              <div data-svg-wrapper className="relative">
                <svg width="11" height="15" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.5 16C9.55556 11.9615 12 8.5 12 6.19231C12 4.81522 11.4205 3.49454 10.3891 2.52079C9.35764 1.54705 7.95869 1 6.5 1C5.04131 1 3.64236 1.54705 2.61091 2.52079C1.57946 3.49454 1 4.81522 1 6.19231C1 8.5 3.44444 11.9615 6.5 16Z" fill="#3D5A80" stroke="#3D5A80"/>
                  <path d="M8.94443 6.19246C8.94443 6.8045 8.68689 7.39147 8.22847 7.82424C7.77005 8.25702 7.14829 8.50015 6.49999 8.50015C5.85168 8.50015 5.22993 8.25702 4.7715 7.82424C4.31308 7.39147 4.05554 6.8045 4.05554 6.19246C4.05554 5.58042 4.31308 4.99345 4.7715 4.56067C5.22993 4.1279 5.85168 3.88477 6.49999 3.88477C7.14829 3.88477 7.77005 4.1279 8.22847 4.56067C8.68689 4.99345 8.94443 5.58042 8.94443 6.19246Z" fill="white" stroke="#3D5A80"/>
                </svg>
              </div>
              <div className="grow shrink basis-0 text-[#3d5a80] text-xs font-normal font-['Inter'] tracking-wide">{clinics}</div>
            </div>
          </div>
        </div>
      </div>
      <button className="p-2 pl-3 pr-3 bg-[#ee6c4d] rounded-[10px] border border-[#ee6c4d] justify-center items-center gap-2.5 inline-flex sm:w-auto xs:w-full xs:max-w-sm">
        <div className="text-white text-sm font-['Inter'] tracking-wide">View profile</div>
      </button>
    </div>
  );
};

const Filters = () => {
  return (
    <div className="w-full flex items-center justify-between">
      <div className="justify-start items-center gap-[5px] inline-flex">
        <div className="h-auto text-black text-md font-medium font-['Inter'] tracking-wide sm:flex xs:hidden">Sort</div>
        <div className="p-1.5 px-3 rounded-[5px] border border-[#d9d9d9] justify-center items-center gap-1.5 flex">
          <div data-svg-wrapper className="relative">
            <svg width="14" height="15" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.998 5.82603L7.99995 10.698L3.00195 5.82603C2.91266 5.7388 2.79278 5.68996 2.66795 5.68996C2.54312 5.68996 2.42325 5.7388 2.33395 5.82603C2.29072 5.86839 2.25637 5.91896 2.23292 5.97477C2.20947 6.03057 2.19739 6.0905 2.19739 6.15103C2.19739 6.21156 2.20947 6.27149 2.23292 6.32729C2.25637 6.3831 2.29072 6.43367 2.33395 6.47603L7.65095 11.66C7.74433 11.751 7.86956 11.802 7.99995 11.802C8.13035 11.802 8.25558 11.751 8.34895 11.66L13.666 6.47703C13.7095 6.43463 13.7441 6.38394 13.7677 6.32795C13.7914 6.27196 13.8035 6.2118 13.8035 6.15103C13.8035 6.09026 13.7914 6.0301 13.7677 5.97411C13.7441 5.91812 13.7095 5.86743 13.666 5.82503C13.5767 5.7378 13.4568 5.68896 13.332 5.68896C13.2071 5.68896 13.0872 5.7378 12.998 5.82503V5.82603Z" fill="black"/>
            </svg>
          </div>
          <div className="text-black text-xs font-['Inter'] tracking-wide">By relevance</div>
        </div>
      </div>
      <div className="px-3 py-1 bg-[#293241] rounded-[5px] border border-[#293241] flex-col justify-start items-start gap-2.5 inline-flex xl:hidden">
        <div className="self-stretch justify-start items-center gap-2 inline-flex">
          <div className="text-white text-sm font-normal font-['Inter'] tracking-wide">Filters</div>
          <div data-svg-wrapper>
            <svg width="15" height="17" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.625 2.22434C5.32663 2.22434 5.04048 2.34137 4.8295 2.54969C4.61853 2.758 4.5 3.04054 4.5 3.33515C4.5 3.62975 4.61853 3.91229 4.8295 4.12061C5.04048 4.32893 5.32663 4.44596 5.625 4.44596C5.92337 4.44596 6.20952 4.32893 6.4205 4.12061C6.63147 3.91229 6.75 3.62975 6.75 3.33515C6.75 3.04054 6.63147 2.758 6.4205 2.54969C6.20952 2.34137 5.92337 2.22434 5.625 2.22434ZM2.44125 2.22434C2.67368 1.57392 3.10471 1.01071 3.67492 0.612322C4.24514 0.213937 4.92647 0 5.625 0C6.32353 0 7.00486 0.213937 7.57508 0.612322C8.14529 1.01071 8.57632 1.57392 8.80875 2.22434H16.875C17.1734 2.22434 17.4595 2.34137 17.6705 2.54969C17.8815 2.758 18 3.04054 18 3.33515C18 3.62975 17.8815 3.91229 17.6705 4.12061C17.4595 4.32893 17.1734 4.44596 16.875 4.44596H8.80875C8.57632 5.09637 8.14529 5.65959 7.57508 6.05797C7.00486 6.45636 6.32353 6.6703 5.625 6.6703C4.92647 6.6703 4.24514 6.45636 3.67492 6.05797C3.10471 5.65959 2.67368 5.09637 2.44125 4.44596H1.125C0.826631 4.44596 0.540484 4.32893 0.329505 4.12061C0.118527 3.91229 0 3.62975 0 3.33515C0 3.04054 0.118527 2.758 0.329505 2.54969C0.540484 2.34137 0.826631 2.22434 1.125 2.22434H2.44125ZM12.375 8.88919C12.0766 8.88919 11.7905 9.00622 11.5795 9.21454C11.3685 9.42286 11.25 9.7054 11.25 10C11.25 10.2946 11.3685 10.5771 11.5795 10.7855C11.7905 10.9938 12.0766 11.1108 12.375 11.1108C12.6734 11.1108 12.9595 10.9938 13.1705 10.7855C13.3815 10.5771 13.5 10.2946 13.5 10C13.5 9.7054 13.3815 9.42286 13.1705 9.21454C12.9595 9.00622 12.6734 8.88919 12.375 8.88919ZM9.19125 8.88919C9.42368 8.23878 9.85471 7.67556 10.4249 7.27717C10.9951 6.87879 11.6765 6.66485 12.375 6.66485C13.0735 6.66485 13.7549 6.87879 14.3251 7.27717C14.8953 7.67556 15.3263 8.23878 15.5588 8.88919H16.875C17.1734 8.88919 17.4595 9.00622 17.6705 9.21454C17.8815 9.42286 18 9.7054 18 10C18 10.2946 17.8815 10.5771 17.6705 10.7855C17.4595 10.9938 17.1734 11.1108 16.875 11.1108H15.5588C15.3263 11.7612 14.8953 12.3244 14.3251 12.7228C13.7549 13.1212 13.0735 13.3351 12.375 13.3351C11.6765 13.3351 10.9951 13.1212 10.4249 12.7228C9.85471 12.3244 9.42368 11.7612 9.19125 11.1108H1.125C0.826631 11.1108 0.540484 10.9938 0.329505 10.7855C0.118527 10.5771 0 10.2946 0 10C0 9.7054 0.118527 9.42286 0.329505 9.21454C0.540484 9.00622 0.826631 8.88919 1.125 8.88919H9.19125ZM5.625 15.554C5.32663 15.554 5.04048 15.6711 4.8295 15.8794C4.61853 16.0877 4.5 16.3702 4.5 16.6649C4.5 16.9595 4.61853 17.242 4.8295 17.4503C5.04048 17.6586 5.32663 17.7757 5.625 17.7757C5.92337 17.7757 6.20952 17.6586 6.4205 17.4503C6.63147 17.242 6.75 16.9595 6.75 16.6649C6.75 16.3702 6.63147 16.0877 6.4205 15.8794C6.20952 15.6711 5.92337 15.554 5.625 15.554ZM2.44125 15.554C2.67368 14.9036 3.10471 14.3404 3.67492 13.942C4.24514 13.5436 4.92647 13.3297 5.625 13.3297C6.32353 13.3297 7.00486 13.5436 7.57508 13.942C8.14529 14.3404 8.57632 14.9036 8.80875 15.554H16.875C17.1734 15.554 17.4595 15.6711 17.6705 15.8794C17.8815 16.0877 18 16.3702 18 16.6649C18 16.9595 17.8815 17.242 17.6705 17.4503C17.4595 17.6586 17.1734 17.7757 16.875 17.7757H8.80875C8.57632 18.4261 8.14529 18.9893 7.57508 19.3877C7.00486 19.7861 6.32353 20 5.625 20C4.92647 20 4.24514 19.7861 3.67492 19.3877C3.10471 18.9893 2.67368 18.4261 2.44125 17.7757H1.125C0.826631 17.7757 0.540484 17.6586 0.329505 17.4503C0.118527 17.242 0 16.9595 0 16.6649C0 16.3702 0.118527 16.0877 0.329505 15.8794C0.540484 15.6711 0.826631 15.554 1.125 15.554H2.44125Z" fill="white"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function DoctorsResults({ specialty, location, ensurance, sex, takes_dates }) {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
          page: currentPage,
        });
        const response = await publicApiClient.get(`/doctors/search/?${params.toString()}`);
        const data = response.data;
        setDoctors(data.results);
        setTotalPages(Math.ceil(data.count / 10));
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [specialty, location, ensurance, sex, takes_dates, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex-col justify-start items-center gap-4 inline-flex w-full xl:max-w-2xl lg:max-w-3xl md:max-w-2xl sm:max-w-xl">
      <Filters />
      {loading ? (
        <p>Loading doctors...</p>
      ) : doctors.length > 0 ? (
        doctors.map((doctor) => <Doctor key={doctor.id} doctor={doctor} />)
      ) : (
        <p>No doctors found.</p>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}