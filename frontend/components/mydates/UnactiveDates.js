import Pagination from "../Pagination";

const Date = () => {
    return (
        <div class="w-full p-2 bg-white rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border border-black/25 justify-start items-center gap-[49px] inline-flex
        sm:p-3">
            <div class="justify-start items-center gap-[13px] flex">
                <div class="min-w-[80px] h-[80px] bg-[#d9d9d9] rounded-full"></div>
                <div class="flex-col justify-start items-start gap-1 inline-flex">
                    <div class="self-stretch text-gray-500 text-sm font-light font-['Inter'] tracking-wide">Dr. Pepe Bolenos Asyinol</div>
                    <div class="self-stretch justify-start items-center gap-x-2.5 inline-flex flex-wrap">
                        <div><span class="text-gray-500 text-xs font-extralight font-['Inter'] tracking-wide">Date: </span><span class="text-gray-500 text-sm font-light font-['Inter'] tracking-wide">dd/mm/yyy</span></div>
                        <div><span class="text-gray-500 text-xs font-extralight font-['Inter'] tracking-wide">Time: </span><span class="text-gray-500 text-sm font-light font-['Inter'] tracking-wide">00:00:00</span></div>
                        <div><span class="text-gray-500 text-xs font-extralight font-['Inter'] tracking-wide">Location: </span><span class="text-gray-500 text-sm font-light font-['Inter'] tracking-wide">Centro Medico Moderno</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function UnactiveDates() {
  return (
        <div class="self-stretch flex-col justify-center items-center flex">
            <div class="self-stretch text-[#3d5a80] text-xl font-['Inter'] tracking-wide">Previous dates</div>
            <div class="self-stretch py-4 p-0 flex-col justify-start items-start gap-3 flex
            sm:p-4">
                <Date/><Date/><Date/>
            </div>
            <Pagination/>
        </div>
  );
}