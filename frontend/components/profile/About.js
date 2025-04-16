import { getApiImgUrl } from "@/utils/api";
import AverageRatingStars from "./components/AverageRatingStar";
import FavoriteButton from "./components/FavouriteButton";

export default function About({ doctor, averageRating, reviewCount }) {
    const backendBaseUrl = getApiImgUrl();
    return(    
        <div class="w-full flex-col justify-start items-center gap-[52px] flex">
            <div className="w-full flex justify-between 
            lg:flex-nowrap md:flex-row
            md:flex-wrap sm:gap-4
            xs:flex-col xs:gap-6">
                <div class=" gap-4 flex
                sm:flex-row sm:w-auto sm:min-w-[450px]
                xs:flex-col xs:w-full xs:items-center">
                    <img src={`${backendBaseUrl}${doctor.user.profile_picture}`} class="min-w-[150px] min-h-[150px] max-w-[150px] max-h-[150px] bg-[#d9d9d9] rounded-full"></img>
                    <div class=" flex-col justify-start items-start gap-4 inline-flex">
                        <div class="w-full  flex-col justify-start items-start flex xs:justify-center">
                            <div class="w-full pt-1.5 gap-2.5 inline-flex sm:justify-start xs:justify-center">
                                <div class="text-[#293241] font-['Inter'] tracking-wide text-2xl text-center">Dr. {doctor.user.first_name} {doctor.user.last_name}</div>
                            </div>
                            <div class="w-full  items-center gap-2.5 inline-flex sm:justify-start xs:justify-center">
                                {doctor.specialties.map(s =>
                                    <div class="text-[#293241] font-['Inter'] tracking-wide text-sm">{s.name}</div>
                                )}
                            </div>
                        </div>
                        {/* <div class="justify-start items-start gap-1.5 inline-flex flex-col ">
                            {doctor.clinics.map(c => 
                            <div className="flex gap-2 items-center">
                                <div data-svg-wrapper class="relative">
                                    <svg width="12" height="16" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8 18.5C11.8889 13.6538 15 9.5 15 6.73077C15 5.07827 14.2625 3.49345 12.9497 2.32495C11.637 1.15645 9.85652 0.5 8 0.5C6.14348 0.5 4.36301 1.15645 3.05025 2.32495C1.7375 3.49345 1 5.07827 1 6.73077C1 9.5 4.11111 13.6538 8 18.5Z" fill="#3D5A80" stroke="#3D5A80"/>
                                        <path d="M11.1109 6.73114C11.1109 7.46559 10.7831 8.16995 10.1997 8.68929C9.61622 9.20862 8.8249 9.50037 7.99978 9.50037C7.17466 9.50037 6.38334 9.20862 5.79989 8.68929C5.21645 8.16995 4.88867 7.46559 4.88867 6.73114C4.88867 5.9967 5.21645 5.29233 5.79989 4.773C6.38334 4.25367 7.17466 3.96191 7.99978 3.96191C8.8249 3.96191 9.61622 4.25367 10.1997 4.773C10.7831 5.29233 11.1109 5.9967 11.1109 6.73114Z" fill="white" stroke="#3D5A80"/>
                                    </svg>
                                </div>
                                <div class=" text-[#3d5a80] font-['Inter'] tracking-wide text-wrap text-sm">{c.city}, {c.state }</div>                              
                            </div>
                            )}
                        </div> */}
                        <div className="flex gap-4 items-center justify-center flex-wrap">
                            <div className="flex gap-2 items-center justify-center sm:w-auto xs:w-full"> 
                                <AverageRatingStars averageRating={averageRating} />
                                <div class="text-[#293241] font-['Inter'] tracking-wide text-xs">( {reviewCount} reviews )</div>                                
                            </div>
                            <FavoriteButton doctorId={doctor.id} isFavoritedInitially={doctor.isFavoritedInitially}/>
                        </div>
                    </div>
                </div>
                <div class="justify-center items-center gap-[74px] flex lg:w-auto xs:w-full">
                    <div class="w-full py-4 bg-[#3d5a80] rounded-[10px] flex-col justify-center items-start gap-4 inline-flex text-wrap break-all sm:px-8 xs:px-4">
                        <div class=" justify-start items-center gap-2.5 inline-flex">
                            <div class="text-white text-xl font-['Inter'] tracking-wide">Contact info</div>
                        </div>
                        <div class="w-full justify-start items-center gap-2.5 inline-flex">
                            <div data-svg-wrapper>
                            <svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 16.5C1.45 16.5 0.979333 16.3043 0.588 15.913C0.196667 15.5217 0.000666667 15.0507 0 14.5V2.5C0 1.95 0.196 1.47933 0.588 1.088C0.98 0.696666 1.45067 0.500667 2 0.5H18C18.55 0.5 19.021 0.696 19.413 1.088C19.805 1.48 20.0007 1.95067 20 2.5V14.5C20 15.05 19.8043 15.521 19.413 15.913C19.0217 16.305 18.5507 16.5007 18 16.5H2ZM18 4.5L10.525 9.175C10.4417 9.225 10.3543 9.26267 10.263 9.288C10.1717 9.31333 10.084 9.32567 10 9.325C9.916 9.32433 9.82867 9.312 9.738 9.288C9.64733 9.264 9.55967 9.22633 9.475 9.175L2 4.5V14.5H18V4.5ZM10 7.5L18 2.5H2L10 7.5ZM2 4.75V3.275V3.3V3.288V4.75Z" fill="white"/>
                            </svg>
                            </div>
                            <div class="text-white font-['Inter'] tracking-wide font-bold text-sm">{doctor.user.email}</div>
                        </div>
                        {/* {doctor.user.phone_number && 
                        <>
                            <div class="justify-start items-center gap-2.5 inline-flex">
                                <div data-svg-wrapper>
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.9984 12.461L12.7284 11.851L10.2084 14.371C7.36983 12.9269 5.0625 10.6196 3.61844 7.78098L6.14844 5.25098L5.53844 0.000976562H0.0284377C-0.551562 10.181 7.81844 18.551 17.9984 17.971V12.461Z" fill="white"/>
                                </svg>
                                </div>
                                <div class="h-5 text-white font-['Inter'] tracking-wide font-bold text-sm">{doctor.user.phone_number}</div>
                            </div>     

                            <div class="justify-start items-start gap-2.5 inline-flex bg-white pl-1 pr-4 py-1.5 rounded-md">
                                <div data-svg-wrapper>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17 2.91005C16.0831 1.98416 14.991 1.25002 13.7875 0.750416C12.584 0.250812 11.2931 -0.00426317 9.99 5.38951e-05C4.53 5.38951e-05 0.0800002 4.45005 0.0800002 9.91005C0.0800002 11.6601 0.54 13.3601 1.4 14.8601L0 20.0001L5.25 18.6201C6.7 19.4101 8.33 19.8301 9.99 19.8301C15.45 19.8301 19.9 15.3801 19.9 9.92005C19.9 7.27005 18.87 4.78005 17 2.91005ZM9.99 18.1501C8.51 18.1501 7.06 17.7501 5.79 17.0001L5.49 16.8201L2.37 17.6401L3.2 14.6001L3 14.2901C2.17755 12.9771 1.74092 11.4593 1.74 9.91005C1.74 5.37005 5.44 1.67005 9.98 1.67005C12.18 1.67005 14.25 2.53005 15.8 4.09005C16.5676 4.85392 17.1759 5.7626 17.5896 6.76338C18.0033 7.76417 18.2142 8.83714 18.21 9.92005C18.23 14.4601 14.53 18.1501 9.99 18.1501ZM14.51 11.9901C14.26 11.8701 13.04 11.2701 12.82 11.1801C12.59 11.1001 12.43 11.0601 12.26 11.3001C12.09 11.5501 11.62 12.1101 11.48 12.2701C11.34 12.4401 11.19 12.4601 10.94 12.3301C10.69 12.2101 9.89 11.9401 8.95 11.1001C8.21 10.4401 7.72 9.63005 7.57 9.38005C7.43 9.13005 7.55 9.00005 7.68 8.87005C7.79 8.76005 7.93 8.58005 8.05 8.44005C8.17 8.30005 8.22 8.19005 8.3 8.03005C8.38 7.86005 8.34 7.72005 8.28 7.60005C8.22 7.48005 7.72 6.26005 7.52 5.76005C7.32 5.28005 7.11 5.34005 6.96 5.33005H6.48C6.31 5.33005 6.05 5.39005 5.82 5.64005C5.6 5.89005 4.96 6.49005 4.96 7.71005C4.96 8.93005 5.85 10.1101 5.97 10.2701C6.09 10.4401 7.72 12.9401 10.2 14.0101C10.79 14.2701 11.25 14.4201 11.61 14.5301C12.2 14.7201 12.74 14.6901 13.17 14.6301C13.65 14.5601 14.64 14.0301 14.84 13.4501C15.05 12.8701 15.05 12.3801 14.98 12.2701C14.91 12.1601 14.76 12.1101 14.51 11.9901Z" fill="#3d5a80"/>
                                </svg>
                                </div>
                                <a href={`https://wa.me/${doctor.user.phone_number}`} class=" text-[#3d5a80] font-['Inter'] tracking-wide text-sm ">Whatsapp</a>
                            </div>                         
                        </>           
                        } */}
                        {doctor.cities.map(c => 
                            <div className="flex gap-2 items-center">
                                <div data-svg-wrapper class="relative">
                                    <svg width="12" height="16" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8 18.5C11.8889 13.6538 15 9.5 15 6.73077C15 5.07827 14.2625 3.49345 12.9497 2.32495C11.637 1.15645 9.85652 0.5 8 0.5C6.14348 0.5 4.36301 1.15645 3.05025 2.32495C1.7375 3.49345 1 5.07827 1 6.73077C1 9.5 4.11111 13.6538 8 18.5Z" fill="white" stroke="white"/>
                                        <path d="M11.1109 6.73114C11.1109 7.46559 10.7831 8.16995 10.1997 8.68929C9.61622 9.20862 8.8249 9.50037 7.99978 9.50037C7.17466 9.50037 6.38334 9.20862 5.79989 8.68929C5.21645 8.16995 4.88867 7.46559 4.88867 6.73114C4.88867 5.9967 5.21645 5.29233 5.79989 4.773C6.38334 4.25367 7.17466 3.96191 7.99978 3.96191C8.8249 3.96191 9.61622 4.25367 10.1997 4.773C10.7831 5.29233 11.1109 5.9967 11.1109 6.73114Z" fill="#3D5A80" stroke="#3D5A80"/>
                                    </svg>
                                </div>
                                <div class=" text-white font-['Inter'] tracking-wide text-wrap text-sm">{c}</div>                              
                            </div>
                            )}
                    </div>
                </div>            
            </div>

                <div class=" p-2.5 justify-center items-start gap-2.5 inline-flex flex-col">
                    <div className="text-black font-bold text-lg">{doctor.experience} years of experience</div>
                    <div class="grow shrink basis-0 text-[#293241] font-normal font-['Inter'] tracking-wide text-base">{doctor.description}</div>
                </div>
        </div>
    );
}