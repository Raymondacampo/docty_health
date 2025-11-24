"use client";

import React, { useState, useEffect, use } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SearchHead from "./components/Head";
import SearchFilters from "./components/Filters";
import DoctorsResults from "./components/Results";
import SearchAdds from "./components/Ads";
import Loading from "../components/LoadingComponent";

interface TempFilters {
  specialty: string;
  ensurance: string;
  location: string;
  sex: string;
  takesDates: boolean;
  appointmentType?: string | null;
  experienceValue: string;
}

export default function Search() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const searchParams = useSearchParams();
  const [specialty, setSpecialty] = useState<string>("");
  const [ensurance, setEnsurance] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [sex, setSex] = useState<string>("both");
  const [takesDates, setTakesDates] = useState<boolean>(false);
  const [appointmentType, setAppointmentType] = useState<string | null>(null);
  const [experienceValue, setExperienceValue] = useState<string>("any");
  const [tempFilters, setTempFilters] = useState<TempFilters>({
    specialty: "",
    ensurance: "",
    location: "",
    sex: "both",
    takesDates: false,
    appointmentType: null,
    experienceValue: "any",
  });
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  const [isXsScreen, setIsXsScreen] = useState<boolean>(false);

  useEffect(() => {
    const newSpecialty = searchParams.get("specialty") || "";
    const newLocation = searchParams.get("location") || "";
    const newEnsurance = searchParams.get("ensurance") || "";
    setEnsurance(newEnsurance);
    setSpecialty(newSpecialty);
    setLocation(newLocation);
    setTempFilters((prev) => ({
      ...prev,
      specialty: newSpecialty,
      location: newLocation,
      ensurance: newEnsurance,
    }));
  }, [searchParams]);

  useEffect(() => {
    const handleResize = () => {
      const isXs = window.innerWidth < 640; // Match Tailwind xs breakpoint
      setIsXsScreen(isXs);
      setShowFilters(window.innerWidth >= 1280); // Show filters on xl or larger
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isXsScreen && (specialty || location)) {
      const params: Record<string, string> = {};
      if (specialty) params.specialty = specialty;
      if (ensurance) params.ensurance = ensurance;
      if (location) params.location = location;
      if (sex && sex !== "both") params.sex = sex;
      if (takesDates) params.takes_dates = String(takesDates);
      if (appointmentType) params.appointment_type = appointmentType;
      if (experienceValue && experienceValue !== "any")
        params.experienceValue = experienceValue;
      const query = new URLSearchParams(params);
      router.push(`?${query.toString()}`, { scroll: false });
    }
  }, [specialty, ensurance, location, sex, takesDates, appointmentType, experienceValue, isXsScreen, router]);

  useEffect(() => {
    setLoading(false);
  }, [searchParams]);

  const applyFilters = () => {
    console.log("Applying filters:", tempFilters);
    setSpecialty(tempFilters.specialty);
    setEnsurance(tempFilters.ensurance);
    setLocation(tempFilters.location);
    setSex(tempFilters.sex);
    setTakesDates(tempFilters.takesDates);
    setExperienceValue(tempFilters.experienceValue);
    setShowFilters(false); // Close filters on xs after applying
  };

  const updateTempFilters = (newFilters: Partial<TempFilters>) => {
    setTempFilters((prev) => ({ ...prev, ...newFilters }));
  };

  if (loading) {
    return <Loading text="Searching for doctors..." />;
  }

  return (
    <div className="w-full mt-[12dvh] sm:mt-[10dvh] flex flex-col mb-16">
      <SearchHead
        specialty={specialty}
        location={location}
        ensurance={ensurance}
        sex={sex}
        count={count}
      />
      <div className="w-full relative justify-center items-start inline-flex xl:pl-0 lg:pl-8">
        {showFilters && (
          <SearchFilters
            specialty={isXsScreen ? tempFilters.specialty : specialty}
            onSpecialty={(value: string) =>
              isXsScreen
                ? updateTempFilters({ specialty: value })
                : setSpecialty(value)
            }
            location={isXsScreen ? tempFilters.location : location}
            onLocation={(value: string) =>
              isXsScreen
                ? updateTempFilters({ location: value })
                : setLocation(value)
            }
            ensurance={isXsScreen ? tempFilters.ensurance : ensurance}
            onEnsurance={(value: string) =>
              isXsScreen
                ? updateTempFilters({ ensurance: value })
                : setEnsurance(value)
            }
            sex={isXsScreen ? tempFilters.sex : sex}
            onSex={(value: string) =>
              isXsScreen ? updateTempFilters({ sex: value }) : setSex(value)
            }
            takes_appointments={isXsScreen ? tempFilters.takesDates : takesDates}
            onTake={(value: boolean) =>
              isXsScreen
                ? updateTempFilters({ takesDates: value })
                : setTakesDates(value)
            }
            appointmentType={isXsScreen ? tempFilters.appointmentType : appointmentType}
            onAppointment={(value: string) =>
              isXsScreen
                ? updateTempFilters({ appointmentType: value })
                : setAppointmentType(value)
            }
            experienceValue={
              isXsScreen ? tempFilters.experienceValue : experienceValue
            }
            setExperienceValue={(value: string) =>
              isXsScreen
                ? updateTempFilters({ experienceValue: value })
                : setExperienceValue(value)
            }
            onClose={() => setShowFilters(false)}
            onApply={isXsScreen ? applyFilters : undefined}
            isXsScreen={isXsScreen}
          />
        )}
        <div className="flex max-w-[1400px] justify-between w-full">
          <DoctorsResults
            specialty={specialty}
            location={location}
            ensurance={ensurance}
            sex={sex}
            takes_dates={takesDates}
            appointmentType={appointmentType}
            experienceValue={experienceValue}
            onFiltersToggle={() => setShowFilters(true)}
            onCountChange={setCount}
          />
          <SearchAdds />
        </div>
      </div>
    </div>
  );
}