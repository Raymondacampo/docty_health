// app/page.tsx
'use client';
import About from "./components/About";
import Insurances from "./components/Insurances";
import Description from "./components/Description";
import Locations from "./components/Locations";
import Reviews from "./components/Reviews";
import doctors_bg from "@/assets/images/doctors_bg.png";
import { useEffect, useState } from "react";
import { publicApiClient, apiClient } from "@/app/utils/api";
import { isAuthenticated } from "@/app/utils/auth";

type UserType = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  profile_picture: string;
  age: number;
};

export type EnsuranceType = {
  id: number;
  name: string;
  logo: string;
} | null;

export type ClinicType = {
  id: number;
  name: string;
  city: string;
  state: string;
  location: {
    latitude: number;
    longitude: number;
  };
  address: string;
};

export type DoctorPageProps = {
  id: number,
  user: UserType;
  average_rating: number | 0;
  review_count: number;
  exequatur: string;
  experience: number;
  sex: string;
  taking_dates: boolean;
  takes_virtual: boolean;
  takes_in_person: boolean;
  description: string | null;
  specialties: { id: number; name: string }[];
  clinics: ClinicType[];
  ensurances: EnsuranceType[];
};

type ReviewDataType = {
  reviews: any[];
  total_reviews: number;
  current_page: number;
  total_pages: number;
  rating_distribution: { [key: string]: number };
};

export default function ProfilePage({
  params,
}: {
  params: Promise<{ id: number }>; // Note: Promise
}) {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState<boolean | null>(null);
  const [doctor, setDoctor] = useState<DoctorPageProps | null>(null);
  const [page, setPage] = useState(1);
  const [reviewsData, setReviewsData] = useState<ReviewDataType>({
    reviews: [],
    total_reviews: 0,
    current_page: 1,
    total_pages: 1,
    rating_distribution: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
  });
  const [error, setError] = useState<string | null>(null);

  const loadMoreReviews = async () => {
    if (reviewsData.current_page >= reviewsData.total_pages) return;

    try {
      if (!doctor) {
        setError("Doctor data not loaded");
        return;
      }
      const nextPage = reviewsData.current_page + 1;
      const response = await publicApiClient.get(`/reviews/${doctor.id}/`, {
        params: { page: nextPage },
      });
      setReviewsData((prev) => ({
        ...prev,
        reviews: [...prev.reviews, ...response.data.reviews],
        current_page: response.data.current_page || nextPage,
        total_pages: response.data.total_pages || prev.total_pages,
        rating_distribution: response.data.rating_distribution || prev.rating_distribution,
      }));
    } catch (err : any) {
      setError(err.response?.data?.error || "Failed to fetch more reviews");
    }
  };

  useEffect(() => {
    const fetchDoctor = async () => {
      const { id } = await params;
      try{
        const response = await apiClient.get(`/doctors/${id}/`);
        console.log('Doctor data:', response.data);
        setDoctor(response.data);
      } catch (error) {
        console.error('Failed to fetch doctor data:', error);
      }
    };

    const fetchReviewData = async () => {
      const { id } = await params;
      try {
        const response = await publicApiClient.get(`/reviews/${id}/`, {
          params: { page },
        });
        console.log('Reviews data:', response.data);
        setReviewsData({
          reviews: response.data.reviews || [],
          total_reviews: response.data.total_reviews || 0,
          current_page: response.data.current_page || page,
          total_pages: response.data.total_pages || 1,
          rating_distribution: response.data.rating_distribution || {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
          },
        });
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch reviews");
      }
    };

    const checkAuth = async () => {
      const authStatus = await isAuthenticated();
      setIsUserAuthenticated(authStatus);
    };
    if(isUserAuthenticated === null){
      checkAuth();
    }
    fetchReviewData();
    fetchDoctor();
  }, [params]);
 
  return (
    <div className="w-full min-h-screen relative flex flex-col justify-start items-center pb-16 gap-[81px] bg-transparent">
    <div
        className="absolute inset-0 -z-10 bg-no-repeat bg-cover bg-right lg:bg-center"
        style={{
          backgroundImage: `url(${doctors_bg.src})`,
          opacity: 0.3, // Maintain opacity
        }}
      />

        {doctor && (
          <div className="w-full pt-[12dvh] sm:pt-12 lg:mt-[10dvh] px-4 lg:px-24 relative z-10 bg-white/60 lg:bg-white max-w-7xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.15)] sm:py-12 sm:rounded-xl py-4 xs:rounded-none">
          <About
            doctor={doctor}
            averageRating={doctor.average_rating || 0}
            reviewCount={doctor.review_count || 0}
            isUserAuthenticated={isUserAuthenticated}
          />
          {doctor?.ensurances && (
            <Insurances
              insurances={doctor.ensurances || []}
              name={`${doctor.user?.first_name || ""} ${doctor.user?.last_name || ""}`}
            />          
          )}  
          {doctor?.description && (
            <Description
              name={`${doctor.user?.first_name} ${doctor.user?.last_name}`}
              experience={doctor.experience}
              age={doctor.user.age}
            />
          )}
          {doctor?.clinics && (
            <Locations clinics={doctor.clinics || []} />
          )}
            <Reviews
              doctor_id={doctor.id}
              reviews={reviewsData.reviews}
              totalReviews={reviewsData.total_reviews}
              currentPage={reviewsData.current_page}
              totalPages={reviewsData.total_pages}
              loadMoreReviews={() => loadMoreReviews()}
              averageRating={doctor.average_rating || 0}
              reviewCount={doctor.review_count || 0}
              ratingDistribution={reviewsData.rating_distribution}
            />
          </div>        
        )}
        {/* <Reviews
          reviews={reviewsData.reviews}
          totalReviews={reviewsData.total_reviews}
          currentPage={reviewsData.current_page}
          totalPages={reviewsData.total_pages}
          loadMoreReviews={() => console.log('hola')}
          averageRating={doctor.average_rating || 0}
          reviewCount={doctor.review_count || 0}
          ratingDistribution={reviewsData.rating_distribution}
        /> */}
      </div>
  );
}