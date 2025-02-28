export default function SearchBar(){
    return(
        <div class="w-full   h-[626px] flex-col justify-center items-center gap-[50px] inline-flex">
            <div class="w-[601px] h-[153px] bg-white/0 rounded-[15px] flex-col justify-start items-center gap-10 inline-flex">
                <div class="h-[75px] text-center text-[#293241] text-[62px] font-normal font-['Inter'] tracking-[6.20px] [text-shadow:_0px_4px_4px_rgb(0_0_0_/_0.25)]">Find your doctor</div>
                <div class="text-center text-black text-base font-normal font-['Inter']">Doctify is your doctor search and appointment booking web app designed to simplify access to healthcare in the Dominican Republic. </div>
            </div>
            <div class="w-full max-w-4xl h-14 rounded-[10px] border-1 border-black justify-center items-start inline-flex">
                <input placeholder="Specialty" class="max-w-3xs h-full  p-4 w-full bg-white rounded-tl-[10px] rounded-bl-[10px] border border-black focus:outline-none text-black placeholder-gray-400 justify-start items-center gap-2.5 inline-flex">
                </input>
                <input placeholder="City" class="h-full p-4 w-full border border-black focus:outline-none text-black placeholder-gray-400 bg-white justify-start items-center gap-2.5 inline-flex">
                </input>
                <button class="h-full py-2.5 w-full bg-[#293241] rounded-tr-[10px] rounded-br-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border border-black justify-center items-center gap-2.5 inline-flex">
                Search
                </button>
            </div>
        </div>
    )
}