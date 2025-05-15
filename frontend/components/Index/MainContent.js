import Why_Docify from "./components/Index_section_one";
import About_us from "./components/Index_section_two";
import Opinions from "./components/Index_section_three";
import SearchBar from "./components/SearchBar";
import JoinUs from "./components/IndexSectionFour";

export default function MainContent() {
    return (
        <>
            <SearchBar />
            
            <About_us />
            
            <Opinions />
            <Why_Docify />
            <JoinUs />
        </>
    )
}