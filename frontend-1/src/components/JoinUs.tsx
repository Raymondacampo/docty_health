import Image from "next/image";
import doctors from "@/assets/images/doctors.png";
import Link from "next/dist/client/link";
export default function JoinUs() {
    return(
        <div className="w-full flex flex-col items-center justify-center py-20 gap-8 px-4
        md:flex-row md:py-24">
            <div className="w-full max-w-xl md:w-[35rem]">
              <Image 
                src={doctors} 
                alt="Doctors" 
                width={500} 
                height={500} 
                className="w-full object-contain rounded-md shadow-xl"
                />  
            </div>
            
            <div className="flex flex-col items-center text-center text-black">
                <h1 className="text-4xl font-bold">Are you a doctor?</h1>
                <p className="text-lg mt-1">Join our platform to reach more patients and grow your practice.</p>
                <Link href="/doctor-signup" className="no-underline mt-6">
                    <button className="bg-[#293241] text-2xl text-white px-6 py-2.5  rounded cursor-pointer">Join Now</button>
                </Link>
            </div>
        </div>
    );
}