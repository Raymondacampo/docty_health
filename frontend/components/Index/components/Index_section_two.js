const About_us = () => {
    return (
        <div className="w-full h-auto py-24 justify-center items-center gap-[67px] inline-flex">
        <div className="h-auto w-full p-8 bg-white justify-center items-center gap-16 flex flex-col
        xl:flex-row xl:p-11
        lg:flex-row lg:p-11
        md:flex-row md:p-11">
            <img src="images/about_resized.png" className=" max-w-lg rounded-md bg-[#d9d9d9] shadow-[0px_5px_15px_2px_rgba(0,0,0,0.5)]
            sm:w-[90%] xs:w-full"></img>
            {/* <div className="w-full max-w-sm h-[307px] bg-[#d9d9d9] shadow-[-20px_25px_2px_2px_rgba(0,0,0,0.5)]
            xs:shadow-[-20px_25px_10px_2px_rgba(0,0,0,0.15)]"></div> */}
            <div className="h-auto max-w-md flex-col justify-center items-start gap-4 inline-flex">
                <div className="text-black text-2xl font-bold font-['Inter'] tracking-wide">Who we are</div>
                <div className="text-black text-base font-['Inter'] tracking-wide">DoctyHealth has a story th is a story about the story of DoctyHealth and is really interesting</div>
                <button className="h-11 p-2.5 rounded-[5px] border border-black justify-center items-center gap-2.5 inline-flex">
                    <a href="/about" className="text-center text-black text-xl font-bold font-['Inter'] tracking-wide">About us</a>
                </button>
            </div>
        </div>
    </div>
    )
}
export default About_us;