export default function SearchBar(){
    return(
        <div className="w-[90%] h-auto pt-24 pb-32 ml-auto mr-auto flex-col justify-center items-center gap-16 flex
        xl:pt-42 xl:pb-48
        lg:pt-42 lg:pb-48
        md:pt-36 md:pb-36
        sm:pt-36">
            <div className="w-auto h-auto bg-white/0 rounded-[15px] flex-col justify-start items-center gap-8 inline-flex">
                <div className="h-auto   text-center text-[#293241] text-4xl font-normal font-['Inter'] tracking-[1px] [text-shadow:_0px_4px_4px_rgb(0_0_0_/_0.25)]
                xl:text-6xl xl:tracking-[6.20px]
                lg:text-6xl lg:tracking-[3.20px]
                md:text-5xl md:tracking-[3.20px]
                sm:text-5xl">Find your doctor</div>
                <div className="text-center w-[90%] max-w-4xl text-black text-sm font-thin font-['Inter'] tracking-[0.5px]
                xl:text-lg lg:text-lg md:text-lg">Doctify is your doctor search and appointment booking web app designed to simplify access to healthcare in the Dominican Republic. </div>
            </div>
            <div className="w-[100%] max-w-4xl h-auto border-black justify-center flex-col items-start flex gap-4 p-4
            xl:flex-row xl:gap-0 xl:p-0 xl:w-[90%]
            lg:flex-row lg:gap-0 lg:p-0 lg:w-[90%]
            md:flex-row md:gap-0 md:p-0 
            sm:flex-row sm:gap-0 sm:p-0 sm:border  sm:rounded-full 
            xs:rounded-lg xs:shadow-[0px_2px_4px_0px_rgba(0,0,0,0.5)] xs:border-0">
                <input placeholder="Specialty" className="max-w-3xs p-4 w-full bg-white rounded-[10px] focus:outline-none text-black placeholder-gray-400 justify-start items-center gap-2.5 inline-flex
                sm:rounded-tl-full sm:rounded-bl-full sm:rounded-tr-[0px] sm:rounded-br-[0px] sm:p-4 sm:border-r sm:border-0
                xs:p-3 xs:border xs:border-black/45">
                </input>
                <input placeholder="City" className=" p-4 w-full rounded-[10px] focus:outline-none text-black placeholder-gray-400 bg-white justify-start items-center gap-2.5 inline-flex
                xl:rounded-[0px]
                lg:rounded-[0px]
                md:rounded-[0px]
                sm:rounded-[0px] sm:p-4 sm:border-0
                xs:p-3 xs:border xs:border-black/45">
                </input>
                <button className="h-[100%] w-full bg-[#293241] shadow-[-2px_2px_4px_0px_rgba(0,0,0,0.5)] border border-black justify-center items-center gap-2.5 inline-flex
                sm:py-4 
                xs:py-2 xs:rounded-full">
                Search
                </button>
            </div>
        </div>
    )
}