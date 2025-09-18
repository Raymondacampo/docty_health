import { UserCircleIcon } from "@heroicons/react/24/outline";

type DoctorProps = {
  doctor: {
    id: number;
    user: {
      first_name: string;
      last_name: string;
      profile_picture: string;
    };
    specialties: { name: string }[];
  };
  onRemove: (doctorId: number) => void;
};

const Doctor = ({ doctor, onRemove }: DoctorProps) => {
    // const backendBaseUrl = getApiImgUrl();
  return (
    <div className="w-full bg-white rouded-sm shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] justify-between items-center gap-4 flex flex-wrap sm:px-4 xs:px-2 py-4">
      <div className="justify-start items-center sm:gap-4 flex">
        {/* <img src={`${backendBaseUrl}${doctor.user.profile_picture}`} className="bg-[#d9d9d9] rounded-full sm:w-24 sm:h-24 xs:w-16 xs:h-16"></img> */}
        <div className="flex-col justify-center items-start inline-flex">
          <div className="justify-start items-center gap-2 flex">
            <UserCircleIcon
                className="w-[105px] h-[105px] text-gray-400 rounded-full object-cover object-center"
                aria-hidden="true"
            />
            <div className="flex flex-col justify-start items-start gap-1">
                <div className="self-stretch py-[5px] justify-center items-center gap-2.5 inline-flex">
                <div className="text-black font-semibold tracking-wide text-lg">
                    Dr. {doctor.user.first_name} {doctor.user.last_name}
                </div>
                </div>
                <div className="self-stretch justify-start items-center gap-2.5 inline-flex">
                {doctor.specialties.map((specialty, index) => (
                    <div
                    key={index}
                    className="text-[#3d5a80] text-xs font-normal tracking-wide"
                    >
                    {specialty.name}
                    </div>
                ))}
                </div>                
            </div>

          </div>
        </div>
      </div>
      <div className="sm:flex-col w-full px-4 sm:px-0 sm:w-[150px] justify-start items-center gap-x-4 gap-y-2 inline-flex">
          <a href={`/profile/${doctor.id}`} className="self-stretch w-full py-1.5 rounded-md bg-gray-100 items-center gap-2.5 inline-flex justify-center">
            <div className="text-[#060648] tracking-wide justify-center items-center">
              View profile
            </div>
          </a>
        <button
          onClick={() => onRemove(doctor.id)}
          className="self-stretch w-full py-1.5 bg-[#060648] rounded-md justify-center items-center gap-2.5 inline-flex"
        >
          <div className="text-white w-full tracking-wide">
            Remove
          </div>
        </button>
      </div>
    </div>
  );
};

export default Doctor;