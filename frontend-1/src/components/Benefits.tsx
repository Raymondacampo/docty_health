import booking from "@/assets/images/booking.png";
import reviews from "@/assets/images/reviews.png";
import favorites from "@/assets/images/favorites.png";
import Image from "next/image";
export default function Benefits() {
    const Block = ({imageSrc, text}: {imageSrc: string, text: string}) => {
        return (
            <div className="flex flex-col items-center">
                <div className="w-[12rem] h-[12rem] sm:w-[10rem] sm:h-[10rem] relative lg:w-[16rem] lg:h-[16rem]">
                    <Image src={imageSrc} alt={text} fill className="object-contain h-full w-full" />
                </div>
                <h2 className="sm:text-2xl text-xl sm:w-[300px] relative -top-2 px-8 text-black sm:font-semibold text-center sm:top-0">{text}</h2>
            </div>
        );
    }
    return (
        <div className="w-full py-4 gap-y-4 flex items-center justify-center flex-col 
        sm:h-[60dvh] sm:flex-row lg:gap-12 sm:flex-wrap">
            <Block imageSrc={booking.src} text="Sistema de reservas fácil de utilizar" />
            <Block imageSrc={favorites.src} text="Añade tus doctores a favoritos" />
            <Block imageSrc={reviews.src} text="Lee las opiniones de otros usuarios" />
        </div>
    );    
}

 