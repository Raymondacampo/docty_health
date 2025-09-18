'use client';
import { useState, useEffect } from "react";
import { apiClient } from "../utils/api";
// import { useRouter } from "next/router";
// import LoadingComponent from "@/components/LoadingComponent";
// import CustomAlert from "@/components/CustomAlert";
// import useAlert from "@/hooks/useAlert";
import { FaSearch } from 'react-icons/fa';
// import AbsoluteSearchOverlay from "@/components/AbsoluteSearchOverlay";
import Doctor from "./components/Doctor";

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
//   const fetchFavoriteDoctors = async () => {
//     setLoading(true);
//     setError(null);
//     const redirectUrl = router.query.redirect || '/';
//     try {
//       const response = await apiClient.get("/auth/me/");
//       setDoctors(response.data.favorite_doctors || []);
//     } catch (err) {
//       router.push(redirectUrl);
//     } finally {
//       setLoading(false);
//     }
//   };

const favorite_doctors = [
        {
            "id": 1,
            "user": {
                "id": 8,
                "first_name": "pepe",
                "last_name": "gonzales marquinez",
                "email": "elpepesito@gmail.com",
                "profile_picture": null
            },
            "exequatur": "967897",
            "experience": 19,
            "sex": "M",
            "taking_dates": false,
            "takes_virtual": false,
            "takes_in_person": false,
            "description": null,
            "specialties": [
                {
                    "id": 1,
                    "name": "Cardiologist"
                }
            ],
            "clinics": [],
            "ensurances": [
                {
                    "id": 1,
                    "name": "senasa",
                    "logo": "https://juanpabloduarte.com/media/ensurance_logos/senasa.jpg"
                }
            ],
            "average_rating": 5.0,
            "review_count": 1,
            "has_availability": false,
            "is_favorited": true,
            "cities": []
        },
                {
            "id": 4,
            "user": {
                "id": 8,
                "first_name": "pepe",
                "last_name": "gonzales marquinez",
                "email": "elpepesito@gmail.com",
                "profile_picture": null
            },
            "exequatur": "967897",
            "experience": 19,
            "sex": "M",
            "taking_dates": false,
            "takes_virtual": false,
            "takes_in_person": false,
            "description": null,
            "specialties": [
                {
                    "id": 1,
                    "name": "Cardiologist"
                }
            ],
            "clinics": [],
            "ensurances": [
                {
                    "id": 1,
                    "name": "senasa",
                    "logo": "https://juanpabloduarte.com/media/ensurance_logos/senasa.jpg"
                }
            ],
            "average_rating": 5.0,
            "review_count": 1,
            "has_availability": false,
            "is_favorited": true,
            "cities": []
        }
    ]

  useEffect(() => {
      // fetchFavoriteDoctors();
      setDoctors(
        favorite_doctors.map((doctor) => ({
          id: doctor.id,
          user: {
            first_name: doctor.user.first_name,
            last_name: doctor.user.last_name,
            profile_picture: doctor.user.profile_picture ?? "",
          },
          specialties: doctor.specialties.map((spec) => ({
            name: spec.name,
          })),
        }))
      );
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
      console.log("Doctor removed from favorites", "success"); 
    }
  };

//   if (loading) return <LoadingComponent isLoading={loading}/>;
  if (error) return <div className="text-red-500 text-center">Error: {error}</div>;

  return (
    <div className="w-full pt-[10dvh] min-h-[68dvh] flex-col items-center gap-4 inline-flex my-8">
      {/* <CustomAlert message={alert.msg} status={alert.status}/> */}
      <div className="w-full max-w-3xl flex flex-col justify-center items-center gap-4 sm:px-4 px-2">
        <div className="self-stretch w-full text-black text-3xl tracking-wide font-semibold sm:mb-4">
          Favorite doctors
        </div>
        <div className="self-stretch w-full flex-col justify-center gap-8 flex mx-auto">
          {doctors.length === 0 ? (
          <div className="w-full h-80 flex justify-center items-center">
            <div className="flex flex-col justify-center items-center gap-4">
              <img src="/images/dclogo.png" alt="No results" className="h-[75px] w-[75px] mt-4" />
              <div className="text-[#060648] text-2xl font-semibold">No doctors found</div>
              <div className="flex items-center gap-4">
                <p className="text-[#060648]">Look up for doctors here!</p>
                {/* {show && (
                  <AbsoluteSearchOverlay

                    onClick={() => router.push("/search")}
                    setShow={setShow}
                  />                  
                )} */}

                <button onClick={() => setShow(true)} className="text-white bg-black px-3.5 py-1.5 rounded-sm flex items-center gap-2">Search <FaSearch/></button>                
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