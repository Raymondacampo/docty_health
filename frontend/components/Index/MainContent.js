import Why_Docify from "./components/Index_section_one";
import About_us from "./components/Index_section_two";
import Opinions from "./components/Index_section_three";
import SearchBar from "./components/SearchBar";
import JoinUs from "./components/IndexSectionFour";
import { useUser } from "@/hooks/User";
import LoadingComponent from "../LoadingComponent";

export default function MainContent() {
    const { user, loadingu } = useUser();
    if (loadingu) {
        return <div className="w-full h-screen flex items-center justify-center">
            <LoadingComponent />
        </div>;
    }
    return (
        <>
            <SearchBar />
            
            <About_us />
            
            <Opinions />
            <Why_Docify />
            <JoinUs user={user} />
        </>
    )
}