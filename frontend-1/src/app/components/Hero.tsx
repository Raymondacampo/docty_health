'use client';
import Image from "next/image";
import doctors_bg from "@/assets/images/doctors_bg.png";
import SearchBar from "./SearchBar";
import QuickLink from "./QuickLink";
import { HeartIcon } from "lucide-react";
import { PuzzlePieceIcon } from "@heroicons/react/24/outline";
import { CloudIcon } from "@heroicons/react/24/outline";
import { UserGroupIcon } from "@heroicons/react/24/outline";

export default function Hero() {
  const links = [
    { title: "Cardiología", specialty: "Especialistas en salud del corazón", icon: <HeartIcon className="w-8 h-8" /> },
    { title: "Neurología", specialty: "Expertos en el sistema nervioso", icon: <PuzzlePieceIcon className="w-8 h-8" /> },
    { title: "Pediatría", specialty: "Cuidado integral para niños", icon: <UserGroupIcon className="w-8 h-8" /> },
    { title: "Dermatología", specialty: "Tratamiento de enfermedades de la piel", icon: <CloudIcon className="w-8 h-8" /> },
  ];
  return (
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

        <SearchBar />
        <div className="max-w-4xl lg:max-w-7xl w-full mx-auto py-8 relative z-10">
          <h2 className="text-2xl sm:text-3xl text-black max-w-xl font-semibold pl-2 mb-4">Especialidades más buscadas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
            {links.map((link) => (
              <QuickLink key={link.title} title={link.title} specialty={link.specialty} icon={link.icon} />
            ))}              
          </div>
        </div>

    </div>
  );
}
