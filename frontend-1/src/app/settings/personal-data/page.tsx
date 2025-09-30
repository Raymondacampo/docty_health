const Field = ({ title, content }: { title: string; content: string }) => {
  return (
    <div className="w-full flex flex-col border-b-3 border-gray-200 pb-2 px-1">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="">{content}</p>
    </div>
  );
}

export default function PersonalDataPage() {
  return (
    <div className="my-[10dvh] max-w-5xl xl:ml-16 text-black">
      <h1 className="text-2xl mb-8">Personal Data</h1>
      <div className="xl:px-4 flex flex-col gap-6">
        <Field 
          title="Full name"
          content="Content for field 1"
        />
        <Field 
          title="Username"
          content="Content for field 2"
        />
        <Field 
          title="Email"
          content="Content for field 3"
        />
        <Field 
          title="Phone number"
          content="Content for field 4"
        />
        <Field 
          title="Address"
          content="Content for field 5"
        />
        <Field 
          title="Date of Birth"
          content="Content for field 6"
        />
        <Field 
          title="Gender"
          content="Content for field 7"
        />  
      </div>
    </div>
  );
}
