import SearchHead from "@/components/search/SearchHead";
import SearchFilters from "@/components/search/SearchFilters";
import DoctorsResults from "@/components/search/DoctorsResults";
import SearchAdds from "@/components/search/SearchAdds";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Search() {
  const router = useRouter();
  const { specialty: initialSpecialty, location: initialLocation } = router.query;
  const [specialty, setSpecialty] = useState(initialSpecialty || "");
  const [ensurance, setEnsurance] = useState("");
  const [location, setLocation] = useState(initialLocation || "");
  const [sex, setSex] = useState("both");
  const [takesDates, setTakesDates] = useState("any");
  const [experienceValue, setExperienceValue] = useState("any");
  const [showFilters, setShowFilters] = useState(false);
  const [count, setCount] = useState(0);

  // Sync state with router.query when it changes
  useEffect(() => {
    if (router.isReady) { // Ensure router.query is populated
      setSpecialty(router.query.specialty || "");
      setLocation(router.query.location || "");
    }
  }, [router.isReady, router.query.specialty, router.query.location]);

  useEffect(() => {
    // Function to check screen width
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setShowFilters(true);
      } else {
        setShowFilters(false);
      }
    };
  
    handleResize(); // Initial check on load
  
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch doctors when filters change
  const fetchDoctors = () => {
    const query = { specialty, ensurance, location, sex, takes_dates: takesDates };
    // API call to /api/doctors/search/ will go here
  };

  useEffect(() => {
    if (specialty) {
        fetchDoctors();
    }
  }, [specialty, ensurance, location, sex, takesDates, experienceValue]);

  return (
    <div className="w-full flex flex-col">
      <SearchHead specialty={specialty} location={location} ensurance={ensurance} sex={sex} count={count}/>
      <div className="w-full justify-center items-start gap-14 inline-flex xl:p-4 lg:pl-8 sm:p-4 xs:p-2">
      {showFilters && (
        <SearchFilters
          specialty={specialty}
          onSpecialty={setSpecialty}
          location={location}
          onLocation={setLocation}
          ensurance={ensurance}
          onEnsurance={setEnsurance}
          sex={sex}
          onSex={setSex}
          takes_dates={takesDates}
          onTake={setTakesDates}
          experienceValue={experienceValue}
          setExperienceValue={setExperienceValue}
          onExperienceChangeComplete={(finalValue) => {setExperienceMin(finalValue)}} // sets actual filter value}}
          onClose={() => setShowFilters(false)}  
        />
        
      )}
        <DoctorsResults
          specialty={specialty}
          location={location}
          ensurance={ensurance}
          sex={sex}
          takes_dates={takesDates}
          experienceValue={experienceValue}
          onFiltersToggle={() => setShowFilters(true)}
          onCountChange={setCount} // Pass the count to the parent component
        />
        <SearchAdds />
      </div>
    </div>
  );
}