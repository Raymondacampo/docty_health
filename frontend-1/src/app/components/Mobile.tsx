import Image from "next/image";
import mobile from "@/assets/images/mobile.png";
import app_store from "@/assets/images/app_store.webp";
import google_play from "@/assets/images/google_play.webp";
import { QrCode } from 'lucide-react';
export default function Mobile(){
    return ( 
    <div className="w-full text-black lg:h-[65dvh] py-12 px-2 gap-12 flex flex-col items-center justify-center bg-gradient-to-t from-[#98C1D1]/50 via-[#98C1D1]/30 to-[#98C1D1]/50
    lg:flex-row lg:gap-32">
        <div className="flex flex-col gap-4 items-center md:items-start">
            <div className="md:text-start text-center flex flex-col gap-2">
                <h1 className="text-3xl font-bold">Download DoctyHealth <span className="hidden md:block">for mobile</span></h1>
                <p className="text-lg">Start using the fastest and easiest way to solve any of your issues</p>
            </div>
            <div className="hidden lg:block">
                <p className="text-md font-bold">Scan the qr code to get the app now!</p>
                <div className="pl-4 mt-4">
                    <QrCode className="w-32 h-32" />
                </div>
            </div>
            <div className="flex gap-4 mt-4">
                <div>
                    <Image src={app_store} alt="App Store" width={150} height={50} className="w-36 h-12 object-contain" />
                </div>
                <div>
                    <Image src={google_play} alt="Google Play" width={150} height={50} className="w-36 h-12 object-contain" />
                </div>
            </div>
        </div>
        <div>
            <Image src={mobile} alt="Mobile" width={400} height={400} className="w-[12rem] md:w-[20rem] object-contain" />
        </div>
    </div>
    );
}