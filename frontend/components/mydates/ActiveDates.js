const Date = () => {
    return (
        <div class="self-stretch p-2 bg-white rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border border-black/50 justify-between inline-flex gap-4 flex-wrap
        sm:p-4 xs:items-center">
            <div class="justify-start items-center gap-4 flex">
                <div class="min-w-[80px] h-[80px] bg-[#d9d9d9] rounded-full"></div>
                <div class="flex-col justify-start items-start gap-1 inline-flex">
                    <div class="self-stretch text-[#3d5a80] font-['Inter'] tracking-wide">Dr. Pepe Bolenos Asyinol</div>
                    <div class="self-stretch justify-start items-center gap-x-2.5 inline-flex flex-wrap">
                        <div><span class="text-[#293241] text-xs font-normal font-['Inter'] tracking-wide">Date:</span><span class="text-[#293241] text-sm font-['Inter'] tracking-wide"> dd/mm/yyy</span></div>
                        <div><span class="text-[#293241] text-xs font-normal font-['Inter'] tracking-wide">Time:</span><span class="text-[#293241] text-sm font-['Inter'] tracking-wide"> 00:00:00</span></div>
                        <div><span class="text-[#293241] text-xs font-normal font-['Inter'] tracking-wide">Location:</span><span class="text-[#293241] text-sm font-['Inter'] tracking-wide"> Centro Medico Moderno</span></div>
                    </div>
                </div>
            </div>
            <button class="px-2 py-1.5 bg-[#ee6c4d] rounded-[10px] border-2 border-[#ee6c4d] justify-center items-center gap-2.5 flex">
                <div class="text-white font-['Inter'] tracking-wide whitespace-nowrap
                sm:text-base
                    xs:text-sm">Cancel date</div>
            </button>
        </div>
    );
};

export default function ActiveDates() {
  return (
        <div class="self-stretch flex-col justify-start items-start flex">
            <div class="self-stretch text-[#3d5a80] text-xl font-['Inter'] tracking-wide">Upcoming dates</div>
            <div class="self-stretch p-0 py-4 flex-col justify-start items-start gap-4 flex
            sm:p-4">
                <Date/><Date/>
            </div>
        </div>
  );
}