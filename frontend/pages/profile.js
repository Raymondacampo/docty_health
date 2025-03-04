import About from "@/components/profile/About";
import Insurances from "@/components/profile/Insurances";
import Locations from "@/components/profile/Locations";
import Reviews from "@/components/profile/Reviews";
export default function Profile() {
    return (
        <div class="w-full py-4 flex-col justify-start items-center gap-[81px] inline-flex">
            <div className="w-full max-w-6xl border border-black/25 
            sm:px-10 sm:py-12 sm:rounded-xl
            xs:px-2 py-4 xs:rounded-none ">
                <About />
                <Insurances />
                <Locations />
                <Reviews />             
            </div>

        </div>
    );
}