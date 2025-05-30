import Head from "./Head";
import Footer from "./Footer";

export default function PageLayout({ children }) {
  return (
    <div className="w-full flex flex-col overflow-hidden min-h-screen bg-gray-200/30">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <Head />
      <main className="flex-grow font-['Inter']">{children}</main>
      <Footer/>
    </div>
  );
}
