import ProfileCard from '../components/ProfileCard';
import Base from '../components/home/HomePage';
import SearchBar from '@/components/home/SearchBar';
export async function getServerSideProps() {
  const res = await fetch("http://174.138.66.50/api/data/");
  const data = await res.json();
  return { props: { data } };
}

export default function Home({ data }) {
  return (
    <div class="w-full   h-[3175px] relative bg-white  overflow-hidden">
        <div class="w-full   h-[79px] px-8 justify-between items-center inline-flex">
            <div class="h-[70px] justify-start items-center gap-[15px] inline-flex">
                <img class="w-[70px] h-[70px]" src="/images/dclogo.png" />
                <div class="text-[#293241] text-5xl font-bold font-['Inter']">Doctify</div>
            </div>
            <div class="h-[25px] justify-center items-center gap-4 inline-flex">
                <div class="h-[19px] justify-start items-center gap-1 inline-flex">
                    <div data-svg-wrapper>
                    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.47 8.24268C13.7825 8.46956 14.0611 8.72689 14.3059 9.01465C14.5507 9.30241 14.7616 9.61784 14.9387 9.96094C15.1158 10.304 15.246 10.6665 15.3293 11.0483C15.4127 11.4302 15.4596 11.8203 15.47 12.2188C15.47 12.8773 15.3528 13.4971 15.1184 14.0781C14.884 14.6592 14.5611 15.1655 14.1497 15.5972C13.7382 16.0288 13.2616 16.3691 12.72 16.6182C12.1783 16.8672 11.595 16.9945 10.97 17C10.496 17 10.0377 16.9253 9.59497 16.7759C9.15226 16.6265 8.74601 16.4106 8.37622 16.1284C8.00643 15.8462 7.6783 15.5086 7.39185 15.1157C7.10539 14.7228 6.88403 14.2884 6.72778 13.8125H0.469971V1.0625H2.46997V0H3.46997V1.0625H10.47V0H11.47V1.0625H13.47V8.24268ZM1.46997 2.125V4.25H12.47V2.125H11.47V3.1875H10.47V2.125H3.46997V3.1875H2.46997V2.125H1.46997ZM6.49341 12.75C6.47778 12.5785 6.46997 12.4014 6.46997 12.2188C6.46997 11.7428 6.53247 11.2808 6.65747 10.8325C6.78247 10.3843 6.97257 9.96094 7.22778 9.5625H6.46997V8.5H7.46997V9.21387C7.68351 8.93164 7.92049 8.68262 8.18091 8.4668C8.44132 8.25098 8.72257 8.06559 9.02466 7.91064C9.32674 7.7557 9.64185 7.63949 9.96997 7.56201C10.2981 7.48454 10.6314 7.44303 10.97 7.4375C11.4908 7.4375 11.9908 7.52881 12.47 7.71143V5.3125H1.46997V12.75H6.49341ZM10.97 15.9375C11.4543 15.9375 11.9075 15.8407 12.3293 15.647C12.7512 15.4533 13.121 15.1877 13.4387 14.8501C13.7564 14.5125 14.0064 14.1196 14.1887 13.6714C14.371 13.2231 14.4648 12.7389 14.47 12.2188C14.47 11.7041 14.3788 11.2227 14.1965 10.7744C14.0142 10.3262 13.7642 9.93327 13.4465 9.5957C13.1288 9.25814 12.759 8.99251 12.3372 8.79883C11.9153 8.60514 11.4596 8.50553 10.97 8.5C10.4856 8.5 10.0325 8.59684 9.6106 8.79053C9.18872 8.98421 8.81893 9.24984 8.50122 9.5874C8.18351 9.92497 7.93351 10.3179 7.75122 10.7661C7.56893 11.2144 7.47518 11.6986 7.46997 12.2188C7.46997 12.7334 7.56112 13.2148 7.74341 13.6631C7.9257 14.1113 8.1757 14.5042 8.49341 14.8418C8.81112 15.1794 9.18091 15.445 9.60278 15.6387C10.0247 15.8324 10.4804 15.932 10.97 15.9375ZM11.47 11.6875H12.97V12.75H10.47V9.5625H11.47V11.6875ZM2.46997 8.5H3.46997V9.5625H2.46997V8.5ZM4.46997 8.5H5.46997V9.5625H4.46997V8.5ZM4.46997 6.375H5.46997V7.4375H4.46997V6.375ZM2.46997 10.625H3.46997V11.6875H2.46997V10.625ZM4.46997 10.625H5.46997V11.6875H4.46997V10.625ZM7.46997 7.4375H6.46997V6.375H7.46997V7.4375ZM9.46997 7.4375H8.46997V6.375H9.46997V7.4375ZM11.47 7.4375H10.47V6.375H11.47V7.4375Z" fill="#293241"/>
                    </svg>
                    </div>
                    <div class="text-[#293241] text-base font-bold font-['Inter']">Citas </div>
                </div>
                <div class="h-[19px] justify-start items-center gap-1 inline-flex">
                    <div data-svg-wrapper>
                    <svg width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.96997 2.37698L8.54299 2.79374C8.59831 2.85192 8.66464 2.89819 8.738 2.9298C8.81136 2.9614 8.89026 2.97769 8.96997 2.97769C9.04968 2.97769 9.12858 2.9614 9.20194 2.9298C9.27531 2.89819 9.34163 2.85192 9.39695 2.79374L8.96997 2.37698ZM5.01727 11.1289C4.89564 11.0275 4.73926 10.9793 4.58252 10.9948C4.42579 11.0102 4.28154 11.0882 4.18151 11.2115C4.08148 11.3348 4.03386 11.4933 4.04913 11.6522C4.06441 11.811 4.14132 11.9572 4.26295 12.0586L5.01727 11.1289ZM1.33341 8.71734C1.37079 8.7866 1.42127 8.84771 1.48195 8.89719C1.54263 8.94668 1.61233 8.98356 1.68708 9.00574C1.76182 9.02791 1.84014 9.03495 1.91757 9.02645C1.995 9.01795 2.07002 8.99407 2.13834 8.95618C2.20667 8.91829 2.26696 8.86713 2.31578 8.80562C2.3646 8.74411 2.40098 8.67346 2.42286 8.5977C2.44474 8.52194 2.45169 8.44255 2.4433 8.36407C2.43491 8.28558 2.41135 8.20954 2.37397 8.14029L1.33341 8.71734ZM1.65602 5.2919C1.65602 3.56875 2.61671 2.12292 3.92848 1.51461C5.20309 0.92393 6.91574 1.08022 8.54299 2.79374L9.39695 1.96102C7.46765 -0.0722866 5.22523 -0.408099 3.43509 0.421414C1.68448 1.23329 0.469971 3.11833 0.469971 5.2919H1.65602ZM6.20016 13.5974C6.60578 13.9212 7.04067 14.2659 7.48109 14.5271C7.92151 14.7884 8.42439 15 8.96997 15V13.7978C8.72485 13.7978 8.43704 13.7016 8.07965 13.4892C7.72146 13.2777 7.35062 12.9859 6.93471 12.6533L6.20016 13.5974ZM11.7398 13.5974C12.8673 12.6958 14.3096 11.6635 15.4403 10.3724C16.5923 9.05796 17.47 7.42859 17.47 5.2919H16.2839C16.2839 7.05351 15.5723 8.41038 14.5539 9.5741C13.5141 10.7603 12.2039 11.6956 11.0052 12.6533L11.7398 13.5974ZM17.47 5.2919C17.47 3.11833 16.2563 1.23329 14.5049 0.421414C12.7147 -0.408099 10.4739 -0.0722866 8.54299 1.96022L9.39695 2.79374C11.0242 1.08102 12.7369 0.92393 14.0115 1.51461C15.3232 2.12292 16.2839 3.56795 16.2839 5.2919H17.47ZM11.0052 12.6533C10.5893 12.9859 10.2185 13.2777 9.8603 13.4892C9.50211 13.7008 9.21509 13.7978 8.96997 13.7978V15C9.51555 15 10.0184 14.7876 10.4589 14.5271C10.9001 14.2659 11.3342 13.9212 11.7398 13.5974L11.0052 12.6533ZM6.93471 12.6533C6.30532 12.1508 5.66565 11.6699 5.01727 11.1289L4.26295 12.0586C4.91923 12.606 5.61346 13.1286 6.20016 13.5974L6.93471 12.6533ZM2.37397 8.14109C1.89759 7.26947 1.65036 6.28832 1.65602 5.2919H0.469971C0.469971 6.60469 0.802064 7.73235 1.33341 8.71734L2.37397 8.14109Z" fill="#293241"/>
                    </svg>
                    </div>
                    <div class="text-[#293241] text-base font-bold font-['Inter']">Favoritos</div>
                </div>
                <div class="h-[19px] justify-start items-center gap-1 inline-flex">
                    <div data-svg-wrapper class="relative">
                    <svg width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.73497 8.5C9.71567 8.5 11.3213 6.82107 11.3213 4.75C11.3213 2.67893 9.71567 1 7.73497 1C5.75427 1 4.14859 2.67893 4.14859 4.75C4.14859 6.82107 5.75427 8.5 7.73497 8.5Z" stroke="#293241"/>
                    <path d="M11.3214 10H11.5738C12.0982 10.0002 12.6045 10.2005 12.9976 10.5635C13.3906 10.9264 13.6434 11.4269 13.7084 11.971L13.9889 14.314C14.0141 14.5251 13.9961 14.7393 13.9361 14.9426C13.8761 15.1458 13.7754 15.3334 13.6408 15.4928C13.5061 15.6523 13.3406 15.78 13.1551 15.8674C12.9697 15.9549 12.7685 16 12.5651 16H2.90483C2.7014 16 2.50029 15.9549 2.31484 15.8674C2.12939 15.78 1.96384 15.6523 1.82919 15.4928C1.69454 15.3334 1.59386 15.1458 1.53384 14.9426C1.47381 14.7393 1.45582 14.5251 1.48104 14.314L1.76078 11.971C1.82583 11.4267 2.07883 10.9259 2.4722 10.563C2.86556 10.2 3.3722 9.99979 3.89683 10H4.14859" stroke="#293241" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    </div>
                    <div class="text-[#293241] text-base font-bold font-['Inter']">Mi cuenta</div>
                </div>
            </div>
        </div>
        <SearchBar />
        {/* <div class="w-full   h-[626px] flex-col justify-center items-center gap-[50px] inline-flex">
            <div class="w-[601px] h-[153px] bg-white/0 rounded-[15px] flex-col justify-start items-center gap-10 inline-flex">
                <div class="h-[75px] text-center text-[#293241] text-[62px] font-normal font-['Inter'] tracking-[6.20px] [text-shadow:_0px_4px_4px_rgb(0_0_0_/_0.25)]">Find your doctor</div>
                <div class="text-center text-black text-base font-normal font-['Inter']">Doctify is your doctor search and appointment booking web app designed to simplify access to healthcare in the Dominican Republic. </div>
            </div>
            <div class="w-[900px] h-14 rounded-[10px] border-2 border-black justify-center items-start inline-flex">
                <div class="h-14 p-4 bg-white rounded-tl-[10px] rounded-bl-[10px] border-r border-black justify-start items-center gap-2.5 inline-flex">
                    <div class="text-center text-black text-base font-light font-['Inter']">Speciality</div>
                </div>
                <div class="h-14 p-4 bg-white justify-start items-center gap-2.5 inline-flex">
                    <div class="text-center text-black text-base font-light font-['Inter']">City</div>
                </div>
                <div class="h-14 py-2.5 bg-[#293241] rounded-tr-[10px] rounded-br-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border border-black justify-center items-center gap-2.5 inline-flex">
                    <div class="text-center text-white text-2xl font-normal font-['Inter']">Search</div>
                </div>
            </div>
        </div> */}
        <div class="w-full h-[570px] py-[50px] bg-[#98c1d1]/20 flex-col justify-center items-center gap-[67px] inline-flex">
            <div class="h-auto rounded p-4 shadow-[0px_2px_2px_2px_rgba(0,0,0,0.25)] flex-col justify-start items-center gap-8 inline-flex radius-[10px]">
                <div class="text-center text-[#293241] text-2xl font-bold font-['Inter']">Why Choose Doctify?</div>
                <div class="h-[377px] justify-center items-center gap-[50px] inline-flex">
                    <div class="h-[285px] flex-col justify-center items-center inline-flex">
                        <div class="w-[337px] h-[261px] flex-col justify-start items-center gap-[27px] inline-flex">
                            <img class="w-32 h-32" src="/images/friends.png" />
                            <div class="text-center text-black text-lg font-bold font-['Inter'] tracking-wide">User-friendly</div>
                            <div class="text-center text-black text-base font-light font-['Inter']">Navigate our intuitive platform with ease and find the healthcare solutions you need quickly.</div>
                        </div>
                    </div>
                    <div class="h-[285px] flex-col justify-center items-center inline-flex">
                        <div class="w-[337px] h-[285px] flex-col justify-start items-center gap-[27px] inline-flex">
                            <img class="w-32 h-32" src="/images/data-protection.png" />
                            <div class="text-center text-black text-lg font-bold font-['Inter'] tracking-wide">Secure & Private</div>
                            <div class="text-center text-black text-base font-light font-['Inter']">Your personal information is safe with our advanced data security measures.</div>
                        </div>
                    </div>
                    <div class="h-[285px] flex-col justify-center items-center inline-flex">
                        <div class="w-[337px] h-[261px] flex-col justify-start items-center gap-[27px] inline-flex">
                            <img class="w-32 h-32" src="/images/doctor.png" />
                            <div class="text-center text-black text-lg font-bold font-['Inter'] tracking-wide">Verified Doctors</div>
                            <div class="text-center text-black text-base font-light font-['Inter']">Access profiles of certified and trusted healthcare professionals in your area.<br/></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="w-[1439px] h-[587px] py-24 justify-center items-center gap-[67px] inline-flex">
            <div class="h-[395px] p-11 bg-white justify-center items-center gap-[42px] inline-flex">
                <div class="w-[466px] h-[307px] bg-[#d9d9d9]"></div>
                <div class="h-[162px] flex-col justify-center items-start gap-4 inline-flex">
                    <div class="text-black text-2xl font-bold font-['Inter'] tracking-wide">Who we are</div>
                    <div class="text-black text-base font-bold font-['Inter'] tracking-wide">Dcotify has a story th is a story about the story of doctify and is really interesting</div>
                    <div class="h-11 p-2.5 rounded-[5px] border border-black justify-center items-center gap-2.5 inline-flex">
                        <div class="text-center text-black text-xl font-bold font-['Inter'] tracking-wide">About us</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="w-full   h-[484px] py-[50px] bg-[#293241] justify-center items-center gap-[26px] inline-flex">
            <div data-svg-wrapper class="relative">
            <svg width="45" height="44" viewBox="0 0 45 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M31.6666 3.66699L13.3333 22.0003L31.6666 40.3337" stroke="white" stroke-width="2"/>
            </svg>
            </div>
            <div class="w-[609px] h-96 py-px flex-col justify-center items-center gap-[55px] inline-flex">
                <div class="text-center text-white text-2xl font-medium font-['Inter']">What Our Users Say</div>
                <div class="w-[600px] h-[187px] flex-col justify-start items-center gap-[26px] inline-flex">
                    <div class="h-[111px] p-[15px] bg-white rounded-[15px] border border-black flex-col justify-start items-start gap-6 inline-flex">
                        <div class="text-center text-black text-base font-medium font-['Inter']">"As a doctor, Doctify has helped me connect with more patients and manage appointments efficiently."</div>
                        <div class="text-center text-black text-base font-extralight font-['Inter']">- Dr. Juan Ramirez</div>
                    </div>
                    <div data-svg-wrapper class="relative">
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
                    </div>
                </div>
            </div>
            <div data-svg-wrapper class="relative">
            <svg width="45" height="44" viewBox="0 0 45 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.3333 3.66699L31.6666 22.0003L13.3333 40.3337" stroke="white" stroke-width="2"/>
            </svg>
            </div>
        </div>
        <div class="w-full   h-[317px] py-[50px] flex-col justify-center items-center gap-[30px] inline-flex">
            <div class="text-center text-black text-2xl font-bold font-['Inter'] tracking-wide">Ready to Find the Right Doctor?</div>
            <div class="h-[19px] flex-col justify-start items-center gap-[22px] inline-flex">
                <div class="text-center text-black text-base font-normal font-['Inter'] tracking-wide">Join thousands of users who trust Doctify for their healthcare needs.</div>
            </div>
            <div class="h-[45px] px-4 py-2 bg-[#060648] rounded-[10px] border border-black justify-center items-center gap-2.5 inline-flex">
                <div class="text-center text-white text-2xl font-normal font-['Inter'] tracking-wide">Get started</div>
            </div>
        </div>
        <div class="w-full   h-[313px] py-[50px] bg-[#5c5c5c] flex-col justify-start items-center gap-[19px] inline-flex">
            <div class="h-[171px] justify-center items-start gap-[93px] inline-flex">
                <div class="w-[214px] h-[171px] flex-col justify-start items-start gap-[19px] inline-flex">
                    <div class="h-7 bg-white border border-black"></div>
                    <div class="w-[180px] h-[124px] flex-col justify-start items-start gap-[11px] inline-flex">
                        <div class="h-4 bg-white border border-black"></div>
                        <div class="h-4 bg-white border border-black"></div>
                        <div class="h-4 bg-white border border-black"></div>
                        <div class="h-4 bg-white border border-black"></div>
                        <div class="h-4 bg-white border border-black"></div>
                    </div>
                </div>
                <div class="w-[214px] h-[117px] flex-col justify-start items-start gap-[19px] inline-flex">
                    <div class="h-7 bg-white border border-black"></div>
                    <div class="w-[180px] h-[70px] flex-col justify-start items-start gap-[11px] inline-flex">
                        <div class="h-4 bg-white border border-black"></div>
                        <div class="h-4 bg-white border border-black"></div>
                        <div class="h-4 bg-white border border-black"></div>
                    </div>
                </div>
                <div class="w-[214px] h-[83px] flex-col justify-start items-start gap-[25px] inline-flex">
                    <div class="h-7 bg-white border border-black"></div>
                    <div class="h-[30px] justify-start items-center gap-[13px] inline-flex">
                        <div class="w-[30px] h-[30px] bg-[#d9d9d9] border-4 border-black"></div>
                        <div class="w-[30px] h-[30px] bg-[#d9d9d9] border-4 border-black"></div>
                        <div class="w-[30px] h-[30px] bg-[#d9d9d9] border-4 border-black"></div>
                        <div class="w-[30px] h-[30px] bg-[#d9d9d9] border-4 border-black"></div>
                    </div>
                </div>
            </div>
            <div class="w-[227px] h-[31px] justify-center items-center gap-[15px] inline-flex">
                <div class="w-[15px] h-[15px] bg-[#d9d9d9] border-4 border-black"></div>
                <div class="w-[180px] h-4 bg-white border border-black"></div>
            </div>
        </div>
        <div class="w-full   h-[79px] px-8 justify-between items-center inline-flex">
            <div class="h-[70px] justify-start items-center gap-[15px] inline-flex">
                <img class="w-[70px] h-[70px]" src="https://placehold.co/70x70" />
                <div class="text-[#293241] text-5xl font-bold font-['Inter']">Doctify</div>
            </div>
            <div class="h-[25px] justify-center items-center gap-4 inline-flex">
                <div class="h-[19px] justify-start items-center gap-1 inline-flex">
                    <div data-svg-wrapper>
                    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.47 8.24268C13.7825 8.46956 14.0611 8.72689 14.3059 9.01465C14.5507 9.30241 14.7616 9.61784 14.9387 9.96094C15.1158 10.304 15.246 10.6665 15.3293 11.0483C15.4127 11.4302 15.4596 11.8203 15.47 12.2188C15.47 12.8773 15.3528 13.4971 15.1184 14.0781C14.884 14.6592 14.5611 15.1655 14.1497 15.5972C13.7382 16.0288 13.2616 16.3691 12.72 16.6182C12.1783 16.8672 11.595 16.9945 10.97 17C10.496 17 10.0377 16.9253 9.59497 16.7759C9.15226 16.6265 8.74601 16.4106 8.37622 16.1284C8.00643 15.8462 7.6783 15.5086 7.39185 15.1157C7.10539 14.7228 6.88403 14.2884 6.72778 13.8125H0.469971V1.0625H2.46997V0H3.46997V1.0625H10.47V0H11.47V1.0625H13.47V8.24268ZM1.46997 2.125V4.25H12.47V2.125H11.47V3.1875H10.47V2.125H3.46997V3.1875H2.46997V2.125H1.46997ZM6.49341 12.75C6.47778 12.5785 6.46997 12.4014 6.46997 12.2188C6.46997 11.7428 6.53247 11.2808 6.65747 10.8325C6.78247 10.3843 6.97257 9.96094 7.22778 9.5625H6.46997V8.5H7.46997V9.21387C7.68351 8.93164 7.92049 8.68262 8.18091 8.4668C8.44132 8.25098 8.72257 8.06559 9.02466 7.91064C9.32674 7.7557 9.64185 7.63949 9.96997 7.56201C10.2981 7.48454 10.6314 7.44303 10.97 7.4375C11.4908 7.4375 11.9908 7.52881 12.47 7.71143V5.3125H1.46997V12.75H6.49341ZM10.97 15.9375C11.4543 15.9375 11.9075 15.8407 12.3293 15.647C12.7512 15.4533 13.121 15.1877 13.4387 14.8501C13.7564 14.5125 14.0064 14.1196 14.1887 13.6714C14.371 13.2231 14.4648 12.7389 14.47 12.2188C14.47 11.7041 14.3788 11.2227 14.1965 10.7744C14.0142 10.3262 13.7642 9.93327 13.4465 9.5957C13.1288 9.25814 12.759 8.99251 12.3372 8.79883C11.9153 8.60514 11.4596 8.50553 10.97 8.5C10.4856 8.5 10.0325 8.59684 9.6106 8.79053C9.18872 8.98421 8.81893 9.24984 8.50122 9.5874C8.18351 9.92497 7.93351 10.3179 7.75122 10.7661C7.56893 11.2144 7.47518 11.6986 7.46997 12.2188C7.46997 12.7334 7.56112 13.2148 7.74341 13.6631C7.9257 14.1113 8.1757 14.5042 8.49341 14.8418C8.81112 15.1794 9.18091 15.445 9.60278 15.6387C10.0247 15.8324 10.4804 15.932 10.97 15.9375ZM11.47 11.6875H12.97V12.75H10.47V9.5625H11.47V11.6875ZM2.46997 8.5H3.46997V9.5625H2.46997V8.5ZM4.46997 8.5H5.46997V9.5625H4.46997V8.5ZM4.46997 6.375H5.46997V7.4375H4.46997V6.375ZM2.46997 10.625H3.46997V11.6875H2.46997V10.625ZM4.46997 10.625H5.46997V11.6875H4.46997V10.625ZM7.46997 7.4375H6.46997V6.375H7.46997V7.4375ZM9.46997 7.4375H8.46997V6.375H9.46997V7.4375ZM11.47 7.4375H10.47V6.375H11.47V7.4375Z" fill="#293241"/>
                    </svg>
                    </div>
                    <div class="text-[#293241] text-base font-bold font-['Inter']">Citas </div>
                </div>
                <div class="h-[19px] justify-start items-center gap-1 inline-flex">
                    <div data-svg-wrapper>
                    <svg width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.96997 2.37698L8.54299 2.79374C8.59831 2.85192 8.66464 2.89819 8.738 2.9298C8.81136 2.9614 8.89026 2.97769 8.96997 2.97769C9.04968 2.97769 9.12858 2.9614 9.20194 2.9298C9.27531 2.89819 9.34163 2.85192 9.39695 2.79374L8.96997 2.37698ZM5.01727 11.1289C4.89564 11.0275 4.73926 10.9793 4.58252 10.9948C4.42579 11.0102 4.28154 11.0882 4.18151 11.2115C4.08148 11.3348 4.03386 11.4933 4.04913 11.6522C4.06441 11.811 4.14132 11.9572 4.26295 12.0586L5.01727 11.1289ZM1.33341 8.71734C1.37079 8.7866 1.42127 8.84771 1.48195 8.89719C1.54263 8.94668 1.61233 8.98356 1.68708 9.00574C1.76182 9.02791 1.84014 9.03495 1.91757 9.02645C1.995 9.01795 2.07002 8.99407 2.13834 8.95618C2.20667 8.91829 2.26696 8.86713 2.31578 8.80562C2.3646 8.74411 2.40098 8.67346 2.42286 8.5977C2.44474 8.52194 2.45169 8.44255 2.4433 8.36407C2.43491 8.28558 2.41135 8.20954 2.37397 8.14029L1.33341 8.71734ZM1.65602 5.2919C1.65602 3.56875 2.61671 2.12292 3.92848 1.51461C5.20309 0.92393 6.91574 1.08022 8.54299 2.79374L9.39695 1.96102C7.46765 -0.0722866 5.22523 -0.408099 3.43509 0.421414C1.68448 1.23329 0.469971 3.11833 0.469971 5.2919H1.65602ZM6.20016 13.5974C6.60578 13.9212 7.04067 14.2659 7.48109 14.5271C7.92151 14.7884 8.42439 15 8.96997 15V13.7978C8.72485 13.7978 8.43704 13.7016 8.07965 13.4892C7.72146 13.2777 7.35062 12.9859 6.93471 12.6533L6.20016 13.5974ZM11.7398 13.5974C12.8673 12.6958 14.3096 11.6635 15.4403 10.3724C16.5923 9.05796 17.47 7.42859 17.47 5.2919H16.2839C16.2839 7.05351 15.5723 8.41038 14.5539 9.5741C13.5141 10.7603 12.2039 11.6956 11.0052 12.6533L11.7398 13.5974ZM17.47 5.2919C17.47 3.11833 16.2563 1.23329 14.5049 0.421414C12.7147 -0.408099 10.4739 -0.0722866 8.54299 1.96022L9.39695 2.79374C11.0242 1.08102 12.7369 0.92393 14.0115 1.51461C15.3232 2.12292 16.2839 3.56795 16.2839 5.2919H17.47ZM11.0052 12.6533C10.5893 12.9859 10.2185 13.2777 9.8603 13.4892C9.50211 13.7008 9.21509 13.7978 8.96997 13.7978V15C9.51555 15 10.0184 14.7876 10.4589 14.5271C10.9001 14.2659 11.3342 13.9212 11.7398 13.5974L11.0052 12.6533ZM6.93471 12.6533C6.30532 12.1508 5.66565 11.6699 5.01727 11.1289L4.26295 12.0586C4.91923 12.606 5.61346 13.1286 6.20016 13.5974L6.93471 12.6533ZM2.37397 8.14109C1.89759 7.26947 1.65036 6.28832 1.65602 5.2919H0.469971C0.469971 6.60469 0.802064 7.73235 1.33341 8.71734L2.37397 8.14109Z" fill="#293241"/>
                    </svg>
                    </div>
                    <div class="text-[#293241] text-base font-bold font-['Inter']">Favoritos</div>
                </div>
                <div class="h-[19px] justify-start items-center gap-1 inline-flex">
                    <div data-svg-wrapper class="relative">
                    <svg width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.73497 8.5C9.71567 8.5 11.3213 6.82107 11.3213 4.75C11.3213 2.67893 9.71567 1 7.73497 1C5.75427 1 4.14859 2.67893 4.14859 4.75C4.14859 6.82107 5.75427 8.5 7.73497 8.5Z" stroke="#293241"/>
                    <path d="M11.3214 10H11.5738C12.0982 10.0002 12.6045 10.2005 12.9976 10.5635C13.3906 10.9264 13.6434 11.4269 13.7084 11.971L13.9889 14.314C14.0141 14.5251 13.9961 14.7393 13.9361 14.9426C13.8761 15.1458 13.7754 15.3334 13.6408 15.4928C13.5061 15.6523 13.3406 15.78 13.1551 15.8674C12.9697 15.9549 12.7685 16 12.5651 16H2.90483C2.7014 16 2.50029 15.9549 2.31484 15.8674C2.12939 15.78 1.96384 15.6523 1.82919 15.4928C1.69454 15.3334 1.59386 15.1458 1.53384 14.9426C1.47381 14.7393 1.45582 14.5251 1.48104 14.314L1.76078 11.971C1.82583 11.4267 2.07883 10.9259 2.4722 10.563C2.86556 10.2 3.3722 9.99979 3.89683 10H4.14859" stroke="#293241" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    </div>
                    <div class="text-[#293241] text-base font-bold font-['Inter']">Mi cuenta</div>
                </div>
            </div>
        </div>
    </div>
    // <div class="w-full h-[2388px] relative bg-white  overflow-hidden">
    //     <div class="w-36 h-[31px] left-[50px] top-[19px] absolute bg-[#d9d9d9] border border-black"></div>
    //     <div class="h-[25px] left-[971px] top-[48px] absolute justify-center items-center gap-4 inline-flex">
    //         <div class="w-[129px] h-5 bg-black"></div>
    //         <div class="w-[129px] h-5 bg-black"></div>
    //         <div class="w-[129px] h-5 bg-black"></div>
    //     </div>
    //     <div class="w-full h-[626px] left-0 top-[79px] absolute border border-black justify-center items-center gap-[157px] inline-flex">
    //         <div class="w-[565px] h-[287px] px-5 py-[34px] border border-black flex-col justify-center items-center gap-[51px] inline-flex">
    //             <div class="self-stretch h-[68px] bg-black"></div>
    //             <div class="w-[491px] h-12 opacity-60 flex-col justify-end items-center gap-[18px] flex">
    //                 <div class="self-stretch h-[0px] border-8 border-black"></div>
    //                 <div class="self-stretch h-[0px] border-8 border-black"></div>
    //                 <div class="self-stretch h-[0px] border-8 border-black"></div>
    //             </div>
    //             <div class="justify-start items-center gap-[58px] inline-flex">
    //                 <div class="w-[214px] h-11 bg-[#d9d9d9] border border-black"></div>
    //                 <div class="w-[214px] h-11 bg-[#d9d9d9] border border-black text-sm">ddd</div>
    //             </div>
    //         </div>
    //         <div class="w-[418px] px-[15px] py-6 rounded-[10px] border border-black flex-col justify-start items-center gap-6 inline-flex">
    //             <div class="w-[354px] h-[52px] bg-black"></div>
    //             <div class="self-stretch h-[116px] flex-col justify-start items-start gap-6 flex">
    //                 <div class="self-stretch h-[46px] border border-black"></div>
    //                 <div class="self-stretch h-[46px] border border-black"></div>
    //             </div>
    //             <div class="w-[209px] h-10 bg-[#d9d9d9]"></div>
    //         </div>
    //     </div>
    //     <div class="w-full h-[570px] py-[50px] left-0 top-[705px] absolute border border-black flex-col justify-center items-center gap-[67px] inline-flex">
    //         <div class="w-[474px] h-10 bg-black"></div>
    //         <div class="self-stretch grow shrink basis-0 justify-center items-center gap-[50px] inline-flex">
    //             <div class="flex-col justify-center items-center inline-flex">
    //                 <div class="h-[326px] flex-col justify-start items-center gap-[27px] flex">
    //                     <div class="w-[150px] h-[150px] bg-[#d9d9d9] rounded-full border border-black"></div>
    //                     <div class="w-[251px] h-7 bg-black"></div>
    //                     <div class="self-stretch h-[94px] opacity-60 flex-col justify-start items-start gap-2.5 flex">
    //                         <div class="self-stretch h-4 bg-black"></div>
    //                         <div class="self-stretch h-4 bg-black"></div>
    //                         <div class="self-stretch h-4 bg-black"></div>
    //                         <div class="self-stretch h-4 bg-black"></div>
    //                     </div>
    //                 </div>
    //             </div>
    //             <div class="w-[337px] flex-col justify-start items-center gap-[27px] inline-flex">
    //                 <div class="w-[150px] h-[150px] bg-[#d9d9d9] rounded-full border border-black"></div>
    //                 <div class="w-[251px] h-7 bg-black"></div>
    //                 <div class="self-stretch h-[94px] opacity-60 flex-col justify-start items-start gap-2.5 flex">
    //                     <div class="self-stretch h-4 bg-black"></div>
    //                     <div class="self-stretch h-4 bg-black"></div>
    //                     <div class="self-stretch h-4 bg-black"></div>
    //                     <div class="self-stretch h-4 bg-black"></div>
    //                 </div>
    //             </div>
    //             <div class="w-[337px] flex-col justify-start items-center gap-[27px] inline-flex">
    //                 <div class="w-[150px] h-[150px] bg-[#d9d9d9] rounded-full border border-black"></div>
    //                 <div class="w-[251px] h-7 bg-black"></div>
    //                 <div class="self-stretch h-[94px] opacity-60 flex-col justify-start items-start gap-2.5 flex">
    //                     <div class="self-stretch h-4 bg-black"></div>
    //                     <div class="self-stretch h-4 bg-black"></div>
    //                     <div class="self-stretch h-4 bg-black"></div>
    //                     <div class="self-stretch h-4 bg-black"></div>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    //     <div class="w-full py-[50px] left-0 top-[1274px] absolute border border-black justify-center items-center gap-[26px] inline-flex">
    //         <div data-svg-wrapper class="relative">
    //         <svg width="45" height="44" viewBox="0 0 45 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    //         <path d="M31.6667 3.66663L13.3334 22L31.6667 40.3333" stroke="black" stroke-width="2"/>
    //         </svg>
    //         </div>
    //         <div class="w-[609px] h-96 py-px flex-col justify-center items-center gap-[55px] inline-flex">
    //             <div class="w-[474px] h-10 bg-black"></div>
    //             <div class="h-[266px] flex-col justify-start items-center gap-[26px] flex">
    //                 <div class="self-stretch h-[190px] p-[15px] rounded-[15px] border border-black flex-col justify-start items-start gap-10 flex">
    //                     <div class="self-stretch h-[100px] flex-col justify-start items-start gap-3 flex">
    //                         <div class="self-stretch h-4 opacity-60 bg-black"></div>
    //                         <div class="self-stretch h-4 opacity-60 bg-black"></div>
    //                         <div class="self-stretch h-4 opacity-60 bg-black"></div>
    //                         <div class="self-stretch h-4 opacity-60 bg-black"></div>
    //                     </div>
    //                     <div class="w-[180px] h-5 bg-black"></div>
    //                 </div>
    //                 <div data-svg-wrapper class="relative">
    //                 <svg width="50" height="51" viewBox="0 0 50 51" fill="none" xmlns="http://www.w3.org/2000/svg">
    //                 <g clip-path="url(#clip0_2_103)">
    //                 <path d="M8.33337 31.75C11.7852 31.75 14.5834 28.9518 14.5834 25.5C14.5834 22.0482 11.7852 19.25 8.33337 19.25C4.88159 19.25 2.08337 22.0482 2.08337 25.5C2.08337 28.9518 4.88159 31.75 8.33337 31.75Z" fill="black"/>
    //                 <path d="M25 31.75C28.4518 31.75 31.25 28.9518 31.25 25.5C31.25 22.0482 28.4518 19.25 25 19.25C21.5482 19.25 18.75 22.0482 18.75 25.5C18.75 28.9518 21.5482 31.75 25 31.75Z" fill="black"/>
    //                 <path d="M41.6666 31.75C45.1184 31.75 47.9166 28.9518 47.9166 25.5C47.9166 22.0482 45.1184 19.25 41.6666 19.25C38.2148 19.25 35.4166 22.0482 35.4166 25.5C35.4166 28.9518 38.2148 31.75 41.6666 31.75Z" fill="black"/>
    //                 </g>
    //                 <defs>
    //                 <clipPath id="clip0_2_103">
    //                 <rect width="50" height="50" fill="white" transform="translate(0 0.5)"/>
    //                 </clipPath>
    //                 </defs>
    //                 </svg>
    //                 </div>
    //             </div>
    //         </div>
    //         <div data-svg-wrapper class="relative">
    //         <svg width="45" height="44" viewBox="0 0 45 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    //         <path d="M13.3334 3.66663L31.6667 22L13.3334 40.3333" stroke="black" stroke-width="2"/>
    //         </svg>
    //         </div>
    //     </div>
    //     <div class="w-full h-[317px] left-0 top-[1758px] absolute border border-black flex-col justify-center items-center gap-[30px] inline-flex">
    //         <div class="self-stretch h-[105px] flex-col justify-start items-center gap-[22px] flex">
    //             <div class="w-[474px] h-10 bg-black"></div>
    //             <div class="h-[43px] flex-col justify-start items-start gap-[11px] flex">
    //                 <div class="self-stretch h-4 opacity-50 bg-black"></div>
    //                 <div class="self-stretch h-4 opacity-50 bg-black"></div>
    //             </div>
    //         </div>
    //         <div class="w-[268px] h-[55px] bg-[#d9d9d9] border border-black"></div>
    //     </div>
    //     <div class="w-full h-[313px] py-[50px] left-0 top-[2075px] absolute bg-[#5c5c5c] flex-col justify-start items-center gap-[19px] inline-flex">
    //         <div class="self-stretch justify-center items-start gap-[93px] inline-flex">
    //             <div class="w-[214px] flex-col justify-start items-start gap-[19px] inline-flex">
    //                 <div class="self-stretch h-7 bg-white border border-black"></div>
    //                 <div class="h-[124px] flex-col justify-start items-start gap-[11px] flex">
    //                     <div class="self-stretch h-4 bg-white border border-black"></div>
    //                     <div class="self-stretch h-4 bg-white border border-black"></div>
    //                     <div class="self-stretch h-4 bg-white border border-black"></div>
    //                     <div class="self-stretch h-4 bg-white border border-black"></div>
    //                     <div class="self-stretch h-4 bg-white border border-black"></div>
    //                 </div>
    //             </div>
    //             <div class="w-[214px] flex-col justify-start items-start gap-[19px] inline-flex">
    //                 <div class="self-stretch h-7 bg-white border border-black"></div>
    //                 <div class="h-[70px] flex-col justify-start items-start gap-[11px] flex">
    //                     <div class="self-stretch h-4 bg-white border border-black"></div>
    //                     <div class="self-stretch h-4 bg-white border border-black"></div>
    //                     <div class="self-stretch h-4 bg-white border border-black"></div>
    //                 </div>
    //             </div>
    //             <div class="w-[214px] flex-col justify-start items-start gap-[25px] inline-flex">
    //                 <div class="self-stretch h-7 bg-white border border-black"></div>
    //                 <div class="justify-start items-center gap-[13px] inline-flex">
    //                     <div class="w-[30px] h-[30px] bg-[#d9d9d9] border-4 border-black"></div>
    //                     <div class="w-[30px] h-[30px] bg-[#d9d9d9] border-4 border-black"></div>
    //                     <div class="w-[30px] h-[30px] bg-[#d9d9d9] border-4 border-black"></div>
    //                     <div class="w-[30px] h-[30px] bg-[#d9d9d9] border-4 border-black"></div>
    //                 </div>
    //             </div>
    //         </div>
    //         <div class="w-[227px] h-[31px] justify-center items-center gap-[15px] inline-flex">
    //             <div class="w-[15px] h-[15px] bg-[#d9d9d9] border-4 border-black"></div>
    //             <div class="w-[180px] h-4 bg-white border border-black"></div>
    //         </div>
    //     </div>
    //     <div class="w-full h-[0px] left-0 top-[2314px] absolute border border-white"></div>
    // </div>
  );
}
