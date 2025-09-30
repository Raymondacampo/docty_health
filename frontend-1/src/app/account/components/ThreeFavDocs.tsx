'use client';   
import { UserCircleIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect } from 'react';
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
};

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

const DoctorBall = ({ doctor }: DoctorProps) => {
  return (
    <div className="flex-col justify-center items-center inline-flex">
      <UserCircleIcon
          className="w-[125px] h-[125px] text-gray-400 rounded-full object-cover object-center mb-2"
          aria-hidden="true"
      />
      <h3 className="text-black font-bold text-lg">{`${doctor.user.first_name} ${doctor.user.last_name}`}</h3>
      <p className="text-black">{doctor.specialties.map(spec => spec.name).join(', ')}</p>
    </div>
  );
}

export default function ThreeFavDocs({docs}: {docs: DoctorProps["doctor"][]}) {
    // const [doctors, setDoctors] = useState<DoctorProps["doctor"][]>([]);
      // useEffect(() => {
      //     // fetchFavoriteDoctors();
      //     setDoctors(
      //       favorite_doctors.map((doctor) => ({
      //         id: doctor.id,
      //         user: {
      //           first_name: doctor.user.first_name,
      //           last_name: doctor.user.last_name,
      //           profile_picture: doctor.user.profile_picture ?? "",
      //         },
      //         specialties: doctor.specialties.map((spec) => ({
      //           name: spec.name,
      //         })),
      //       }))
      //     );
      //   }, []);
    
    return (
        <div className='flex flex-col border border-gray-100 gap-4 px-4 py-2 rounded-md'>
          <h2 className="text-2xl font-semibold text-black">Recent doctors</h2>
          <div className="flex font-bold text-black space-x-6">
            {docs.length === 0 && 
            <div>
              <p>No favorite doctors found.</p>
              <button>Add +</button>
            </div>}
            {docs.map((doctor) => (
              <DoctorBall key={doctor.id} doctor={doctor} />
            ))}
          </div>
        </div>
    );
}