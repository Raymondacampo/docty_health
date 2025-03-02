const Opinions = () => {
    return(
        <div class="w-full py-[50px] bg-[#293241] justify-center items-center gap-[26px] inline-flex">
            <button data-svg-wrapper class="relative">
            <svg className="xs:hidden" width="45" height="44" viewBox="0 0 45 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M31.6666 3.66699L13.3333 22.0003L31.6666 40.3337" stroke="white" stroke-width="2"/>
            </svg>
            </button>
            <div class="w-auto py-px flex-col justify-center items-center gap-[55px] flex">
                <div class="text-center  text-white text-2xl font-medium font-['Inter']">What Our Users Say</div>
                <div class="w-auto flex-col justify-start items-center gap-[26px] inline-flex">
                    <div class="p-8 bg-white rounded-[15px] border border-black flex-col justify-start items-start gap-8 inline-flex">
                        <div class="text-center text-black text-base font-medium font-['Inter']">"As a doctor, Doctify has helped me connect with more patients and manage appointments efficiently."</div>
                        <div class="text-center text-black text-base font-extralight font-['Inter']">- Dr. Juan Ramirez</div>
                    </div>
                    <button data-svg-wrapper class="relative">
                    <svg width="50" height="51" viewBox="0 0 50 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_1_171)">
                    <path d="M8.33331 31.75C11.7851 31.75 14.5833 28.9518 14.5833 25.5C14.5833 22.0482 11.7851 19.25 8.33331 19.25C4.88153 19.25 2.08331 22.0482 2.08331 25.5C2.08331 28.9518 4.88153 31.75 8.33331 31.75Z" fill="white"/>
                    <path d="M25 31.75C28.4518 31.75 31.25 28.9518 31.25 25.5C31.25 22.0482 28.4518 19.25 25 19.25C21.5482 19.25 18.75 22.0482 18.75 25.5C18.75 28.9518 21.5482 31.75 25 31.75Z" fill="white"/>
                    <path d="M41.6667 31.75C45.1185 31.75 47.9167 28.9518 47.9167 25.5C47.9167 22.0482 45.1185 19.25 41.6667 19.25C38.2149 19.25 35.4167 22.0482 35.4167 25.5C35.4167 28.9518 38.2149 31.75 41.6667 31.75Z" fill="white"/>
                    </g>
                    <defs>
                    <clipPath id="clip0_1_171">
                    <rect width="50" height="50" fill="white" transform="translate(0 0.5)"/>
                    </clipPath>
                    </defs>
                    </svg>
                    </button>
                </div>
            </div>
            <button data-svg-wrapper class="relative">
            <svg className="xs:hidden" width="45" height="44" viewBox="0 0 45 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.3333 3.66699L31.6666 22.0003L13.3333 40.3337" stroke="white" stroke-width="2"/>
            </svg>
            </button>
        </div>
    )
}
export default Opinions;