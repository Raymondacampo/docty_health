const Field = ({title, value}) => {
    return(
        <div class="w-full justify-between items-center gap-4 flex">
            <div class=" text-[#3d5a80]  font-normal font-['Inter']
            sm:text-base
            xs:text-sm">{title}</div>
            <div class="self-stretch text-black font-['Inter'] text-wrap break-all
            sm:text-sm xs:text-xs">{value}</div>
        </div>
    )
}

const ProfessionalData = () => {
    return(
        <div class="w-full rounded-[10px] flex-col justify-start items-start gap-6 inline-flex">
            <div class="self-stretch text-black font-normal font-['Inter']
            sm:text-xl
            xs:text-lg">Professional data</div>
            <div class="self-stretch h-[201px] p-4 rounded-[10px] flex-col justify-start items-start gap-6 flex">
                <div class="self-stretch justify-between items-start gap-4 inline-flex">
                    <div class="w-[125px] text-[#3d5a80] font-normal font-['Inter']
                    sm:text-base
                    xs:text-sm">Specialization</div>
                    <div class="text-black text-sm font-normal font-['Inter']">Cardiologist</div>
                </div>
                <div class="self-stretch justify-between items-start gap-4 inline-flex">
                    <div class="w-[125px] text-[#3d5a80] font-normal font-['Inter']
                    sm:text-base
                    xs:text-sm">Exequatur</div>
                    <div class="text-black text-sm font-normal font-['Inter']">557-665-33</div>
                </div>
                <div class="self-stretch justify-between items-start gap-4 inline-flex">
                    <div class="w-[125px] text-[#3d5a80] font-normal font-['Inter']
                    sm:text-base
                    xs:text-sm">Experience</div>
                    <div class="text-black text-sm font-normal font-['Inter']">7 years</div>
                </div>
                <div class="self-stretch justify-between items-center gap-4 inline-flex">
                    <div class="w-[125px] text-[#3d5a80] font-normal font-['Inter']
                    sm:text-base
                    xs:text-sm">Location</div>
                    <div class="p-2 bg-[#98c1d1]/25 rounded-[10px] justify-center items-center gap-2.5 flex">
                        <div class="text-black text-sm font-normal font-['Inter']">Centro medico moderno</div>
                        <div data-svg-wrapper class="relative">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 19H6.425L16.2 9.225L14.775 7.8L5 17.575V19ZM4 21C3.71667 21 3.47933 20.904 3.288 20.712C3.09667 20.52 3.00067 20.2827 3 20V17.575C3 17.3083 3.05 17.054 3.15 16.812C3.25 16.57 3.39167 16.3577 3.575 16.175L16.2 3.575C16.4 3.39167 16.621 3.25 16.863 3.15C17.105 3.05 17.359 3 17.625 3C17.891 3 18.1493 3.05 18.4 3.15C18.6507 3.25 18.8673 3.4 19.05 3.6L20.425 5C20.625 5.18333 20.7707 5.4 20.862 5.65C20.9533 5.9 20.9993 6.15 21 6.4C21 6.66667 20.954 6.921 20.862 7.163C20.77 7.405 20.6243 7.62567 20.425 7.825L7.825 20.425C7.64167 20.6083 7.429 20.75 7.187 20.85C6.945 20.95 6.691 21 6.425 21H4ZM15.475 8.525L14.775 7.8L16.2 9.225L15.475 8.525Z" fill="black"/>
                        </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const Scheduling = () => {
    return(
        <div class="w-full rounded-[10px] flex-col justify-start items-start gap-6 inline-flex">
            <div class="self-stretch text-black font-normal font-['Inter']
            sm:text-xl
            xs:text-lg">Scheduling</div>
            <div className="self-stretch flex-col justify-start items-center gap-2 flex">
                <div class="self-stretch rounded-[10px] flex-col justify-start items-center gap-6 flex">
                    <div class="self-stretch justify-start items-start gap-4 inline-flex">
                        <div class="w-[125px] text-[#3d5a80] font-normal font-['Inter']
                        sm:text-lg
                        xs:text-base">Taking dates</div>
                        <div data-svg-wrapper>
                        <svg width="37" height="20" viewBox="0 0 37 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M26.5938 0H10.4062C4.66836 0 0 4.48611 0 10C0 15.5139 4.66836 20 10.4062 20H26.5938C32.3316 20 37 15.5139 37 10C37 4.48611 32.3316 0 26.5938 0ZM26.5938 17.7778C24.993 17.7778 23.4281 17.3216 22.0971 16.467C20.7661 15.6124 19.7287 14.3976 19.1161 12.9764C18.5035 11.5552 18.3432 9.99137 18.6555 8.48263C18.9678 6.97389 19.7387 5.58802 20.8706 4.50028C22.0025 3.41254 23.4447 2.67178 25.0147 2.37167C26.5848 2.07156 28.2122 2.22559 29.6911 2.81427C31.17 3.40295 32.4341 4.39985 33.3235 5.6789C34.2128 6.95795 34.6875 8.4617 34.6875 10C34.6852 12.0621 33.8317 14.0391 32.3144 15.4973C30.797 16.9554 28.7396 17.7756 26.5938 17.7778Z" fill="#EE6C4D"/>
                        </svg>
                        </div>
                    </div>
                    <div class="self-stretch flex-col justify-start items-start gap-2 flex">
                        <div class="self-stretch px-2 py-3 bg-[#98c1d1]/25 rounded-[10px] justify-between items-center inline-flex">
                            <div class="text-black font-['Inter'] text-sm">Monday schedule in Centro medico moderno</div>
                            <div data-svg-wrapper class="relative">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 19H6.425L16.2 9.225L14.775 7.8L5 17.575V19ZM4 21C3.71667 21 3.47933 20.904 3.288 20.712C3.09667 20.52 3.00067 20.2827 3 20V17.575C3 17.3083 3.05 17.054 3.15 16.812C3.25 16.57 3.39167 16.3577 3.575 16.175L16.2 3.575C16.4 3.39167 16.621 3.25 16.863 3.15C17.105 3.05 17.359 3 17.625 3C17.891 3 18.1493 3.05 18.4 3.15C18.6507 3.25 18.8673 3.4 19.05 3.6L20.425 5C20.625 5.18333 20.7707 5.4 20.862 5.65C20.9533 5.9 20.9993 6.15 21 6.4C21 6.66667 20.954 6.921 20.862 7.163C20.77 7.405 20.6243 7.62567 20.425 7.825L7.825 20.425C7.64167 20.6083 7.429 20.75 7.187 20.85C6.945 20.95 6.691 21 6.425 21H4ZM15.475 8.525L14.775 7.8L16.2 9.225L15.475 8.525Z" fill="black"/>
                            </svg>
                            </div>
                        </div>
                        <div class="self-stretch px-2 py-3 bg-[#98c1d1]/25 rounded-[10px] justify-between items-center inline-flex">
                            <div class="text-black font-['Inter'] text-sm">Wednesday schedule in Centro medico moderno</div>
                            <div data-svg-wrapper class="relative">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 19H6.425L16.2 9.225L14.775 7.8L5 17.575V19ZM4 21C3.71667 21 3.47933 20.904 3.288 20.712C3.09667 20.52 3.00067 20.2827 3 20V17.575C3 17.3083 3.05 17.054 3.15 16.812C3.25 16.57 3.39167 16.3577 3.575 16.175L16.2 3.575C16.4 3.39167 16.621 3.25 16.863 3.15C17.105 3.05 17.359 3 17.625 3C17.891 3 18.1493 3.05 18.4 3.15C18.6507 3.25 18.8673 3.4 19.05 3.6L20.425 5C20.625 5.18333 20.7707 5.4 20.862 5.65C20.9533 5.9 20.9993 6.15 21 6.4C21 6.66667 20.954 6.921 20.862 7.163C20.77 7.405 20.6243 7.62567 20.425 7.825L7.825 20.425C7.64167 20.6083 7.429 20.75 7.187 20.85C6.945 20.95 6.691 21 6.425 21H4ZM15.475 8.525L14.775 7.8L16.2 9.225L15.475 8.525Z" fill="black"/>
                            </svg>
                            </div>
                        </div>
                    </div>               
                </div>
                <div class="text-[#4285f4] text-sm font-normal font-['Inter']">Add +</div>  
            </div>
        </div>
    
    )
}

const Documents = () => {
    return(
        <div class="w-full rounded-[10px] flex-col justify-start items-start gap-5 inline-flex">
            <div class="self-stretch text-black font-normal font-['Inter']
            sm:text-xl
            xs:text-lg">Documents & certificates</div>
            <div class="self-stretch flex-col justify-start items-center gap-2 flex">
                <div class="self-stretch px-2 py-3 bg-[#98c1d1]/25 rounded-[10px] justify-start items-center gap-2.5 inline-flex">
                    <div class="text-black text-sm font-normal font-['Inter']">Certificado.jpg</div>
                </div>
                <div class="text-[#4285f4] text-sm font-normal font-['Inter']">Add +</div>
            </div>
        </div>
    )
}


export default function Settings() {
    return(
        <div class="w-full flex-col justify-center items-center gap-2.5 inline-flex">
            <div class=" py-4 bg-white rounded-[20px] justify-start items-start gap-4 inline-flex
            sm:px-0 sm:w-auto
            xs:px-2 xs:w-full">
                <div class="w-[200px] py-8 flex-col justify-center items-start gap-2 
                md:inline-flex
                xs:hidden">
                    <div class="w-full flex-col justify-center items-end gap-1 flex">
                        <a href="" class="p-2 rounded-md self-stretch flex-col justify-center items-start gap-1 flex hover:bg-[#98c1d1]/25">
                            <div class="self-stretch text-black text-sm font-normal font-['Inter']">Settings</div>
                            <div className="w-[90%] border-2 border-[#3d5a80]"></div>
                        </a>
                        <a href="" class="p-2 rounded-md self-stretch text-black text-sm font-normal font-['Inter'] hover:bg-[#98c1d1]/25">Dates</a>
                        <a href="" class="p-2 rounded-md self-stretch text-black text-sm font-normal font-['Inter'] hover:bg-[#98c1d1]/25">Favourites</a>
                    </div>
                    <a href="" class="p-2 rounded-md self-stretch justify-start items-start gap-2 inline-flex">
                        <div class="text-[#ff0000] text-sm font-normal font-['Inter']">Logout</div>
                        <div data-svg-wrapper class="relative">
                        <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5.5V3.5C12 2.96957 11.7893 2.46086 11.4142 2.08579C11.0391 1.71071 10.5304 1.5 10 1.5H3C2.46957 1.5 1.96086 1.71071 1.58579 2.08579C1.21071 2.46086 1 2.96957 1 3.5V15.5C1 16.0304 1.21071 16.5391 1.58579 16.9142C1.96086 17.2893 2.46957 17.5 3 17.5H10C10.5304 17.5 11.0391 17.2893 11.4142 16.9142C11.7893 16.5391 12 16.0304 12 15.5V13.5" stroke="#FF0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M7 9.5H19M19 9.5L16 6.5M19 9.5L16 12.5" stroke="#FF0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        </div>
                    </a>
                </div>
                <div class="w-full self-stretch  py-8 bg-white rounded-[20px] border border-black/25 flex-col justify-center items-center gap-[55px] flex
                lg:px-20
                md:px-10
                sm:px-20
                xs:px-4">
                    <div class="w-full flex-col justify-start items-start gap-6 flex">
                        <div class="self-stretch text-black font-normal font-['Inter']
                        sm:text-xl
                        xs:text-lg">Personal data</div>
                        <div class="w-full p-4 rounded-[10px] flex-col justify-start items-start gap-6 flex">
                            <div class="justify-start items-center gap-[11px] inline-flex">
                                <div class="w-[66px] h-[66px] bg-[#d9d9d9] rounded-full"></div>
                                <a href="" class="justify-start items-center gap-1 flex">
                                    <div class="text-[#4285f4] font-normal font-['Inter']
                                    sm:text-sm xs:text-xs">edit picture</div>
                                    <div data-svg-wrapper>
                                    <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 14.5V11.1944L10.2667 0.947222C10.4222 0.80463 10.5941 0.694445 10.7823 0.616667C10.9706 0.538889 11.1681 0.5 11.375 0.5C11.5819 0.5 11.7828 0.538889 11.9778 0.616667C12.1727 0.694445 12.3413 0.811111 12.4833 0.966667L13.5528 2.05556C13.7083 2.19815 13.8219 2.36667 13.8934 2.56111C13.965 2.75556 14.0005 2.95 14 3.14444C14 3.35185 13.9645 3.54967 13.8934 3.73789C13.8224 3.92611 13.7088 4.09774 13.5528 4.25278L3.30555 14.5H0ZM11.3556 4.23333L12.4444 3.14444L11.3556 2.05556L10.2667 3.14444L11.3556 4.23333Z" fill="#0D99FF"/>
                                    </svg>
                                    </div>
                                </a>
                            </div>
                            <Field title="Full name" value="Raymond A’campo Sandoval" />
                            <Field title="Username" value="raymondacampo" />
                            <Field title="E-mail" value="raymonda@camposandovalgmail.com" />
                            <Field title="Phone number" value="829-662-2197" />
                            <Field title="Date of birth" value="03-10-2003" />
                        </div>
                    </div>
                    <ProfessionalData />
                    <Scheduling />
                    <Documents />
                    <div class="w-full flex-col justify-start items-start gap-2 flex">
                        <div class="self-stretch text-black font-normal font-['Inter']
                        sm:text-xl
                        xs:text-lg">Security & privacy</div>
                        <div class="self-stretch py-4 rounded-[10px] flex-col justify-start items-center gap-4 flex">
                            <a href="" class="w-full px-4 py-2 bg-[#98c1d1]/25 rounded-[10px] justify-start items-center gap-[30px] inline-flex">
                                <div class="text-[#3d5a80] text-sm font-normal font-['Inter']">Change password</div>
                                <div data-svg-wrapper>
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 16H3.425L13.2 6.225L11.775 4.8L2 14.575V16ZM1 18C0.716667 18 0.479333 17.904 0.288 17.712C0.0966668 17.52 0.000666667 17.2827 0 17V14.575C0 14.3083 0.0500001 14.054 0.15 13.812C0.25 13.57 0.391667 13.3577 0.575 13.175L13.2 0.575C13.4 0.391667 13.621 0.25 13.863 0.15C14.105 0.0500001 14.359 0 14.625 0C14.891 0 15.1493 0.0500001 15.4 0.15C15.6507 0.25 15.8673 0.4 16.05 0.6L17.425 2C17.625 2.18333 17.7707 2.4 17.862 2.65C17.9533 2.9 17.9993 3.15 18 3.4C18 3.66667 17.954 3.921 17.862 4.163C17.77 4.405 17.6243 4.62567 17.425 4.825L4.825 17.425C4.64167 17.6083 4.429 17.75 4.187 17.85C3.945 17.95 3.691 18 3.425 18H1ZM12.475 5.525L11.775 4.8L13.2 6.225L12.475 5.525Z" fill="#3D5A80"/>
                                </svg>
                                </div>
                            </a>
                            <a href="" ><span class="text-[#4285f4] text-sm font-normal font-['Inter']">Enable two factor authentication </span><span class="text-[#4285f4] text-base font-normal font-['Inter']">+</span></a>
                            <a href="" class="justify-start items-center gap-2 inline-flex">
                                <div class="text-[#ff0000] text-sm font-normal font-['Inter']">Delete account</div>
                                <div data-svg-wrapper>
                                <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.375 0.5V1.33333H0V3H0.875V13.8333C0.875 14.2754 1.05937 14.6993 1.38756 15.0118C1.71575 15.3244 2.16087 15.5 2.625 15.5H11.375C11.8391 15.5 12.2842 15.3244 12.6124 15.0118C12.9406 14.6993 13.125 14.2754 13.125 13.8333V3H14V1.33333H9.625V0.5H4.375ZM2.625 3H11.375V13.8333H2.625V3ZM4.375 4.66667V12.1667H6.125V4.66667H4.375ZM7.875 4.66667V12.1667H9.625V4.66667H7.875Z" fill="#FF0000"/>
                                </svg>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}