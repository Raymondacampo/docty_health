import JoinUs from "@/components/Index/components/IndexSectionFour";

export default function About() {
  return (
    <div className="w-full relative bg-white overflow-hidden tracking-wide">
        <section className="relative h-[180px] w-full overflow-hidden sm:mb-16">
            {/* Blurred background image */}
            <div
                className="absolute inset-0 bg-cover bg-center blur-sm scale-105"
                style={{ backgroundImage: "url('images/about_cropped.png')" }}
            ></div>

            {/* Overlay (optional, darkens the image slightly for better text contrast) */}
            <div className="absolute inset-0 bg-black/30"></div>

            {/* Content on top */}
            <div className="relative z-10 flex items-center justify-center h-full text-white bg-black/50 px-4">
                <div>
                    <div className=" items-center justify-center text-3xl font-bold">
                        About us
                    </div>
                    <div className="sitems-center justify-center text-xl">
                        Discover who we are and why we built DoctyHealth
                    </div>             
                </div>
            </div>
        </section>
        <div class="w-full inline-flex justify-center items-center gap-16 my-16 flex-wrap">
            <div class="max-w-2xl p-4 inline-flex flex-col justify-start items-start gap-4">
                <div class="self-stretch justify-start ml-1 text-[#060648] text-2xl font-semibold font-['Inter'] tracking-wide">About DoctyHealth</div>
                <div class="self-stretch justify-start text-black text-sm font-normal font-['Inter'] tracking-wide">
                    At DoctyHealth, we believe that access to quality healthcare should be fast, simple, and stress-free. We are a Dominican startup born from a real need 
                    — the constant struggle people face when trying to find the right doctor in the right place, at the right time.
                    <br /><br />
                    In the Dominican Republic, searching for medical specialists often means endless phone calls, outdated directories, and wasted time. We saw the frustration 
                    of patients and the inefficiencies faced by doctors who want to serve better but lack digital visibility. That’s why we built DoctyHealth — a smarter, more modern 
                    way to connect patients and doctors.
                </div>
            </div>
            <img src="images/doctor_appointments_img.png" class="rounded-md shadow-[0px_5px_15px_2px_rgba(0,0,0,0.5)]
            sm:w-[400px] sm:h-[400px] 
            w-[90%]"></img>
            <div className=" px-4 self-stretch justify-start text-black text-sm font-normal font-['Inter'] tracking-wide">
                Our platform allows users to search, compare, and book appointments with verified medical professionals across specialties. Whether you’re in Santo Domingo, Santiago, 
                or a smaller province, DoctyHealth helps you find healthcare options near you — quickly and reliably. Doctors also benefit from a digital presence that allows them to manage 
                their schedules, grow their practice, and serve more people with less hassle.
                <br /><br />
                DoctyHealth is more than just a directory. It’s a movement toward accessible, transparent, and patient-centered healthcare in the Caribbean. We’re here to make sure no one is left 
                behind when it comes to their health.
            </div>
        </div>


        <div class="w-full flex justify-center items-center gap-16 p-4 py-12 sm:my-16 bg-gradient-to-r from-[#293241] to-[#3d5a80]">
            <div className="flex gap-16 justify-between    rounded-md 
            sm:max-w-6xl sm:p-12 md:flex-nowrap
            xs:p-4 xs:max-w-none xs:flex-wrap">
                <div className="flex flex-col gap-4 text-center">
                    <div className="text-xl font-bold">Mission</div>
                    <div className="text-sm">
                        At DoctyHealth, our mission is to make healthcare in the Dominican Republic more accessible, innovative, and efficient. We empower patients and doctors by providing a digital platform
                        where users can search for medical specialists with smart filters, book appointments instantly, and manage their health journey with ease. By bringing Dominican doctors online, 
                        we bridge the gap between quality care and the people who need it most.
                    </div>
                </div>  
                <div className="flex flex-col gap-4 text-center">
                    <div className="text-xl font-bold">Vision</div>
                    <div className="text-sm">
                        At DoctyHealth, our mission is to make healthcare in the Dominican Republic more accessible, innovative, and efficient. We empower patients and doctors by providing a digital platform
                        where users can search for medical specialists with smart filters, book appointments instantly, and manage their health journey with ease. By bringing Dominican doctors online, 
                        we bridge the gap between quality care and the people who need it most.
                    </div>
                </div>               
            </div>
        </div>

        <JoinUs />
    </div>
  );
}

