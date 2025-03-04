export default function Pagination (){
    return(
        <div class="self-stretch py-4 justify-center items-center gap-4 inline-flex">
            <div data-svg-wrapper>
            <svg width="12" height="22" viewBox="0 0 14 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5 1L1.5 12L12.5 23" stroke="#EE6C4D" stroke-width="2"/>
            </svg>
            </div>
            <div class=" h-[18px] text-[#ee6c4d] text-xs font-normal font-['Inter']">Page 1 of 7</div>
            <div data-svg-wrapper>
            <svg width="12" height="22" viewBox="0 0 14 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.5 1L12.5 12L1.5 23" stroke="#EE6C4D" stroke-width="2"/>
            </svg>
            </div>
        </div>
    );
}