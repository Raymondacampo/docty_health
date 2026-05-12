'use client';

export default function Loading({text = "Loading..."}:{text?:string}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#060648]"></div>
        <p className="mt-4 text-[#293241] font-bold text-xl">{text}</p>
      </div>
    </div>
  );
}