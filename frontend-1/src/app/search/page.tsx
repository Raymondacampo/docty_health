"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SearchHead from "./components/Head";
import SearchFilters from "./components/Filters";
import DoctorsResults from "./components/Results";
import SearchAdds from "./components/Ads";

interface TempFilters {
  specialty: string;
  ensurance: string;
  location: string;
  sex: string;
  takesDates: string;
  experienceValue: string;
}

export default function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [specialty, setSpecialty] = useState<string>("");
  const [ensurance, setEnsurance] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [sex, setSex] = useState<string>("both");
  const [takesDates, setTakesDates] = useState<string>("any");
  const [experienceValue, setExperienceValue] = useState<string>("any");
  const [tempFilters, setTempFilters] = useState<TempFilters>({
    specialty: "",
    ensurance: "",
    location: "",
    sex: "both",
    takesDates: "any",
    experienceValue: "any",
  });
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  const [isXsScreen, setIsXsScreen] = useState<boolean>(false);

  useEffect(() => {
    const newSpecialty = searchParams.get("specialty") || "";
    const newLocation = searchParams.get("location") || "";
    setSpecialty(newSpecialty);
    setLocation(newLocation);
    setTempFilters((prev) => ({
      ...prev,
      specialty: newSpecialty,
      location: newLocation,
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
      const query = new URLSearchParams({
        ...(specialty && { specialty }),
        ...(ensurance && { ensurance }),
        ...(location && { location }),
        ...(sex && sex !== "both" && { sex }),
        ...(takesDates && takesDates !== "any" && { takes_dates: takesDates }),
        ...(experienceValue && experienceValue !== "any" && { experienceValue }),
      });
      router.push(`?${query.toString()}`, { scroll: false });
    }
  }, [specialty, ensurance, location, sex, takesDates, experienceValue, isXsScreen, router]);

  const applyFilters = () => {
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

  return (
    <div className="w-full mt-[10dvh] flex flex-col mb-16">
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
            takes_dates={isXsScreen ? tempFilters.takesDates : takesDates}
            onTake={(value: string) =>
              isXsScreen
                ? updateTempFilters({ takesDates: value })
                : setTakesDates(value)
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
        <div className="flex max-w-[1400px] ml-auto w-full">
          <DoctorsResults
            specialty={specialty}
            location={location}
            ensurance={ensurance}
            sex={sex}
            takes_dates={takesDates}
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