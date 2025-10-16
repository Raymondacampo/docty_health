
'use client';
import Link from "next/link";
import { useLoading } from "@/app/utils/LoadingContext";
import { useEffect } from "react";
const Field = ({ title, content }: { title: string; content: string }) => {
  return (
    <div className="w-full flex justify-between items-center border-b-3 border-gray-200 pb-2 px-1">
        <div>
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="">{content}</p>            
        </div>
        <Link href="/settings/security/change-password" className="text-blue-600 hover:underline">
          <p>change password</p>
        </Link>
    </div>
  );
}


export default function SecuritySettingsPage() {
  const { setIsLoading } = useLoading();

  useEffect(() => {
    setIsLoading(true);
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 200); // Adjust the timeout as needed

    return () => clearTimeout(timer);
  }, [setIsLoading]);
  return (
    <div className="my-[10dvh] max-w-5xl xl:ml-16 text-black">
    <h1 className="text-2xl mb-8">Security Settings</h1>
        <div className="xl:px-4 flex flex-col gap-6">
        <Field 
          title="Password"
          content="********"
        />
        </div>
    </div>
  );
}
