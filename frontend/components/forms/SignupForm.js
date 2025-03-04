import GoogleButton from "../GoogleButton"

const Form = () => {
    return (
        <div class="self-stretch flex-col justify-center items-center gap-4 flex">
        <div class="self-stretch  flex-col justify-start items-start gap-4 flex">
            <div class="self-stretch flex-col justify-start items-start gap-[5px] flex">
                <div class="self-stretch text-[#3d5a80] text-base font-normal font-['Inter'] tracking-wide">Email</div>
                <input type='text' placeholder='yourmail@example.com' class="text-sm self-stretch px-4 py-3 rounded-[5px] border border-black justify-start items-center gap-2.5 inline-flex">
                </input>
            </div>
            <div class="self-stretch flex-col justify-start items-end gap-2 flex">
                <div class="self-stretch text-[#3d5a80] text-base font-normal font-['Inter'] tracking-wide">Password</div>
                <input type='text' placeholder='Password' class="text-sm self-stretch px-4 py-3 rounded-[5px] border border-black justify-start items-center gap-2.5 inline-flex">
                </input>
            </div>
            <div class="self-stretch flex-col justify-start items-end gap-2 flex">
                <div class="self-stretch  text-[#3d5a80] text-base font-normal font-['Inter'] tracking-wide">Repeat password</div>
                <input type='text' placeholder='Password again' class="text-sm self-stretch px-4 py-3 rounded-[5px] border border-black justify-start items-center gap-2.5 inline-flex">
                </input>
            </div>
        </div>
        <div class="w-full flex-col justify-start items-center gap-4 flex">
            <div class="w-full flex-col justify-end items-center gap-2.5 flex">
                <button class=" p-2.5 px-4 self-stretch bg-[#ee6c4d] rounded-[10px] border border-[#ee6c4d] justify-center items-center gap-2.5 inline-flex">
                    <div class="text-white text-base font-['Inter'] tracking-wide">Sign up</div>
                </button>
            </div>
            <div><span class="text-[#293241] text-xs font-light font-['Inter'] tracking-wide">Are you a doctor?</span><span class="text-[#4285f4] text-sm font-light font-['Inter'] tracking-wide"> </span><a href="" class="text-[#ee6c4d] text-xs font-light font-['Inter'] tracking-wide">Sign up as a doctor</a></div>
        </div>
    </div>
    )
}

export default function SignupForm (){  
    return(
        <div class="border-black/25 border py-8 bg-white rounded-[15px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex-col justify-center items-center gap-6 inline-flex
        sm:px-8
        xs:w-full xs:max-w-md xs:px-4">
           <div class="self-stretch text-center text-[#293241] text-xl font-['Inter'] tracking-wide">Create your account!</div>
           <GoogleButton/>
           <div class="text-[#293241] text-xl  ">or</div>
           <Form/>
       </div>
    )
}