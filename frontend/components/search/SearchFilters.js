const Sb = () => {
    return(
        <>        
        <input placeholder='cardiologist' class="self-stretch p-2.5 rounded-[5px] border border-black justify-start items-center gap-2.5 inline-flex"></input>
        </>
    )
}

export default function SearchFilters(){
    return(
        <div class="w-80 p-4 bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex-col justify-start items-start gap-5 inline-flex">
            <div class="self-stretch h-[404px] flex-col justify-start items-start gap-[21px] flex">
                <div class="self-stretch h-[31px] text-[#060648] text-2xl font-bold font-['Inter'] tracking-wider">Search filters</div>
                <div class="self-stretch h-[352px] flex-col justify-start items-start gap-5 flex">
                    <div class="self-stretch h-[73px] pl-2.5 flex-col justify-start items-start gap-2.5 flex">
                        <div class="self-stretch h-6 text-black text-lg font-medium font-['Inter'] tracking-wide">Speciality<br/></div>
                        <Sb/>
                    </div>
                    <div class="self-stretch h-[73px] pl-2.5 flex-col justify-start items-start gap-2.5 flex">
                        <div class="self-stretch h-6 text-black text-lg font-medium font-['Inter'] tracking-wide">City</div>
                        <Sb/>
                    </div>
                    <div class="self-stretch h-[73px] pl-2.5 flex-col justify-start items-start gap-2.5 flex">
                        <div class="self-stretch h-6 text-black text-lg font-medium font-['Inter'] tracking-wide">Ensurance<br/></div>
                        <Sb/>
                    </div>
                    <div class="self-stretch h-[73px] pl-2.5 flex-col justify-start items-start gap-2.5 flex">
                        <div class="self-stretch h-6 text-black text-lg font-medium font-['Inter'] tracking-wide">Clinic<br/></div>
                        <Sb/>
                    </div>
                </div>
            </div>
            <div class="self-stretch h-[135px] flex-col justify-start items-start gap-[15px] flex">
                <div class="self-stretch h-[31px] text-[#060648] text-2xl font-bold font-['Inter'] tracking-wider">Sex</div>
                <div class="self-stretch h-[89px] pl-2.5 flex-col justify-start items-start gap-2.5 flex">
                    <div class="justify-start items-center gap-[9px] inline-flex">
                        <div class="w-5 h-5 rounded-full border border-black"></div>
                        <div class="w-12 h-[23px] text-black text-base font-medium font-['Inter'] tracking-wide">Male</div>
                    </div>
                    <div class="self-stretch justify-start items-center gap-[9px] inline-flex">
                        <div class="w-5 h-5 rounded-full border border-black"></div>
                        <div class="w-[68px] h-[23px] text-black text-base font-medium font-['Inter'] tracking-wide">Female</div>
                    </div>
                    <div class="justify-start items-center gap-[9px] inline-flex">
                        <div class="w-5 h-5 bg-[#ee6c4d] rounded-full border-4 border-black"></div>
                        <div class="w-12 h-[23px] text-black text-base font-medium font-['Inter'] tracking-wide">Both<br/></div>
                    </div>
                </div>
            </div>
            <div class="self-stretch h-[133px] flex-col justify-start items-start gap-[15px] flex">
                <div class="self-stretch text-[#060648] text-2xl font-bold font-['Inter'] tracking-wide">Meeting method</div>
                <div class="h-[89px] pl-2.5 flex-col justify-start items-start gap-2.5 flex">
                    <div class="justify-start items-center gap-[9px] inline-flex">
                        <div class="w-5 h-5 rounded-full border border-black"></div>
                        <div class="w-[142px] h-[23px] text-black text-base font-medium font-['Inter'] tracking-wide">Dates via Doctify</div>
                    </div>
                    <div class="self-stretch justify-start items-center gap-[9px] inline-flex">
                        <div class="w-5 h-5 rounded-full border border-black"></div>
                        <div class="w-[88px] h-[23px] text-black text-base font-medium font-['Inter'] tracking-wide">In person</div>
                    </div>
                    <div class="justify-start items-center gap-[9px] inline-flex">
                        <div class="w-5 h-5 rounded-full border border-black"></div>
                        <div class="w-[77px] h-[23px] text-black text-base font-medium font-['Inter'] tracking-wide">Virtually<br/></div>
                    </div>
                </div>
            </div>
        </div>
    )
}