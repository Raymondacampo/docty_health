
import Link from "next/link";

const Field = ({ title, content, wide }: { title: string; content: string; wide?: boolean }) => {
  return (
    <div className="w-full flex justify-between items-center border-b-3 border-gray-200 pb-2 px-1">
        <div className={wide ? "flex justify-between w-full pb-3" : ""}>
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="">{content}</p>            
        </div>
    </div>
  );
}

const ModField = ({ title, content, bb }: { title: string; content: string; bb?: boolean }) => {
  return (
    <div className={`w-full flex justify-between items-start pb-2 px-1 ${bb ? "" : "border-b-3 border-gray-200"}`}>
        <div className="flex flex-col gap-2 pb-3">
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="">{content}</p>            
        </div>
        <Link href="/settings/security/change-password" className="text-blue-600 hover:underline">
          <p>Modify</p>
        </Link>
    </div>
  );
}

export default function DoctorSettingsPage() {
  return (
    <div className="my-[10dvh] max-w-5xl xl:ml-16 text-black">
      <h1 className="text-2xl mb-8">Doctor Settings</h1>
      <div className="xl:px-4 flex flex-col gap-6">
        <Field
          title="Exequatur"
          content="123456789"
          wide
        />
        <Field
          title="Experience"
          content="5 years"
          wide
        />
        <ModField
          title="Specialties"
          content="Cardiologist   Pneumologist"
          
        />
        <ModField
          title="Clinics"
          content="Centro Medico Moderno"
        />
        <ModField
          title="Insurances"
          content="senasa"
        />
        <ModField
          title="Description"
          content="In the sun-drenched coastal city of Santo Domingo, where the pulse of the Caribbean meets the rhythm of modern medicine, 
          Dr. Raymond Acampo Sandoval stands as a beacon of compassion and precision in the world of cardiology. Born under the whispering 
          palms of a Dominican village, Raymond's early life was a tapestry woven from the threads of family lore—tales of his Italian 
          grandfather, a wandering chef whose recipes infused every heartbeat with flavor, and his Sandoval lineage, sturdy as the ancient 
          ceiba trees that guard the island's secrets. From a young age, he felt the world's rhythms: the syncopated drum of merengue festivals, 
          the steady thrum of ocean waves against volcanic shores, and, tragically, the faltering cadence of his father's heart during a stormy 
          harvest night. That moment ignited a fire in young Raymond—not of destruction, but of restoration. He vowed to become the mender of 
          broken tempos, the conductor who could harmonize the body's most vital symphony."
          bb
        />
      </div>
    </div>
  );
}
