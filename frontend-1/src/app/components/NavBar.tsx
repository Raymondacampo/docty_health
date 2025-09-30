'use client';
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, ArrowBigDownDashIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import dclogo from '@/assets/images/dclogo.png';
import { isAuthenticated, logoutUser } from '../utils/auth';
import { apiClient } from "../utils/api";
import { UserIcon, Calendar, Heart, SettingsIcon, LogOut, HomeIcon } from "lucide-react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      setIsAuth(authenticated);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    console.log("isAuth changed:", isAuth);
    const fetchUserData = async () => {
      try {
        const response = await apiClient.get("/auth/me/");
        setUserData(response.data);
        console.log("User data:", response.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    if (isAuth) {
      fetchUserData();
    } 
  }, [isAuth]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setIsAuth(false);
      setIsMenuOpen(false);
      setIsDropdownOpen(false);
      router.push('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isAuth === null) {
    return null;
  }

  const navLinks = [
    { href: "/", label: "Inicio" },
  ];

  const dropdownLinks = [
    { href: "/account", label: "Account", icon:<UserIcon className="inline-block mr-2" size={20}/> },
    { href: "/appointments", label: "Appointments", icon:<Calendar className="inline-block mr-2" size={20}/> },
    { href: "/favorite", label: "Fav Doctors", icon:<Heart className="inline-block mr-2" size={20}/> },
  ];

  return (
    <nav className="h-[10vh] absolute z-50 top-0 w-full pt-5 pb-3 bg-transparent">
      <div className="w-full flex items-end justify-between px-4 sm:px-8 lg:px-16 xl:px-48">
        <Link href="/" className="flex items-end">
          <Image src={dclogo} alt="Logo" width={50} height={50} className="object-contain"/>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8 pb-2">
          {isAuth ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="transition-colors text-black px-4 py-2.5 border-1 border-black rounded-sm flex items-center cursor-pointer"
              >
                {userData?.first_name} {userData?.last_name}
                <ArrowBigDownDashIcon size={16} className="inline-block ml-1" />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 p-4 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  {dropdownLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex gap-1 items-center block px-4 py-2.5 text-lg text-black hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      {link.icon}{link.label}
                    </Link>
                  ))}
                  <div className="border-t border-gray-200 my-2"></div>
                  <Link href="/settings/personal-data" className="block w-full text-left px-4 py-2 text-black hover:bg-gray-100">
                    <SettingsIcon className="inline-block mr-2" size={20}/>Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-black hover:bg-gray-100"
                  >
                    <LogOut className="inline-block mr-2" size={20}/>Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/signup" className="transition-colors bg-white text-black font-bold px-6 py-2.5 rounded-md">Sign up</Link>
              <Link href="/login" className="transition-colors bg-[#060648] text-white px-6 py-2.5 rounded-md">Log in</Link>
            </div>
          )}
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
            <Link href="/" className="flex items-center text-black gap-2 font-bold text-2xl">
              <Image src={dclogo} alt="Logo" width={50} height={50} className="object-contain"/>
              <h1>DoctyHealth</h1>
            </Link>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 text-black hover:text-[#293241] transition-colors"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
          <div className="flex flex-col space-y-4 justify-center">
            {isAuth ? (
              <>
                  <Link 
                    href="/"
                    className="flex items-center py-2 text-2xl hover:text-[#293241] transition-colors text-black"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <HomeIcon className="inline-block mr-3" size={22}/>Home
                  </Link>
                {dropdownLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center py-2 text-2xl hover:text-[#293241] transition-colors text-black"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.icon}{link.label}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex items-center py-2 text-2xl hover:text-[#293241] transition-colors text-black text-left"
                >
                  <LogOut className="inline-block mr-3" size={22}/>Logout
                </button>
              </>
            ) : (
              <Link 
                href="/login" 
                className="py-2 bg-[#060648] text-2xl hover:text-[#293241] transition-colors text-black mr-3"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}