// pages/profile/[doctorId].js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import About from "@/components/profile/About";
import Insurances from "@/components/profile/Insurances";
import Locations from "@/components/profile/Locations";
import Reviews from "@/components/profile/Reviews";

export default function Profile() {
  const router = useRouter();
  const { doctorId } = router.query;
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!doctorId) return;

    const fetchDoctorData = async () => {
      try {
        const response = await fetch(`/api/doctors/${doctorId}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch doctor data");
        }
        const data = await response.json();
        setDoctorData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [doctorId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!doctorData) return <div>No doctor data found</div>;

  return (
    <div className="w-full py-4 flex-col justify-start items-center gap-[81px] inline-flex">
      <div className="w-full max-w-6xl border border-black/25 sm:px-10 sm:py-12 sm:rounded-xl xs:px-2 py-4 xs:rounded-none">
        <About doctor={doctorData} />
        <Insurances insurances={doctorData.ensurances} />
        <Locations clinics={doctorData.clinics} />
        <Reviews reviews={doctorData.reviews} averageRating={doctorData.average_rating} reviewCount={doctorData.review_count} />
      </div>
    </div>
  );
}