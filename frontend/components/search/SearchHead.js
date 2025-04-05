export default function SearchHead({specialty, location, ensurance, sex, count}) { 
    return(
        <div className="w-auto h-auto px-16 py-[21px] bg-gradient-to-r from-[#293241] to-[#3d5a80] flex-col justify-center items-center gap-2.5 flex overflow-hidden
        s:px-16 xs:px-2">
            <div className="w-auto self-stretch justify-between items-center gap-4 flex
            xl:justify-center xl:flex-row
            lg:justify-center lg:flex-row
            md:justify-center md:flex-row
            xs:flex-col">
                <div className="justify-center w-full h-auto items-center  flex flex-wrap gap-y-1 gap-x-4
                md:w-auto">
                    <div className="flex gap-2 w-auto h-auto text-white font-['Inter'] tracking-wide text-center
                    md:text-lg sm:text-md">
                        {sex != 'both' && (sex == 'M' ? <b>Male </b> : <b>Female </b> )}  
                        <b>{specialty ? `${specialty}s` : 'Doctors'} </b>
                        {location && <div>in <b>{location}</b></div>} 
                        {ensurance && <div>with ensurance <b>{ensurance}</b></div>}
                    </div>
                    <div className="w-auto text-white text-xs font-medium font-['Inter'] tracking-wider text-center
                    ">({count} results)</div>
                </div>
            </div>
        </div>
    )
};