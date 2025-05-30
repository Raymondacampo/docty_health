import SearchHead from "@/components/search/SearchHead";
import SearchFilters from "@/components/search/SearchFilters";
import DoctorsResults from "@/components/search/DoctorsResults";
import SearchAdds from "@/components/search/SearchAdds";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Search() {
  const router = useRouter();
  const [specialty, setSpecialty] = useState("");
  const [ensurance, setEnsurance] = useState("");
  const [location, setLocation] = useState("");
  const [sex, setSex] = useState("both");
  const [takesDates, setTakesDates] = useState("any");
  const [experienceValue, setExperienceValue] = useState("any");
  const [tempFilters, setTempFilters] = useState({
    specialty: "",
    ensurance: "",
    location: "",
    sex: "both",
    takesDates: "any",
    experienceValue: "any",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [count, setCount] = useState(0);
  const [isXsScreen, setIsXsScreen] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      const newSpecialty = router.query.specialty || "";
      const newLocation = router.query.location || "";
      setSpecialty(newSpecialty);
      setLocation(newLocation);
      setTempFilters((prev) => ({
        ...prev,
        specialty: newSpecialty,
        location: newLocation,
      }));
    }
  }, [router.isReady, router.query.specialty, router.query.location]);

  useEffect(() => {
    const handleResize = () => {
      const isXs = window.innerWidth < 640; // Match Tailwind xs breakpoint
      setIsXsScreen(isXs);
      setShowFilters(window.innerWidth >= 1280); // Show filters on xl or xs
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isXsScreen && (specialty || location)) {
      const query = {
        specialty,
        ensurance,
        location,
        sex,
        takes_dates: takesDates,
        experienceValue,
      };
      router.push({ query }, undefined, { shallow: true });
    }
  }, [specialty, ensurance, location, sex, takesDates, experienceValue, isXsScreen]);

  const applyFilters = () => {
    setSpecialty(tempFilters.specialty);
    setEnsurance(tempFilters.ensurance);
    setLocation(tempFilters.location);
    setSex(tempFilters.sex);
    setTakesDates(tempFilters.takesDates);
    setExperienceValue(tempFilters.experienceValue);
    setShowFilters(false); // Close filters on xs after applying
  };

  const updateTempFilters = (newFilters) => {
    setTempFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="w-full flex flex-col mb-16">
      <SearchHead
        specialty={specialty}
        location={location}
        ensurance={ensurance}
        sex={sex}
        count={count}
      />
      <div className="w-full relative justify-center items-start  inline-flex xl:pl-0 lg:pl-8">
        {showFilters && (
          <SearchFilters
            specialty={isXsScreen ? tempFilters.specialty : specialty}
            onSpecialty={(value) =>
              isXsScreen
                ? updateTempFilters({ specialty: value })
                : setSpecialty(value)
            }
            location={isXsScreen ? tempFilters.location : location}
            onLocation={(value) =>
              isXsScreen
                ? updateTempFilters({ location: value })
                : setLocation(value)
            }
            ensurance={isXsScreen ? tempFilters.ensurance : ensurance}
            onEnsurance={(value) =>
              isXsScreen
                ? updateTempFilters({ ensurance: value })
                : setEnsurance(value)
            }
            sex={isXsScreen ? tempFilters.sex : sex}
            onSex={(value) =>
              isXsScreen ? updateTempFilters({ sex: value }) : setSex(value)
            }
            takes_dates={isXsScreen ? tempFilters.takesDates : takesDates}
            onTake={(value) =>
              isXsScreen
                ? updateTempFilters({ takesDates: value })
                : setTakesDates(value)
            }
            experienceValue={
              isXsScreen ? tempFilters.experienceValue : experienceValue
            }
            setExperienceValue={(value) =>
              isXsScreen
                ? updateTempFilters({ experienceValue: value })
                : setExperienceValue(value)
            }
            onClose={() => setShowFilters(false)}
            onApply={isXsScreen ? applyFilters : null}
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