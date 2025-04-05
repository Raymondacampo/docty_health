import Head from "./Head";
import Footer from "./Footer";

export default function PageLayout({ children }) {
  console.log("Layout is rendering");
  return (
    <div className="w-full flex flex-col overflow-hidden">
      <Head />
      <main className="flex-grow font-['Inter']">{children}</main>
      <Footer/>
    </div>
  );
}
