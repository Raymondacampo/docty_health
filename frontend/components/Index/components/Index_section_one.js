const Attrs_why = ({title, body, src}) => {
  return (
    <div className="h-full w-full flex-col inline-flex bg-white rounded-lg shadow-[2px_6px_5px_1px_rgba(0,0,0,0.1)] xs:max-w-xs">
        <div className="w-full flex-col items-center gap-3 inline-flex">
        <img className="w-full rounded-t-lg" src={src} />
            <div className="text-center text-black font-bold font-['Inter'] tracking-wider 
            xl:text-xl lg:text-lg md:text-lg text-base">{title}</div>
            <div className="text-center px-2 pb-2 text-black font-light font-['Inter']  md:text-sm text-xs">{body}</div>
        </div>
    </div>
  )
}

export default function Why_Docify(){
    return(
        <div className="w-full h-auto p-4 py-[50px] bg-[#98c1d1]/10 flex-col justify-center items-center gap-[67px] inline-flex 
        xl:p-8
        lg:p-8
        md:p-8
        xs:p-0">
            <div className="h-auto px-8 py-12 flex-col justify-start items-center gap-20 inline-flex rounded-lg
            xl:max-w-5xl xl:
            lg:max-w-4xl">
                <div className="text-center text-[#293241] text-2xl font-bold font-['Inter']">Why Choose DoctyHealth?</div>
                <div className='flex flex-col justify-center items-center  w-337 h-full'>
                    <div className="justify-start items-start gap-[50px] flex flex-col
                    xl:flex-row lg:flex-row md:flex-row sm:flex-row">
                        <Attrs_why title="User-friendly" body="Navigate our intuitive platform with ease and find the healthcare solutions you need quickly." src="/images/user_friendly.png"/>
                        
                        <Attrs_why title="Verified Doctors" body="Access profiles of certified and trusted healthcare professionals in your area." src="/images/verified_doctors.png"/>
                        <Attrs_why title="Secure & Private" body="Your personal information is safe with our advanced data security measures." src="/images/secure.png"/>
                    </div>
                </div>                    
            </div>

    </div>
    )
}