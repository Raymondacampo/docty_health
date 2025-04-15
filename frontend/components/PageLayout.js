import Head from "./Head";
import Footer from "./Footer";

export default function PageLayout({ children }) {
  return (
    <div className="w-full flex flex-col min-h-screen">
      <Head />
      <main className="flex-grow font-['Inter']">{children}</main>
      <Footer/>
    </div>
  );
}
