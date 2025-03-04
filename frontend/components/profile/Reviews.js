const Star = () => {
    return (
        <div data-svg-wrapper>
            <svg width="102" height="17" viewBox="0 0 102 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.165 13.2645L9 11.5645L11.835 13.2868L11.0925 10.0658L13.59 7.91842L10.305 7.62763L9 4.58553L7.695 7.60526L4.41 7.89605L6.9075 10.0658L6.165 13.2645ZM3.4425 17L4.905 10.7145L0 6.48684L6.48 5.92763L9 0L11.52 5.92763L18 6.48684L13.095 10.7145L14.5575 17L9 13.6671L3.4425 17Z" fill="black"/>
            <path d="M27.165 13.2645L30 11.5645L32.835 13.2868L32.0925 10.0658L34.59 7.91842L31.305 7.62763L30 4.58553L28.695 7.60526L25.41 7.89605L27.9075 10.0658L27.165 13.2645ZM24.4425 17L25.905 10.7145L21 6.48684L27.48 5.92763L30 0L32.52 5.92763L39 6.48684L34.095 10.7145L35.5575 17L30 13.6671L24.4425 17Z" fill="black"/>
            <path d="M48.165 13.2645L51 11.5645L53.835 13.2868L53.0925 10.0658L55.59 7.91842L52.305 7.62763L51 4.58553L49.695 7.60526L46.41 7.89605L48.9075 10.0658L48.165 13.2645ZM45.4425 17L46.905 10.7145L42 6.48684L48.48 5.92763L51 0L53.52 5.92763L60 6.48684L55.095 10.7145L56.5575 17L51 13.6671L45.4425 17Z" fill="black"/>
            <path d="M69.165 13.2645L72 11.5645L74.835 13.2868L74.0925 10.0658L76.59 7.91842L73.305 7.62763L72 4.58553L70.695 7.60526L67.41 7.89605L69.9075 10.0658L69.165 13.2645ZM66.4425 17L67.905 10.7145L63 6.48684L69.48 5.92763L72 0L74.52 5.92763L81 6.48684L76.095 10.7145L77.5575 17L72 13.6671L66.4425 17Z" fill="black"/>
            <path d="M90.165 13.2645L93 11.5645L95.835 13.2868L95.0925 10.0658L97.59 7.91842L94.305 7.62763L93 4.58553L91.695 7.60526L88.41 7.89605L90.9075 10.0658L90.165 13.2645ZM87.4425 17L88.905 10.7145L84 6.48684L90.48 5.92763L93 0L95.52 5.92763L102 6.48684L97.095 10.7145L98.5575 17L93 13.6671L87.4425 17Z" fill="black"/>
            </svg>
        </div>
    )
}

const StarBar = () => {
    return(
        <div class="w-full justify-start items-center gap-1 inline-flex">
            <div class="w-[90%] h-[17px] justify-start items-center gap-4 flex">
                <Star />
                <div class="w-full max-w-xl h-3.5 bg-white rounded-[15px] border border-black
                xl:min-w-xl
                lg:w-lg
                md:w-md
                sm:w-sm
                xs:w-xs"></div>
            </div>
            <div class="text-center text-black text-xs font-normal font-['Inter'] tracking-wide">review count</div>
        </div>
    )
}

const TotalRating = ({rating}) => {
    return(
        <div class="w-full max-w-[450px] p-4 bg-[#98c1d1]/20 rounded-[10px] border border-black flex-col justify-start items-start gap-4 inline-flex">
            <div class="justify-start items-center gap-4 inline-flex">
                <div class="justify-start items-center gap-2 flex">
                    <div data-svg-wrapper>
                    <svg width="35" height="35" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.4997 37.1803L10.5322 44.7701C10.1805 44.9525 9.8541 45.0263 9.55299 44.9917C9.25407 44.9548 8.96285 44.8463 8.67932 44.6662C8.39359 44.4816 8.1782 44.2207 8.03314 43.8837C7.88808 43.5467 7.87489 43.1785 7.99358 42.7792L11.1783 28.5483L0.644895 18.9572C0.348179 18.7033 0.152566 18.3997 0.0580559 18.0465C-0.0364538 17.6934 -0.0155736 17.3552 0.120696 17.032C0.256966 16.7089 0.438293 16.4434 0.664677 16.2357C0.893258 16.0348 1.20097 15.8986 1.5878 15.8271L15.4873 14.5529L20.9073 1.07684C21.0568 0.695964 21.2722 0.421271 21.5535 0.252762C21.8349 0.084254 22.1503 0 22.4997 0C22.8492 0 23.1657 0.084254 23.4492 0.252762C23.7327 0.421271 23.947 0.695964 24.0921 1.07684L29.5121 14.5529L43.4083 15.8271C43.7974 15.8963 44.1062 16.0337 44.3348 16.2391C44.5633 16.4423 44.7458 16.7066 44.882 17.032C45.0161 17.3552 45.0359 17.6934 44.9414 18.0465C44.8469 18.3997 44.6513 18.7033 44.3545 18.9572L33.8211 28.5483L37.0059 42.7792C37.1289 43.1739 37.1169 43.5409 36.9696 43.8803C36.8223 44.2196 36.6058 44.4804 36.3201 44.6628C36.0388 44.8474 35.7476 44.9571 35.4465 44.9917C35.1475 45.0263 34.8223 44.9525 34.4706 44.7701L22.4997 37.1803Z" fill="black"/>
                    </svg>
                    </div>
                    <div class="text-black text-2xl font-['Inter'] tracking-wide">4.5 </div>
                </div>
                <div class="text-black font-['Inter'] tracking-wide text-xs">19 reviews</div>
            </div>
            <div class="w-full flex-col justify-start items-start gap-2 flex">
                <StarBar/>
                <StarBar/>
                <StarBar/>
                <StarBar/>
                <StarBar/>
            </div>
        </div>
    );
}

