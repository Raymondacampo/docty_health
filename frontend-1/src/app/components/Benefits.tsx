import booking from "@/assets/images/booking.png";
import Image from "next/image";
export default function Benefits() {
    const Block = ({imageSrc, text}: {imageSrc: string, text: string}) => {
        return (
            <div className="flex flex-col  items-center">
                <div className="w-[20rem] h-[20rem] relative">
                    <Image src={booking.src} alt="Booking" fill className="object-contain" />
                </div>
                <h3 className="text-lg text-black font-semibold text-center">Reserva tu cita</h3>
            </div>
        );
    }
    return (
        <div className="w-full h-[50dvh] flex items-center justify-center">
            <Block imageSrc={booking.src} text="Reserva tu cita" />
            <Block imageSrc={booking.src} text="Reserva tu cita" />
            <Block imageSrc={booking.src} text="Reserva tu cita" />
        </div>
    );    
}

 