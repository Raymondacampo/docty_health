const Field = ({title, value}) => {
    return(
        <div class="self-stretch flex-col justify-start items-start gap-[5px] flex">
            <label class="self-stretch text-[#3d5a80] text-base font-normal font-['Inter'] tracking-wide">{title}</label>
            <input type='text' placeholder={value} class="text-sm self-stretch px-4 py-3 rounded-[5px] border border-black justify-start items-center gap-2.5 inline-flex">
            </input>
        </div>
    )
}
const Form = () => {
    return (
        <div class="self-stretch flex-col justify-center items-center gap-4 flex">
        <div class="self-stretch  flex-col justify-start items-start gap-4 flex">
            <Field title='Email' value='yourmail@example.com'/>
            <Field title='Professional name' value='First and last name'/>
            <Field title='Specialization' value='e.g Cardiologist'/>
            <Field title='Exequatur' value='0000000'/>
            <Field title='Password' value='Password'/>
            <Field title='Repeat password' value='Password again'/>
        </div>
        <div class="w-full flex-col justify-start items-center gap-4 flex">
            <div class="w-full flex-col justify-end items-center gap-2.5 flex">
                <button class=" p-2.5 px-4 self-stretch bg-[#ee6c4d] rounded-[10px] border border-[#ee6c4d] justify-center items-center gap-2.5 inline-flex">
                    <div class="text-white text-base font-['Inter'] tracking-wide">Sign up</div>
                </button>
            </div>
        </div>
    </div>
    )
}

export default function DoctorSignupForm (){  
    return(
        <div class="border-black/25 border py-8 bg-white rounded-[15px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex-col justify-center items-center gap-8 inline-flex
        sm:px-8
        xs:w-full xs:max-w-md xs:px-4">
            <div class="self-stretch text-center text-[#293241] text-xl font-['Inter'] tracking-wide">Create your Doctor account!</div>
            <div class="w-full items-center inline-flex gap-8">
                <div class="py-1 border-b border-[#ee6c4d] flex-col justify-center items-center gap-2.5 inline-flex">
                    <div class="text-center text-[#ee6c4d] text-base font-['Inter'] tracking-wide">Create profile</div>
                </div>
                <div class="justify-center items-center gap-2.5 flex">
                    <div class="text-center text-[#ee6c4d]/75 text-sm font-light font-['Inter'] tracking-wide">Claim profile</div>
                </div>
            </div>
            
           <Form/>
       </div>
    )
}