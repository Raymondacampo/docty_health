// app/page.tsx
'use client';
// Make sure About.tsx or About/index.tsx exists in ./components
// If About is located elsewhere, update the path accordingly, e.g.:
// import About from "../components/About";
// import Insurances from "./components/Insurances";
// import Description from "./components/Description";
// import Locations from "./components/Locations";
// import Reviews from "./components/Reviews";
// import doctors_bg from "@/assets/images/doctors_bg.png";
// import doctor_profile from "@/assets/images/doctor_profile.png";

const reviewsData = {
  reviews: [
    {
      id: 2,
      user: {
        id: 7,
        first_name: "el jefe",
        last_name: "de tu mai",
      },
      rating: 5,
      headline: "Increíble doctor",
      body: "El señor Jacques kanques es uno de los mejores doctores que haya visto en mi vida. La forma en que cuestiona todo y encuentra toda la información necesaria por internet sin necesidad de haber estudiado medicina es algo de otro mundo. Hasta me llegué a creer que era un médico de verdad!",
      created_at: "2025-04-13T19:14:17.093708Z",
    },
  ],
  total_reviews: 1,
  page_size: 10,
  current_page: 1,
  total_pages: 1,
  rating_distribution: {
    "1": 0,
    "2": 0,
    "3": 0,
    "4": 0,
    "5": 1,
  },
};

export default function ProfilePage() {
  // const doctor = {
  //   id: 7,
  //   is_favorited: false,
  //   user: {
  //     id: 11,
  //     first_name: "Jacques",
  //     last_name: "a campo",
  //     email: "jacquesacampo@gmail.com",
  //     profile_picture: doctor_profile.src,
  //     age: 76,
  //   },
  //   exequatur: "8888888",
  //   experience: 54,
  //   sex: "M",
  //   taking_dates: false,
  //   takes_virtual: true,
  //   takes_in_person: true,
  //   description: null,
  //   specialties: [
  //     {
  //       id: 1,
  //       name: "Cardiologist",
  //     },
  //   ],
  //   clinics: [
  //     {
  //       id: 2,
  //       name: "Modern Medical Center",
  //       city: "Santo Domingo",
  //       state: "Distrito Nacional",
  //       location: {
  //         latitude: 18.475941199999998,
  //         longitude: -69.9575012,
  //       },
  //       address: "Avenida Charles Sumner Esq, C. Jose Lopez 5, Santo Domingo, Dominican Republic",
  //     },
  //   ],
  //   ensurances: [
  //     {
  //       id: 1,
  //       name: "senasa",
  //       logo: "https://juanpabloduarte.com/media/ensurance_logos/senasa.jpg",
  //     },
  //   ],
  //   average_rating: 4.5,
  //   review_count: 2,
  // };

  return (
    <div className="w-full min-h-screen relative flex flex-col justify-start items-center pb-16 gap-[81px] bg-transparent">
    {/* <div
        className="absolute inset-0 -z-10 bg-no-repeat bg-cover bg-right lg:bg-center"
        style={{
          backgroundImage: `url(${doctors_bg.src})`,
          opacity: 0.3, // Maintain opacity
        }}
      />

      <div className="w-full pt-[12dvh] sm:pt-12 lg:mt-[10dvh] px-4 lg:px-24 relative z-10 bg-white/60 lg:bg-white max-w-7xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.15)] sm:py-12 sm:rounded-xl py-4 xs:rounded-none">
        <About
          doctor={doctor}
          averageRating={doctor.average_rating || 0}
          reviewCount={doctor.review_count || 0}
        />
        <Insurances
          insurances={doctor.ensurances || []}
          name={`${doctor.user?.first_name || ""} ${doctor.user?.last_name || ""}`}
        />
        <Description
          name={`${doctor.user?.first_name} ${doctor.user?.last_name}`}
          experience={doctor.experience}
          age={doctor.user.age}
        />
        <Locations clinics={doctor.clinics || []} />
        <Reviews
          reviews={reviewsData.reviews}
          totalReviews={reviewsData.total_reviews}
          currentPage={reviewsData.current_page}
          totalPages={reviewsData.total_pages}
          loadMoreReviews={() => console.log('hola')}
          averageRating={doctor.average_rating || 0}
          reviewCount={doctor.review_count || 0}
          ratingDistribution={reviewsData.rating_distribution}
        />
      </div> */}
    </div>
  );
}