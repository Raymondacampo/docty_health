export default function SearchBar(){
    return(
        <div class="w-[90%] h-auto pt-24 pb-32 ml-auto mr-auto flex-col justify-center items-center gap-16 flex
        xl:pt-48 xl:pb-48
        lg:pt-48 lg:pb-48
        md:pt-36 md:pb-36
        sm:pt-36">
            <div class="w-auto h-auto bg-white/0 rounded-[15px] flex-col justify-start items-center gap-8 inline-flex">
                <div class="h-auto   text-center text-[#293241] text-4xl font-normal font-['Inter'] tracking-[1px] [text-shadow:_0px_4px_4px_rgb(0_0_0_/_0.25)]
                xl:text-6xl xl:tracking-[6.20px]
                lg:text-6xl lg:tracking-[3.20px]
                md:text-5xl md:tracking-[3.20px]
                sm:text-5xl">Find your doctor</div>
                <div class="text-center w-[90%] max-w-4xl text-black text-sm font-thin font-['Inter'] tracking-[0.5px]
                xl:text-lg lg:text-lg md:text-lg">Doctify is your doctor search and appointment booking web app designed to simplify access to healthcare in the Dominican Republic. </div>
            </div>
            <div class="w-[100%] max-w-4xl h-auto rounded-[10px] border border-black justify-center flex-col items-start flex gap-4 p-4
            xl:flex-row xl:gap-0 xl:p-0 xl:border-0 xl:w-[90%]
            lg:flex-row lg:gap-0 lg:p-0 lg:border-0 lg:w-[90%]
            md:flex-row md:gap-0 md:p-0 md:border-0
            sm:flex-row sm:gap-0 sm:p-0 sm:border-0">
                <input placeholder="Specialty" class="max-w-3xs p-4 w-full bg-white border rounded-[10px] border-black focus:outline-none text-black placeholder-gray-400 justify-start items-center gap-2.5 inline-flex
                xl:rounded-tl-[10px] xl:rounded-bl-[10px] xl:rounded-tr-[0px] xl:rounded-br-[0px]
                lg:rounded-tl-[10px] lg:rounded-bl-[10px] lg:rounded-tr-[0px] lg:rounded-br-[0px]
                md:rounded-tl-[10px] md:rounded-bl-[10px] md:rounded-tr-[0px] md:rounded-br-[0px]
                sm:rounded-tl-[10px] sm:rounded-bl-[10px] sm:rounded-tr-[0px] sm:rounded-br-[0px]">
                </input>
                <input placeholder="City" class=" p-4 w-full border border-black rounded-[10px] focus:outline-none text-black placeholder-gray-400 bg-white justify-start items-center gap-2.5 inline-flex
                xl:rounded-[0px]
                lg:rounded-[0px]
                md:rounded-[0px]
                sm:rounded-[0px]">
                </input>
                <button class="h-[100%] p-4 w-full bg-[#293241] rounded-tr-[10px] rounded-br-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border border-black justify-center items-center gap-2.5 inline-flex">
                Search
                </button>
            </div>
        </div>
    )
}