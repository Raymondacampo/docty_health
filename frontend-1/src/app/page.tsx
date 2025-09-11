import Hero from "./components/Hero";
import Benefits from "./components/Benefits";
import Mobile from "./components/Mobile";
export default function Home() {
  return (
    <div className="font-sans relative flex flex-col">
      <Hero />
      <Benefits />
      <Mobile />
    </div>
  );
}
