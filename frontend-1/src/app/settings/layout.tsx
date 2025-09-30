// app/account/layout.tsx
import SimpleSideNavbar from "./components/SideNavBar";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-white">
      <SimpleSideNavbar />
      
      {/* Main Content */}
      <main className="lg:ml-4 sm:p-6 p-2 lg:p-8 w-full transition-all duration-300">
        <div className="max-w-7xl  mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}