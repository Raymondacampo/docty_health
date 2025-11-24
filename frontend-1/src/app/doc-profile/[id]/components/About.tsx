
import { useState, useEffect, useRef } from "react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import FavoriteButton from "../../ui/FavoriteButton";
import AverageRatingStars from "../../ui/AverageRatingStar";
import AppointmentModal from "../../ui/AppointmentModal";
import Image from "next/image";
import type { DoctorPageProps } from "../page"; 

interface AboutProps {
  doctor: DoctorPageProps;
  averageRating: number;
  reviewCount: number;
  isUserAuthenticated: boolean | null;
}

export default function About({ 
  doctor, 
  averageRating, 
  reviewCount, 
  isUserAuthenticated
}: AboutProps) {
  const menuRef = useRef(null);
  const [isMenuFixed, setIsMenuFixed] = useState(false);
  const menuOriginalTop = useRef(null);

  // Set original menu position on mount
  // useEffect(() => {
  //   if (menuRef.current) {
  //     menuOriginalTop.current = menuRef.current.getBoundingClientRect().top + window.scrollY;
  //   }
  // }, [doctor]);

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
    console.log(isUserAuthenticated)
  }, []);

  return (
    <div className="w-full justify-between items-center mx-auto gap-[52px] flex ">
      <div className="w-full flex justify-center items-center
        lg:flex-nowrap md:flex-row lg:justify-between
        md:flex-wrap sm:gap-4
        flex-col gap-2 lg:gap-6">
          <div className="gap-8 flex
            sm:flex-row sm:w-auto 
            flex-col w-full justify-center items-center">
            {doctor.user.profile_picture ? (
              <Image
                src={doctor.user.profile_picture}
                width={150}
                height={150}
                className="w-[200px] h-[200px] md:w-[250px] md:h-[250px] bg-[#d9d9d9] rounded-full object-cover object-center"
                alt="Doctor profile"
              />        
            ) : (
              <UserCircleIcon className="w-[150px] h-[150px] text-gray-400 rounded-full object-cover object-center"/>
            )}

            <div className="flex-col justify-center items-center gap-4 inline-flex
            lg:justify-start lg:items-start">
              <div className="w-full flex-col lg:justify-start lg:items-start flex items-center justify-center">
                <h1 className="text-[#293241] tracking-wide font-semibold text-2xl lg:text-3xl">
                  Dr. {doctor.user.first_name} {doctor.user.last_name}
                </h1>
                <div className="w-full items-center gap-2.5 inline-flex sm:justify-start justify-center">
                  {doctor.specialties.map((s: any, index: number) => (
                    <div key={index} className="text-[#293241]/80 tracking-wide text-sm lg:text-base">
                      {s.name}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-3 mb-4 items-center justify-center sm:w-auto w-full">
                  <AverageRatingStars averageRating={averageRating} />
                  <p className="text-[#293241] tracking-wide text-xs">
                    ( {reviewCount} reviews )
                  </p>
                </div>
                {isUserAuthenticated !== null && (
                  <FavoriteButton doctorId={doctor.id} isUserAuthenticated={isUserAuthenticated} />
                )}
              </div>
            </div>
          </div>
          <div className="w-full lg:w-[20rem] lg:relative -top-8">
            <AppointmentModal doctor={doctor} />
          </div>
      </div>       
    </div>
  );
}