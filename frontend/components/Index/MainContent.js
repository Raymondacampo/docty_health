import Why_Docify from "./components/Index_section_one";
import About_us from "./components/Index_section_two";
import Opinions from "./components/Index_section_three";
import SearchBar from "./components/SearchBar";
import JoinUs from "./components/IndexSectionFour";

export default function MainContent() {
    return (
        <>
            <SearchBar />
            <Why_Docify />
            <About_us />
            <Opinions />
            <JoinUs />
        </>
    )
}