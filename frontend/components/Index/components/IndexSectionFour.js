export default function JoinUs() {
    return (
        <div className="w-[90%] py-[50px] pb-[50px] flex-col justify-center items-center gap-[30px] flex m-auto">
            <div className="text-center text-black text-2xl font-bold font-['Inter'] tracking-wide">Ready to Find the Right Doctor?</div>
            <div className="flex-col justify-start items-center gap-[22px] inline-flex">
                <div className="text-center text-black text-base font-normal font-['Inter'] tracking-wide">Join thousands of users who trust DoctyHealth for their healthcare needs.</div>
            </div>
            <button className="px-4 py-2 bg-[#060648] rounded-[10px] border border-black justify-center items-center gap-2.5 inline-flex">
                <a href="/signup" className="text-center text-white text-2xl font-normal font-['Inter'] tracking-wide">Get started</a>
            </button>
        </div>
    )
}