import Pagination from "@/components/Pagination";

const Doctor = () => {
    return (
        <div class="w-full bg-white rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] justify-between jus items-center gap-4 flex flex-wrap border border-black/25
        sm:px-4
        xs:px-2 xs:py-4">
            <div class="justify-start items-center gap-4 flex">
                <div class=" bg-[#d9d9d9] rounded-full
                sm:w-24 sm:h-24
                xs:w-16 xs:h-16"></div>
                <div class="flex-col justify-center items-start gap-1 inline-flex">
                    <div class="flex-col justify-start items-start gap-[3px] flex">
                        <div class="self-stretch py-[5px] justify-center items-center gap-2.5 inline-flex">
                            <div class=" text-[#3d5a80]  font-['Inter'] tracking-wide
                            sm:text-md
                            xs:text-sm">Dr. Pepe Bolenos Asyinol</div>
                        </div>
                        <div class="self-stretch justify-start items-center gap-2.5 inline-flex">
                            <div class="text-[#3d5a80] text-xs font-normal font-['Inter'] tracking-wide">SPECIALTY</div>
                            <div class="text-[#3d5a80] text-xs font-normal font-['Inter'] tracking-wide">SPECIALTY</div>
                        </div>
                    </div>
                    <div><span class="text-[#293241] text-xs font-normal font-['Inter'] tracking-wide">Last date:</span><span class="text-[#293241] text-sm font-['Inter'] tracking-wide"> dd-mm-yyyy</span></div>
                </div>
            </div>
            <div class="flex-col justify-start items-center gap-2 inline-flex">
                <div class="self-stretch px-2 py-1.5 rounded-[10px] border-2 border-[#ee6c4d] justify-center items-center gap-2.5 inline-flex">
                    <div class="w-auto text-[#ee6c4d] font-['Inter'] tracking-wide
                    sm:text-base
                    xs:text-sm">Make date</div>
                </div>
                <div class="self-stretch px-2 py-1.5 bg-[#ee6c4d] rounded-[10px] border border-[#ee6c4d] justify-center items-center gap-2.5 inline-flex">
                    <div class="text-white  font-['Inter'] tracking-wide
                    sm:text-base
                    xs:text-sm">Remove </div>
                </div>
            </div>
        </div>
    );
}

export default function FavouriteDoctors() {
    return (
        <div class="w-full flex-col justify-center items-center gap-4 inline-flex">
            <div className="w-full max-w-3xl  flex flex-col justify-center items-center gap-4
            sm:px-4
            xs:px-2">
                <div class="self-stretch w-full text-[#293241] text-xl font-['Inter'] tracking-wide">Favourite doctors</div>
                <div class="self-stretch w-full flex-col justify-start items-center gap-3 flex">
                    <Doctor/>
                    <Doctor/>
                    <Pagination/>
                </div>                
            </div>

        </div>
    )
}