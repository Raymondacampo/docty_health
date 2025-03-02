import Head from "./Head";
import Footer from "./Footer";

export default function PageLayout({ children }) {
  console.log("Layout is rendering");
  return (
    <div className="min-h-screen flex flex-col">
      <Head />
      <main className="flex-grow">{children}</main>
      <Footer/>
    </div>
  );
}
