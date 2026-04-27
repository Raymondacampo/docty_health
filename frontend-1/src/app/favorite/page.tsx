'use client';
import { useState, useEffect } from "react";
import Image from "next/image";
import { apiClient } from "../utils/api";
import { FaSearch } from 'react-icons/fa';
import Doctor from "./components/Doctor";
import Loading from "../components/LoadingComponent";
import Link from "next/dist/client/link";
import dclogo from '@/assets/images/dclogo.png';


type DoctorProps = {
  doctor: {
    id: number;
    user: {
      first_name: string;
      last_name: string;
      profile_picture: string;
    };
    specialties: { name: string }[];
  };
  onRemove: (doctorId: number) => void;
};



export default function FavoriteDoctors() {
  const [doctors, setDoctors] = useState<DoctorProps["doctor"][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const [show, setShow] = useState(false);
//   const {alert, showAlert} = useAlert();

//   const router = useRouter();

  useEffect(() => {
      const fetchFavoriteDoctors = async () => {
        setError(null);
        // const redirectUrl = router.query.redirect || '/';
        try {
          const response = await apiClient.get("/auth/personal-data/");
          setDoctors(response.data.favorite_doctors || []);
        } catch (err) {
          // router.push(redirectUrl);
        } finally {
          setLoading(false);
        }
      };    
      fetchFavoriteDoctors();
    }, []);


  const handleRemove = async (doctorId: number) => {
    try {
      await apiClient.post(`/auth/toggle_favorite/${doctorId}/`);
      setDoctors(doctors.filter((doctor) => doctor.id !== doctorId));
    } catch (err) {
      if (typeof err === "object" && err !== null && "response" in err) {
        // @ts-ignore
        setError(err.response?.data?.error || "Failed to remove doctor");
      } else {
        setError("Failed to remove doctor");
      }
    }finally{
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500 text-center">Error: {error}</div>;

  return (
    <div className="w-full pt-[10dvh] min-h-[68dvh] flex-col items-center gap-4 inline-flex my-8">
      {/* <CustomAlert message={alert.msg} status={alert.status}/> */}
      <div className="w-full max-w-3xl flex flex-col justify-center items-center gap-4 sm:px-4 px-2">
        <div className="self-stretch w-full text-black text-3xl tracking-wide font-semibold sm:mb-4">
          Favorite doctors
        </div>
        <div className="self-stretch w-full flex-col justify-center gap-4 flex mx-auto">
          {doctors.length === 0 ? (
          <div className="w-full h-80 flex justify-center items-center">
            <div className="flex flex-col justify-center items-center gap-4">
              <Image src={dclogo} alt="No results" className="h-[75px] w-[75px] mt-4" width={75} height={75} />
              <div className="text-[#060648] text-2xl font-semibold">No doctors found</div>
              <div className="flex items-center gap-4">
                <p className="text-[#060648]">Look up for doctors here!</p>
                {/* {show && (
                  <AbsoluteSearchOverlay

                    onClick={() => router.push("/search")}
                    setShow={setShow}
                  />                  
                )} */}

                <Link href="/search" className="text-white bg-black px-3.5 py-1.5 rounded-sm flex items-center gap-2">Search <FaSearch/></Link>                
              </div>

            </div>
          </div>
          ) : (
            doctors.map((doctor) => (
              <Doctor key={doctor.id} doctor={doctor} onRemove={handleRemove} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}