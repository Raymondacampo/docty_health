import ScheduleCreationModal from "@/components/forms/ScheduleCreationModal";
export default function Schedule() {
    return (
        <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Schedule</h1>
        <p className="mb-4">Here you can find the schedule for our clinics.</p>
        <ScheduleCreationModal />
        <table className="min-w-full bg-white border border-gray-300">
            <thead>
            <tr>
                <th className="py-2 px-4 border-b">Clinic Name</th>
                <th className="py-2 px-4 border-b">Location</th>
                <th className="py-2 px-4 border-b">Date</th>
                <th className="py-2 px-4 border-b">Time</th>
            </tr>
            </thead>
            <tbody>
            {/* Example data, replace with actual data */}
            <tr>
                <td className="py-2 px-4 border-b">Clinic A</td>
                <td className="py-2 px-4 border-b">Location A</td>
                <td className="py-2 px-4 border-b">2023-10-01</td>
                <td className="py-2 px-4 border-b">10:00 AM - 12:00 PM</td>
            </tr>
            {/* Add more rows as needed */}
            </tbody>
        </table>
        </div>
    );
    }