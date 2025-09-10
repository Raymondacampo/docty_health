'use client';
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import dclogo from '@/assets/images/dclogo.png';
import Image from "next/image";
export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="h-[10vh] absolute z-50 top-0 w-full pt-5 pb-3 bg-transparent">
      <div className="w-full flex items-end justify-between px-4 sm:px-8 lg:px-16 xl:px-48">
        <Link href="/" className="flex item-end">
          <Image src={dclogo} alt="Logo" width={50} height={50} className="object-contain"/>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8 pb-2">
          <Link href="/" className="transition-colors text-black">Inicio</Link>
          <Link href="/about" className="transition-colors text-black">Sobre Nosotros</Link>
          <Link href="/classes" className="transition-colors text-black">Clases</Link>
          <Link href="/recital" className="transition-colors text-black">Tienda</Link>
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div 
        className={`lg:hidden fixed inset-0 bg-white z-50 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex flex-col space-y-8 h-full">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex item-end">
              <p className="text-3xl sm:text-4xl tracking-wider text-black font-sloop">Belkis Sandoval</p>
            </Link>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 text-black hover:text-[#ff9eb1] transition-colors"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
          <div className="flex flex-col space-y-4 justify-center  ">
            <Link 
              href="/" 
              className="py-2 text-2xl hover:text-[#ff9eb1] transition-colors text-black"
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link 
              href="/about" 
              className="py-2 text-2xl hover:text-[#ff9eb1] transition-colors text-black"
              onClick={() => setIsMenuOpen(false)}
            >
              Sobre Nosotros
            </Link>
            <Link 
              href="/classes" 
              className="py-2 text-2xl hover:text-[#ff9eb1] transition-colors text-black"
              onClick={() => setIsMenuOpen(false)}
            >
              Clases
            </Link>
            <Link 
              href="/instructors" 
              className="py-2 text-2xl hover:text-[#ff9eb1] transition-colors text-black"
              onClick={() => setIsMenuOpen(false)}
            >
              Maestros
            </Link>
            <Link 
              href="/recital" 
              className="py-2 text-2xl hover:text-[#ff9eb1] transition-colors text-black"
              onClick={() => setIsMenuOpen(false)}
            >
              Tienda
            </Link>
            <Link 
              href="/contact" 
              className="py-2 text-2xl hover:text-[#ff9eb1] transition-colors text-black"
              onClick={() => setIsMenuOpen(false)}
            >
              Galeria
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}