const LeaveAReview = () => {
    return(
        <div class="max-w-sm flex-col justify-start items-center gap-[25px] inline-flex">
            <div class="w-full text-center text-black font-['Inter'] tracking-wide text-wrap
            sm:text-lg 
            xs:text-md">Want to share your experience with Dr. Pepe Bolenos Asyinol?</div>
            <div class="px-4 py-1.5 bg-[#ee6c4d] rounded-[5px] border border-[#ee6c4d] justify-center items-center gap-2.5 inline-flex">
                <div class="text-center text-white font-['Inter'] tracking-wide
                sm:text-lg 
                xs:text-md">Leave a review!</div>
            </div>
        </div>
    );
}

const Review = ({name, review, rating}) => {
    return(
        <div class="w-full flex-col justify-start items-start gap-2 flex">
            <div class="justify-start items-center gap-2 inline-flex">
                <div class="text-black/50 font-['Inter'] tracking-wide
                sm:text-sm 
                xs:text-xs">Customer</div>
                    <div data-svg-wrapper>
                    <svg width="4" height="4" viewBox="0 0 4 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 0C1.46957 0 0.96086 0.210714 0.585787 0.585787C0.210714 0.96086 0 1.46957 0 2C0 2.53043 0.210714 3.03914 0.585787 3.41421C0.96086 3.78929 1.46957 4 2 4C3.11 4 4 3.11 4 2C4 1.46957 3.78929 0.96086 3.41421 0.585787C3.03914 0.210714 2.53043 0 2 0Z" fill="black"/>
                    </svg>
                </div>
                <div class="w-24 h-[18px] text-center text-black/50 font-extralight font-['Inter'] tracking-wide
                sm:text-sm 
                xs:text-xs">dd/mm/yyyy</div>
            </div>
            <div class="justify-start items-center gap-[11px] inline-flex">
                <Star/>
                <div class="text-center text-[#293241] font-['Inter'] tracking-wide
                sm:text-base 
                xs:text-sm">Review headline.</div>
            </div>
            <div class="w-full text-[#3d5a80] font-['Inter'] tracking-wide
            sm:text-sm 
            xs:text-xs">Review content review content review content review content</div>
        </div>
    );
} 

export default function Reviews() {
    return(
        <div class="flex-col justify-center items-center gap-12 flex">
            <div class="w-full p-2.5 justify-start items-center gap-2.5 inline-flex border-b border-black/50  mt-16">
                <div class="text-center text-[#293241] font-['Inter'] tracking-wide
                sm:text-xl 
                xs:text-lg">Reviews</div>
                <div data-svg-wrapper class="relative">
                <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12.975L13.9 14.125C14.0833 14.2417 14.2667 14.2377 14.45 14.113C14.6333 13.9883 14.7 13.8173 14.65 13.6L14.15 11.425L15.85 9.95C16.0167 9.8 16.0667 9.621 16 9.413C15.9333 9.205 15.7833 9.09233 15.55 9.075L13.325 8.9L12.45 6.85C12.3667 6.65 12.2167 6.55 12 6.55C11.7833 6.55 11.6333 6.65 11.55 6.85L10.675 8.9L8.45 9.075C8.21667 9.09167 8.06667 9.20433 8 9.413C7.93333 9.62167 7.98333 9.80067 8.15 9.95L9.85 11.425L9.35 13.6C9.3 13.8167 9.36667 13.9877 9.55 14.113C9.73334 14.2383 9.91667 14.2423 10.1 14.125L12 12.975ZM6 18.5L3.7 20.8C3.38334 21.1167 3.02067 21.1877 2.612 21.013C2.20333 20.8383 1.99933 20.5257 2 20.075V4.5C2 3.95 2.196 3.47933 2.588 3.088C2.98 2.69667 3.45067 2.50067 4 2.5H20C20.55 2.5 21.021 2.696 21.413 3.088C21.805 3.48 22.0007 3.95067 22 4.5V16.5C22 17.05 21.8043 17.521 21.413 17.913C21.0217 18.305 20.5507 18.5007 20 18.5H6ZM5.15 16.5H20V4.5H4V17.625L5.15 16.5Z" fill="#293241"/>
                </svg>
                </div>
            </div>
            <div class="w-[90%] items-center gap-12 inline-flex
            md:flex-nowrap md:justify-start
            xs:flex-wrap xs:justify-center">
                <TotalRating />
                <LeaveAReview />
            </div>
            <div class="w-[90%] max-w-4xl flex-col justify-start items-center gap-[25px] flex">
                <Review />
                <Review />
                <Review />
                <Review />
                <Review />
                <Review />
                <Review />
                <Review />
                <Review />
                <Review />
            </div>
        </div>   
    )
}