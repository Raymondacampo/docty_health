import SearchHead from "@/components/search/SearchSectionOne";
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

    // Function to fetch doctor results (to be implemented with DoctorsResults)
    const fetchDoctors = () => {
        const query = { specialty, ensurance, location, sex, takes_dates: takesDates };
        console.log("Fetching doctors with:", query);
        // API call to /api/doctors/search/ will go here
    };

    useEffect(() => {
        fetchDoctors();
    }, [specialty, ensurance, location, sex, takesDates]);

    return (
        <div class="w-full flex flex-col">
            <SearchHead/>
            <div class="w-full justify-center items-start gap-14 inline-flex
            sm:p-4
            xs:p-2">
                <SearchFilters specialty={specialty} onSpecialty={setSpecialty} location={location} onLocation={setLocation} 
                ensurance={ensurance} onEnsurance={setEnsurance} sex={sex} onSex={setSex} takes_dates={takesDates} onTake={setTakesDates}/>
                <DoctorsResults
                    specialty={specialty}
                    location={location}
                    ensurance={ensurance}
                    sex={sex}
                    takes_dates={takesDates}
                />
                <SearchAdds/>
            </div>
        </div>
    );
  }