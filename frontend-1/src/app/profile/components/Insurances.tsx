// import { getApiImgUrl } from "@/utils/api";

type Insurance = {
    logo: string;
    name: string;
};

interface InsurancesProps {
    insurances: Insurance[];
    name: string;
}

export default function Insurances({ insurances, name }: InsurancesProps) {
    // const img_src = getApiImgUrl()
    return(
        <div className="mt-8 lg:mt-16 rounded-lg flex-col justify-start items-start gap-4 flex">
            {insurances.length > 0 &&
            <div className="w-full justify-start items-start gap-5 inline-flex flex-wrap">
                {insurances.map((e, index) => 
                    <div key={index} className="border rounded-xl w-full lg:w-auto pr-4 pl-2 justify-start items-center gap-4 flex">
                        <img src={`${e.logo}`} className="w-[75px] h-[75px] bg-[#5c5c5c]"></img>
                        <div className="text-center text-[#293241] text-base font-normal tracking-wide">{e.name}</div>
                    </div>
                )}
            </div>            
            }

            <div className="justify-center items-center gap-2.5 inline-flex">
                <p className=" text-[#3d5a80] text-sm tracking-wide">In order to confirm that Dr. {name} works with your insurance plan, please contact him.</p>
            </div>
        </div>
    );
}