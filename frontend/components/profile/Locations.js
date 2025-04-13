import ClinicMap from "../ClinicMap";

const Location = ({ location }) => {
    return (
        <div class="w-full flex-col justify-center items-center gap-[11px] inline-flex">
            <div class="w-full text-black font-['Inter'] tracking-wide
            sm:text-lg
            xs:text-md">{location.name}</div>
            <ClinicMap clinicName={location.name} width="100%" height="400" />
            <div class="w-full flex-col justify-center items-start gap-2 flex break-all">
                <div class="w-full justify-start items-start gap-2 inline-flex">
                    <div data-svg-wrapper class="relative">
                    <svg width="15" height="22" viewBox="0 0 15 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.655 21C11.3522 15.6154 14.31 11 14.31 7.92308C14.31 6.08696 13.6089 4.32605 12.3608 3.02772C11.1127 1.72939 9.42002 1 7.655 1C5.88998 1 4.19726 1.72939 2.9492 3.02772C1.70115 4.32605 1 6.08696 1 7.92308C1 11 3.95778 15.6154 7.655 21Z" fill="#293241" stroke="black"/>
                    <path d="M10.6128 7.92263C10.6128 8.73868 10.3012 9.5213 9.74651 10.0983C9.19182 10.6754 8.4395 10.9995 7.65504 10.9995C6.87059 10.9995 6.11827 10.6754 5.56358 10.0983C5.00889 9.5213 4.69727 8.73868 4.69727 7.92263C4.69727 7.10658 5.00889 6.32395 5.56358 5.74691C6.11827 5.16988 6.87059 4.8457 7.65504 4.8457C8.4395 4.8457 9.19182 5.16988 9.74651 5.74691C10.3012 6.32395 10.6128 7.10658 10.6128 7.92263Z" fill="white" stroke="black"/>
                    </svg>
                    </div>
                    <div class="w-full text-black font-['Inter'] tracking-wide text-sm">{location.address}</div>
                </div>
                <div class="justify-start items-center gap-2 inline-flex">
                    <div data-svg-wrapper>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.9984 12.461L12.7284 11.851L10.2084 14.371C7.36983 12.9269 5.0625 10.6196 3.61844 7.78098L6.14844 5.25098L5.53844 0.000976562H0.0284377C-0.551562 10.181 7.81844 18.551 17.9984 17.971V12.461Z" fill="black"/>
                    </svg>
                    </div>
                    <div class="text-black font-['Inter'] tracking-wide
                    sm:text-sm xs:text-xs">809-898-8759</div>
                </div>
            </div>
        </div>
    );
}

export default function Locations({ clinics }) {
    return(
        <div class="flex-col justify-center items-center gap-8 flex">
            <div class="w-full p-2.5 justify-start items-end gap-2.5 inline-flex border-b border-black/50  mt-16">
                <div class="text-center text-black font-['Inter'] tracking-wide text-2xl">Locations</div>
                <div data-svg-wrapper class="relative">
                <svg width="30" height="30" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 36.25C26.25 27.5 31.25 20 31.25 15C31.25 12.0163 30.0647 9.15483 27.955 7.04505C25.8452 4.93526 22.9837 3.75 20 3.75C17.0163 3.75 14.1548 4.93526 12.045 7.04505C9.93526 9.15483 8.75 12.0163 8.75 15C8.75 20 13.75 27.5 20 36.25Z" fill="#293241" stroke="black"/>
                <path d="M25 15C25 16.3261 24.4732 17.5979 23.5355 18.5355C22.5979 19.4732 21.3261 20 20 20C18.6739 20 17.4021 19.4732 16.4645 18.5355C15.5268 17.5979 15 16.3261 15 15C15 13.6739 15.5268 12.4021 16.4645 11.4645C17.4021 10.5268 18.6739 10 20 10C21.3261 10 22.5979 10.5268 23.5355 11.4645C24.4732 12.4021 25 13.6739 25 15Z" fill="white" stroke="black"/>
                </svg>
                </div>
            </div>
            <div class="w-full justify-center items-center inline-flex gap-x-8 gap-y-12 flex-wrap
            xs:px-2 ">
                {clinics.map(c => 
                    <Location location={c} />
                )}
            </div>
        </div>
    )
}