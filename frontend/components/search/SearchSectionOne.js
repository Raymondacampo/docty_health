export default function SearchHead(){
    return(
        <div className="w-full h-auto px-20 py-[21px] bg-gradient-to-r from-[#293241] to-[#3d5a80] flex-col justify-center items-center gap-2.5 flex overflow-hidden">
            <div className="self-stretch h-[49px] justify-center items-center gap-[19px] inline-flex">
                <div className="w-[278px] self-stretch p-2.5 bg-white rounded-[10px] border border-black justify-between items-center flex">
                    <input placeholder='Cardiologist' className="text-black text-base font-normal font-['Inter']"></input>
                    <div data-svg-wrapper>
                    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.42505 13.7124C5.60838 13.7124 4.07105 13.0831 2.81305 11.8244C1.55505 10.5657 0.925716 9.0284 0.925049 7.2124C0.924383 5.3964 1.55372 3.85907 2.81305 2.6004C4.07238 1.34174 5.60972 0.712402 7.42505 0.712402C9.24038 0.712402 10.778 1.34174 12.038 2.6004C13.298 3.85907 13.927 5.3964 13.925 7.2124C13.925 7.94574 13.8084 8.6374 13.575 9.2874C13.3417 9.9374 13.025 10.5124 12.625 11.0124L18.225 16.6124C18.4084 16.7957 18.5 17.0291 18.5 17.3124C18.5 17.5957 18.4084 17.8291 18.225 18.0124C18.0417 18.1957 17.8084 18.2874 17.525 18.2874C17.2417 18.2874 17.0084 18.1957 16.825 18.0124L11.225 12.4124C10.725 12.8124 10.15 13.1291 9.50005 13.3624C8.85005 13.5957 8.15838 13.7124 7.42505 13.7124ZM7.42505 11.7124C8.67505 11.7124 9.73772 11.2751 10.613 10.4004C11.4884 9.52574 11.9257 8.46307 11.925 7.2124C11.9244 5.96174 11.487 4.8994 10.613 4.0254C9.73905 3.1514 8.67638 2.71374 7.42505 2.7124C6.17372 2.71107 5.11138 3.14874 4.23805 4.0254C3.36472 4.90207 2.92705 5.9644 2.92505 7.2124C2.92305 8.4604 3.36072 9.52307 4.23805 10.4004C5.11538 11.2777 6.17772 11.7151 7.42505 11.7124Z" fill="black"/>
                    </svg>
                    </div>
                </div>
                <div className="justify-center h-auto items-center gap-4 flex ">
                    <div className="w-auto h-auto text-white text-2xl font-medium font-['Inter'] tracking-wide whitespace-nowrap">Cardiologists in Santo Domingo</div>
                    <div className="w-auto text-white text-base font-bold font-['Inter'] tracking-wide whitespace-nowrap">( 4 results )</div>
                </div>
            </div>
        </div>
    )
};