import doctors_bg from "@/assets/images/doctors_bg.png";
import Image from "next/image";
import SearchBar from "@/app/components/SearchBar";
export default function AccountPage() {
  return (
    <div className="relative flex flex-col">
        <div className="relative h-auto lg:h-[70dvh] px-2">
        <div className="absolute inset-0 z-0 opacity-30">
            <Image
            src={doctors_bg.src}
            alt="Background"
            layout="fill"
            objectFit="cover"
            quality={100}
            objectPosition="25% 25% "
            />        
        </div>
            <SearchBar small={true}/>
        </div>        
    </div>

    );
    }