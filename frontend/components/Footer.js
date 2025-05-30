import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';

export default function Footer() {
    return (
      <div className="w-full py-[50px] bg-[#293241] flex-wrap p-4  items-start gap-20 inline-flex 
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
    );
  }