import Image from "next/image";
import mobile from "@/assets/images/mobile.png";
import mobile_doctyhealth from "@/assets/images/mobile_doctyhealth.png";
import app_store from "@/assets/images/app_store.webp";
import google_play from "@/assets/images/google_play.webp";
import { QrCode } from 'lucide-react';
export default function Mobile(){
    return ( 
    <div className="w-full text-black lg:h-[65dvh] py-12 px-2 gap-12 flex flex-col items-center justify-center bg-gradient-to-t from-[#98C1D1]/50 via-[#98C1D1]/30 to-[#98C1D1]/50
    lg:flex-row lg:gap-0">
        <div className="flex flex-col gap-4 items-center lg:items-start">
            <div className="lg:text-start text-center flex flex-col gap-2">
                <h1 className="text-3xl font-bold"> <span className="hidden md:block">DoctyHealth for mobile</span> Coming soon!</h1>
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
        <div className="h-auto w-[95%] md:w-[42rem]">
            <Image src={mobile_doctyhealth} alt="Mobile DoctyHealth" width={400} height={400} className="w-full object-contain" />
        </div>
    </div>
    );
}