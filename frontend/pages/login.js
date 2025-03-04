import GoogleButton from "@/components/GoogleButton";

const Form = () => {
    return (
        <div class="self-stretch flex-col justify-start items-start gap-11 flex">
        <div class="self-stretch flex-col justify-start items-start gap-4 flex">
            <div class="self-stretch flex-col justify-start items-start gap-[5px] flex">
                <div class="self-stretch text-[#3d5a80] text-base font-normal font-['Inter'] tracking-wide">Username or email</div>
                <input type="text" placeholder="Username or email" class="text-black self-stretch  px-4 py-3 rounded-[5px] border border-black justify-start items-center gap-2.5 inline-flex">
                </input>
            </div>
            <div class="self-stretch flex-col justify-start items-end gap-2 flex">
                <div class="self-stretch text-[#3d5a80] text-base font-normal font-['Inter'] tracking-wide">Password</div>
                <input type='text' placeholder="Password" class="text-black self-stretch px-4 py-3 rounded-[5px] border border-black justify-start items-center gap-2.5 inline-flex">
                </input>
                <div class="self-stretch"><span class="text-[#293241] text-xs font-light font-['Inter'] tracking-wide">Forgot you password?</span><span class="text-black text-sm font-light font-['Inter'] tracking-wide"> </span><a href='' class="text-[#ee6c4d] text-sm font-light font-['Inter'] tracking-wide">reset password</a></div>
            </div>
        </div>
        <div class="self-stretch flex-col justify-center items-center gap-4 flex">
            <div class="self-stretch flex-col justify-center items-center gap-2.5 flex">
                <button class="self-stretch p-2.5 bg-[#ee6c4d] rounded-[10px] border border-[#ee6c4d] justify-center items-center gap-2.5 inline-flex">
                    <div class="text-white text-base  font-['Inter'] tracking-wide">Login</div>
                </button>
                <button class="self-stretch p-2.5 rounded-[10px] border border-[#ee6c4d] justify-center items-center gap-2.5 inline-flex">
                    <div class="text-[#ee6c4d] text-base font-['Inter'] tracking-wide">Sign up</div>
                </button>
            </div>
            <div><span class="text-[#293241] text-xs font-light font-['Inter'] tracking-wide">Are you a doctor?</span><span class="text-[#4285f4] text-sm font-light font-['Inter'] tracking-wide"> </span><a href='' class="text-[#ee6c4d] text-sm font-light font-['Inter'] tracking-wide">Sign up as a doctor</a></div>
        </div>
    </div>
    )
}

export default function Login() {
    return (
        <div className="w-full py-9 px-2 flex-col justify-center items-center gap-16 inline-flex">
            <div class="border-black/25 border py-8 bg-white rounded-[15px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex-col justify-center items-center gap-6 inline-flex 
            sm:w-[418px] sm:px-8
            xs:w-full xs:max-w-[400px] xs:px-4">
                <div class="self-stretch text-center text-[#293241] text-xl font-['Inter'] tracking-wide">Login to your account!</div>
                <GoogleButton/>
                <div class="text-[#293241] text-xl font-medium">or</div>
                <Form/>
            </div>
        </div>
    )
}
//