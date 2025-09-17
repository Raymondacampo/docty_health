export default function Description({name, experience, age}:{name: string, experience: number, age: number}) {
    return (
        <div className="mt-12 rounded-lg flex-col justify-start items-start gap-8 flex">
            <div className="flex gap-4 items-center">
                <p className="py-2 px-4 shadow-lg rounded-lg font-semibold">{experience} years of experience</p>
                <p className="text-lg font-semibold">{age} años</p>
            </div>
            <p className="text-gray-600">
                Dr. {name} is a highly skilled professional with expertise in . With a commitment to providing
                exceptional care, Dr. {name} utilizes the latest advancements in medical technology and evidence-based
                practices to ensure the best possible outcomes for patients.In the sun-drenched coastal city of Santo Domingo, 
                where the pulse of the Caribbean meets the rhythm of modern medicine, Dr. Raymond Acampo Sandoval stands as a 
                beacon of compassion and precision in the world of cardiology. Born under the whispering palms of a Dominican 
                village, Raymond's early life was a tapestry woven from the threads of family lore—tales of his Italian grandfather, 
                a wandering chef whose recipes infused every heartbeat with flavor, and his Sandoval lineage, sturdy as the ancient 
                ceiba trees that guard the island's secrets. From a young age, he felt the world's rhythms: the syncopated drum of 
                merengue festivals, the steady thrum of ocean waves against volcanic shores, and, tragically, the faltering cadence 
                of his father's heart during a stormy harvest night. That moment ignited a fire in young Raymond—not of destruction, 
                but of restoration. He vowed to become the mender of broken tempos, the conductor who could harmonize the body's 
                most vital symphony.
            </p>
        </div>
    );
}
