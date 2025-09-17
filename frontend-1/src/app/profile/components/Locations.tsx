import ClinicMap from "../ui/ClinicMap";

type LocationType = {
    name: string;
    address: string;
};

const Location = ({ location }: { location: LocationType }) => {
    return (
        <div className="w-full flex-col justify-center items-center gap-[11px] inline-flex">
            <div className="w-full text-black tracking-wide
            text-2xl
            ">{location.name}</div>
            <ClinicMap clinicName={location.name} width="100%" height="400" />
            <div className="w-full flex-col justify-center items-start gap-2 flex break-all">
                <div className="w-full justify-start items-start gap-2 inline-flex">
                    <div data-svg-wrapper className="relative">
                    <svg width="15" height="22" viewBox="0 0 15 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.655 21C11.3522 15.6154 14.31 11 14.31 7.92308C14.31 6.08696 13.6089 4.32605 12.3608 3.02772C11.1127 1.72939 9.42002 1 7.655 1C5.88998 1 4.19726 1.72939 2.9492 3.02772C1.70115 4.32605 1 6.08696 1 7.92308C1 11 3.95778 15.6154 7.655 21Z" fill="#293241" stroke="black"/>
                    <path d="M10.6128 7.92263C10.6128 8.73868 10.3012 9.5213 9.74651 10.0983C9.19182 10.6754 8.4395 10.9995 7.65504 10.9995C6.87059 10.9995 6.11827 10.6754 5.56358 10.0983C5.00889 9.5213 4.69727 8.73868 4.69727 7.92263C4.69727 7.10658 5.00889 6.32395 5.56358 5.74691C6.11827 5.16988 6.87059 4.8457 7.65504 4.8457C8.4395 4.8457 9.19182 5.16988 9.74651 5.74691C10.3012 6.32395 10.6128 7.10658 10.6128 7.92263Z" fill="white" stroke="black"/>
                    </svg>
                    </div>
                    <div className="w-full text-black tracking-wide text-sm">{location.address}</div>
                </div>
            </div>
        </div>
    );
}

type LocationsProps = {
    clinics: LocationType[];
};

export default function Locations({ clinics }: LocationsProps) {
    return(
        <div className="flex-col mt-16 justify-center items-center gap-8 flex">
            <div className="w-full justify-center items-center inline-flex gap-x-8 gap-y-12 flex-wrap
            xs:px-2 ">
                {clinics.map((c, index) => 
                    <Location location={c} key={index} />
                )}
            </div>
        </div>
    )
}