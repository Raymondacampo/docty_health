export default function QuickLink({ title, specialty, icon }: { title: string; specialty: string; icon: React.ReactNode }) {
  return (
    <div className="flex flex-col bg-white items-center justify-center gap-2 p-4 border border-gray-300 rounded-lg hover:shadow-lg transition-shadow duration-300">
      <div className="text-4xl text-[#003186]">{icon}</div>
      <h3 className="text-lg text-black font-semibold text-center">{title}</h3>
      <p className="text-sm text-gray-500 text-center">{specialty}</p>
    </div>
  );
}