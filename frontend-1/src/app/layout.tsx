'use client';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/NavBar";
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from './utils/auth';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const [isAuth, setIsAuth] = useState<boolean | null>(null);
  // const router = useRouter();

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     const authenticated = await isAuthenticated();
  //     setIsAuth(authenticated);

  //     const publicPaths = ['/login', '/signup', '/'];
  //     if (!authenticated && !publicPaths.includes(window.location.pathname)) {
  //       router.push('/login');
  //     }else(
  //       router.push(window.location.pathname)
  //     )
  //   };

  //   checkAuth();
  // }, [router]);

  // // Show loading state while checking authentication
  // if (isAuth === null) {
  //   return (
  //     <html lang="en">
  //       <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
  //         <div>Loading...</div>
  //       </body>
  //     </html>
  //   );
  // }

  return (
    <html lang="en">
      <head />
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Navbar />
        {children}

        <footer>
          <div className="w-full h-[25dvh] bg-[#293241] flex-wrap p-4 items-center gap-20 inline-flex 
          md:justify-center
          xs:justify-start xs:px-8">
            <div className="flex flex-col items-start gap-2">
              <div className="text-lg text-[#EDEDED] font-semibold border-b border-white/20">DoctyHealth © 2023 All rights reserved</div>
              <div className="flex flex-col items-start gap-2">
                <a href='service' className="text-sm text-[#EDEDED]">Terms of Service</a>
                <a href='support' className="text-sm text-[#EDEDED]">Support</a>
                <a href='about' className="text-sm text-[#EDEDED]">About Us</a>
              </div>
            </div>
            <div className="flex flex-col items-start gap-2">
              <div className="text-lg text-[#EDEDED] font-semibold border-b border-white/20">Contact us</div>
              <div className="text-sm text-[#EDEDED]">829-662-2197</div>
              <div className="text-sm text-[#EDEDED]">raymondacamposandoval@gmail.com</div>
            </div>
            <div className="flex flex-col items-start gap-2">
              <div className="text-lg text-[#EDEDED] font-semibold border-b border-white/20">Social media</div>
              <div className="flex gap-4">
                <a href='https://www.facebook.com'><FaFacebookF className="text-white bg-[#293241] p-2 rounded-full w-8 h-8" /></a>
                <a href='https://www.instagram.com'><FaInstagram className="text-white bg-[#293241] p-2 rounded-full w-8 h-8" /></a>
                <a href='https://www.x.com'><FaTwitter className="text-white bg-[#293241] p-2 rounded-full w-8 h-8" /></a>
              </div>
            </div>
          </div>
        </footer>        
      </body>
    </html>
  );
}