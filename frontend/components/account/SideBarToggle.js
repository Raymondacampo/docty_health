export default function SidebarToggle({ onToggle }) {
    return (
      <div
        className="h-screen sticky top-0 left-0 bg-white shadow-[3px_4px_6px_-2px_rgba(0,0,0,0.15)] w-[50px] 
          hidden lg:flex flex-col justify-start items-center pt-4 
          md:hidden xs:hidden"
      >
        <button
          onClick={onToggle}
          className="text-[#3d5a80] hover:text-blue-900"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    );
  }