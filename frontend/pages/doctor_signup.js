import DoctorSignupForm from "@/components/forms/DoctorSignupForm"
import DoctorBenefits from "@/components/forms/DoctorBenefits"

export default function DoctorSignup() {
    return(
        <div className="w-full flex-col justify-center items-center gap-16 inline-flex
        md:pt-9
        sm:px-2 
        xs:px-0 xs:pb-9">
            <div class="pt-8 pb-12 bg-[#98c1d1]/20 rounded-[15px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] items-center inline-flex 
            lg:justify-start
            md:justify-between md:gap-16 md:flex-row md:w-auto
            sm:px-8 sm:w-[95%] 
            xs:flex-col xs:gap-8 xs:w-full xs:px-2">
                <DoctorSignupForm/>
                <DoctorBenefits/>
            </div>
            </div>
    )
}