const Attrs_why = ({title, body, src}) => {
  return (
    <div class="h-full w-full flex-col inline-flex">
        <div class="w-full flex-col items-center gap-3 inline-flex">
        <img class="xl:w-32 xl:h-32 lg:h-24 lg:w-24 md:h-20 md:w-20 h-20 w-20" src={src} />
            <div class="text-center text-black font-bold font-['Inter'] tracking-wider 
            xl:text-xl lg:text-lg md:text-lg text-sm">{title}</div>
            <div class="text-center text-black font-light font-['Inter'] xl:text-base lg:text-base md:text-sm text-xs">{body}</div>
        </div>
    </div>
  )
}

const Why_Docify = () => {
    return(
        <div class="w-full h-auto p-4 py-[50px] bg-[#98c1d1]/20 flex-col justify-center items-center gap-[67px] inline-flex
        xl:h-[600] xl:p-8
        lg:h-[600] lg:p-8
        md:h-[600] md:p-8
        sm:p-8">
        <div class="h-auto p-8 shadow-[2px_2px_2px_2px_rgba(0,0,0,0.25)] flex-col justify-start items-center gap-20 inline-flex rounded-lg
        xl:max-w-5xl xl:
        lg:max-w-4xl">
            <div class="text-center text-[#293241] text-2xl font-bold font-['Inter']">Why Choose Doctify?</div>
            <div className='flex flex-col justify-center items-center  w-337 h-full'>
                <div class="justify-start items-center gap-[50px] flex flex-col
                xl:flex-row lg:flex-row md:flex-row sm:flex-row">
                    <Attrs_why title="User-friendly" body="Navigate our intuitive platform with ease and find the healthcare solutions you need quickly." src="/images/friends.png"/>
                    <Attrs_why title="Secure & Private" body="Your personal information is safe with our advanced data security measures." src="/images/data-protection.png"/>
                    <Attrs_why title="Verified Doctors" body="Access profiles of certified and trusted healthcare professionals in your area." src="/images/doctor.png"/>
                </div>
            </div>                    
        </div>
    </div>
    )
}

export default Why_Docify;