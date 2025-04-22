import Head from "./Head";
import Footer from "./Footer";

export default function PageLayout({ children }) {
  return (
    <div className="w-full flex flex-col overflow-hidden min-h-screen bg-gray-50/80">
      <Head />
      <main className="flex-grow font-['Inter']">{children}</main>
      <Footer/>
    </div>
  );
}
