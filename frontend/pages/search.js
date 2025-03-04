import SearchHead from "@/components/search/SearchSectionOne";
import SearchFilters from "@/components/search/SearchFilters";
import DoctorsResults from "@/components/search/DoctorsResults";
import SearchAdds from "@/components/search/SearchAdds";
export default function Search() {
    return (
        <div class="w-full flex flex-col">
            <SearchHead/>
            <div class="w-full justify-center items-start gap-14 inline-flex
            sm:p-4
            xs:p-2">
                <SearchFilters/>
                <DoctorsResults/>
                <SearchAdds/>
            </div>
        </div>
    );
  }