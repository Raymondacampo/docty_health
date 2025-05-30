import { useState, useEffect } from "react";
import { apiClient, getApiImgUrl } from "@/utils/api";
import { UserCircleIcon } from "@heroicons/react/24/solid";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const backendBaseUrl = getApiImgUrl();

  const fetchPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get("doctor/patients/");
      console.log("Patients API Response:", response.data);
      setPatients(response.data.patients || []);
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to fetch patients";
      setError(errorMessage);
      console.error("Patients API Error:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">Error: {error}</div>;

  return (
    <div className="w-full flex flex-col justify-center items-center gap-4 my-8">
      <h2 className="text-[#293241] text-2xl font-['Inter'] font-bold border-b w-full max-w-3xl px-4 mb-4">
        Upcoming patients
      </h2>
      {patients.length === 0 ? (
        <div className="text-[#060648] text-center">No patients found</div>
      ) : (
        <div className="w-full max-w-3xl flex flex-col gap-4">
          {patients.map(({ patient, last_appointment }) => (
            <div
              key={patient.id}
              className="w-full bg-white rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] px-4 py-2 flex items-center gap-4 border border-black/25"
            >
              {patient.profile_picture ? (
                <img
                  src={`${backendBaseUrl}${patient.profile_picture}`}
                  alt={`${patient.first_name} ${patient.last_name}`}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <UserCircleIcon className="w-16 h-16 text-gray-400" aria-hidden="true" />
              )}
              <div className="flex flex-col gap-1">
                <h3 className="text-[#3d5a80] text-lg font-['Inter']">
                  {patient.first_name} {patient.last_name}
                </h3>
                <p className="text-[#3d5a80] text-sm font-['Inter']">
                  Last Appointment: {last_appointment || "None"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}