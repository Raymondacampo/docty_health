import { useState, useEffect, useRef } from "react";
import { getApiImgUrl } from "@/utils/api";
import AverageRatingStars from "./components/AverageRatingStar";
import FavoriteButton from "./components/FavouriteButton";
import AppointmentModal from "./components/AppointmentModal";
import { UserCircleIcon } from "@heroicons/react/24/solid";

export default function About({ 
  doctor, 
  averageRating, 
  reviewCount, 
  activeSection, 
  setActiveSection, 
  scrollToSection, 
  aboutRef, 
  insurancesRef, 
  locationsRef, 
  reviewsRef 
}) {
  const backendBaseUrl = getApiImgUrl();
  const menuRef = useRef(null);
  const [isMenuFixed, setIsMenuFixed] = useState(false);
  const menuOriginalTop = useRef(null);

  // Set original menu position on mount
  useEffect(() => {
    if (menuRef.current) {
      menuOriginalTop.current = menuRef.current.getBoundingClientRect().top + window.scrollY;
    }
  }, [doctor]);

  // Handle scroll to fix/unfix menu
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY;

      if (menuOriginalTop.current !== null) {
        const atOriginalPosition = currentScrollY <= menuOriginalTop.current;

        if (isScrollingDown) {
          setIsMenuFixed(currentScrollY >= menuOriginalTop.current);
        } else {
          setIsMenuFixed(!atOriginalPosition);
        }
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-full flex-col justify-start items-center gap-[52px] flex ">
      <div className="w-full flex justify-between 
        lg:flex-nowrap md:flex-row
        md:flex-wrap sm:gap-4
        xs:flex-col xs:gap-6">
        <div className="gap-4 flex
          sm:flex-row sm:w-auto sm:min-w-[450px]
          xs:flex-col xs:w-full xs:items-center">
          {doctor.user.profile_picture ? (
            <img 
              src={`${backendBaseUrl}${doctor.user.profile_picture}`} 
              className="min-w-[150px] min-h-[150px] max-w-[150px] max-h-[150px] bg-[#d9d9d9] rounded-full"
              alt="Doctor profile"
            />            
          ) : (
            <UserCircleIcon className="w-[150px] h-[150px] text-gray-400 rounded-full object-cover object-center"/>
          )}

          <div className="flex-col justify-start items-start gap-4 inline-flex">
            <div className="w-full flex-col justify-start items-start flex xs:justify-center">
              <div className="w-full pt-1.5 gap-2.5 inline-flex sm:justify-start xs:justify-center">
                <div className="text-[#293241] font-['Inter'] tracking-wide text-2xl text-center">
                  Dr. {doctor.user.first_name} {doctor.user.last_name}
                </div>
              </div>
              <div className="w-full items-center gap-2.5 inline-flex sm:justify-start xs:justify-center">
                {doctor.specialties.map((s, index) => (
                  <div key={index} className="text-[#293241] font-['Inter'] tracking-wide text-sm">
                    {s.name}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-4 items-center justify-center flex-wrap">
              <div className="flex gap-2 items-center justify-center sm:w-auto xs:w-full">
                <AverageRatingStars averageRating={averageRating} />
                <div className="text-[#293241] font-['Inter'] tracking-wide text-xs">
                  ( {reviewCount} reviews )
                </div>
              </div>
              <FavoriteButton doctorId={doctor.id} isFavoritedInitially={doctor.is_favorited} />
            </div>
          </div>
        </div>
        <div className="justify-center items-center gap-[74px] flex lg:w-auto xs:w-full">
          <div className="w-full py-5 bg-[#3d5a80] rounded-[10px] flex-col justify-center items-start gap-4 inline-flex text-wrap break-all sm:px-8 xs:px-4">
            {/* <div className="justify-start items-center gap-2.5 inline-flex">
              <div className="text-white text-xl font-['Inter'] tracking-wide">Contact info</div>
            </div> */}
            <div className="w-full justify-start items-center gap-2.5 inline-flex">
              <div data-svg-wrapper>
                <svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 16.5C1.45 16.5 0.979333 16.3043 0.588 15.913C0.196667 15.5217 0.000666667 15.0507 0 14.5V2.5C0 1.95 0.196 1.47933 0.588 1.088C0.98 0.696666 1.45067 0.500667 2 0.5H18C18.55 0.5 19.021 0.696 19.413 1.088C19.805 1.48 20.0007 1.95067 20 2.5V14.5C20 15.05 19.8043 15.521 19.413 15.913C19.0217 16.305 18.5507 16.5007 18 16.5H2ZM18 4.5L10.525 9.175C10.4417 9.225 10.3543 9.26267 10.263 9.288C10.1717 9.31333 10.084 9.32567 10 9.325C9.916 9.32433 9.82867 9.312 9.738 9.288C9.64733 9.264 9.55967 9.22633 9.475 9.175L2 4.5V14.5H18V4.5ZM10 7.5L18 2.5H2L10 7.5ZM2 4.75V3.275V3.3V3.288V4.75Z" fill="white"/>
                </svg>
              </div>
              <div className="text-white font-['Inter'] tracking-wide font-bold text-sm">
                {doctor.user.email}
              </div>
            </div>
            {doctor.cities.map((c, index) => (
              <div key={index} className="flex gap-2 items-center">
                <div data-svg-wrapper className="relative">
                  <svg width="12" height="16" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 18.5C11.8889 13.6538 15 9.5 15 6.73077C15 5.07827 14.2625 3.49345 12.9497 2.32495C11.637 1.15645 9.85652 0.5 8 0.5C6.14348 0.5 4.36301 1.15645 3.05025 2.32495C1.7375 3.49345 1 5.07827 1 6.73077C1 9.5 4.11111 13.6538 8 18.5Z" fill="white" stroke="white"/>
                    <path d="M11.1109 6.73114C11.1109 7.46559 10.7831 8.16995 10.1997 8.68929C9.61622 9.20862 8.8249 9.50037 7.99978 9.50037C7.17466 9.50037 6.38334 9.20862 5.79989 8.68929C5.21645 8.16995 4.88867 7.46559 4.88867 6.73114C4.88867 5.9967 5.21645 5.29233 5.79989 4.773C6.38334 4.25367 7.17466 3.96191 7.99978 3.96191C8.8249 3.96191 9.61622 4.25367 10.1997 4.773C10.7831 5.29233 11.1109 5.9967 11.1109 6.73114Z" fill="#3D5A80" stroke="#3D5A80"/>
                  </svg>
                </div>
                <div className="text-white font-['Inter'] tracking-wide text-wrap text-sm">
                  {c}
                </div>
              </div>
            ))}
            <AppointmentModal doctor={doctor} />
          </div>
        </div>
      </div>
      <div className="w-full py-2.5 pr-2.5 justify-center items-start gap-2.5 inline-flex flex-col">
        {/* Menu inserted here */}
        <div
          ref={menuRef}
          className={`w-full bg-white z-10 overflow-x-auto ${isMenuFixed ? "fixed md:px-10 top-0 left-0 right-0 shadow-md" : "relative"} max-w-6xl mx-auto md:pr-10 xs:px-2 py-4`}
        >
          <div className="flex justify-start gap-4 font-['Inter'] text-[#293241]">
            <button
              onClick={() => scrollToSection(aboutRef, "about")}
              className={`px-4 py-2 ${activeSection === "about" ? "border-b-2 border-[#293241]" : ""}`}
            >
              About
            </button>
            <button
              onClick={() => scrollToSection(insurancesRef, "insurances")}
              className={`px-4 py-2 ${activeSection === "insurances" ? "border-b-2 border-[#293241]" : ""}`}
            >
              Insurances
            </button>
            <button
              onClick={() => scrollToSection(locationsRef, "locations")}
              className={`px-4 py-2 ${activeSection === "locations" ? "border-b-2 border-[#293241]" : ""}`}
            >
              Locations
            </button>
            <button
              onClick={() => scrollToSection(reviewsRef, "reviews")}
              className={`px-4 py-2 ${activeSection === "reviews" ? "border-b-2 border-[#293241]" : ""}`}
            >
              Reviews
            </button>
          </div>
        </div>
        {isMenuFixed && <div className="h-[72px]"></div>}
        <div className="text-black font-bold text-lg">{doctor.experience} years of experience</div>
        <div className="grow shrink basis-0 text-[#293241] font-normal font-['Inter'] tracking-wide text-base">
          {doctor.description}
        </div>
      </div>
    </div>
  );
}