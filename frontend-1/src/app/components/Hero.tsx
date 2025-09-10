import Image from "next/image";
import doctors_bg from "@/assets/images/doctors_bg.png";

export default function Hero() {
  return (
    <div className="absolute inset-0 z-0 h-[80dvh]">
        <Image
          src={doctors_bg.src}
          alt="Background"
          layout="fill"
          objectFit="cover"
          quality={100}
          objectPosition="25% 40%"
        />
    </div>
  );
}
