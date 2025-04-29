// pages/profile/[doctorId].js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import About from "@/components/profile/About";
import Insurances from "@/components/profile/Insurances";
import Locations from "@/components/profile/Locations";
import Reviews from "@/components/profile/Reviews";
import { publicApiClient, apiClient } from "@/utils/api";
import { useAuth } from "@/context/auth";

export default function Profile() {
  const router = useRouter();
  const { doctorId } = router.query;
  const [doctorData, setDoctorData] = useState(null);
  const [reviewsData, setReviewsData] = useState({
    reviews: [],
    total_reviews: 0,
    current_page: 1,
    total_pages: 1,
    rating_distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useAuth().user; // Get user from context

  const fetchDoctorData = async (id) => {
    try {
      const token = localStorage.getItem('access_token');

      let response;
      if (token) {
        // If token exists, fetch using apiClient with auth
        response = await apiClient.get(`/doctors/${id}/`);
      } else {
        // Otherwise public fetch
        response = await publicApiClient.get(`/doctors/${id}/`);
      }
      
      setDoctorData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch doctor data");
    }
  };

  const fetchReviewData = async (id, page = 1) => {
    try {
      const response = await publicApiClient.get(`/reviews/${id}/`, {
        params: { page },
      });
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
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch reviews");
    }
  };

  useEffect(() => {
    // Wait for router to be ready
    if (!router.isReady) return;

    // Validate doctorId
    if (!doctorId || doctorId === "undefined" || isNaN(doctorId)) {
      setError("Invalid doctor profile");
      setLoading(false);
      return;
    }

    // Clear error and fetch data
    const fetchAll = async () => {
      setLoading(true);
      setError(null); // Reset error
      await Promise.all([fetchDoctorData(doctorId), fetchReviewData(doctorId)]);
      setLoading(false);
    };

    fetchAll();
  }, [router.isReady, doctorId]);

  const loadMoreReviews = async () => {
    if (reviewsData.current_page >= reviewsData.total_pages) return;

    try {
      const nextPage = reviewsData.current_page + 1;
      const response = await publicApiClient.get(`/reviews/${doctorId}/`, {
        params: { page: nextPage },
      });
      setReviewsData((prev) => ({
        ...prev,
        reviews: [...prev.reviews, ...response.data.reviews],
        current_page: response.data.current_page || nextPage,
        total_pages: response.data.total_pages || prev.total_pages,
        rating_distribution: response.data.rating_distribution || prev.rating_distribution,
      }));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load more reviews");
    }
  };

  const handleReviewSubmitted = () => {
    fetchReviewData(doctorId);
  };

  if (loading) return <div className="text-[#293241] font-['Inter'] text-center">Loading...</div>;
  if (error) return <div className="text-red-500 font-['Inter'] text-center">Error: {error}</div>;
  if (!doctorData) return <div className="text-[#293241] font-['Inter'] text-center">No doctor data found</div>;

  return (
    <div className="w-full py-4 flex-col justify-start items-center gap-[81px] inline-flex">
      <div className="w-full max-w-6xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.15)] md:px-10 sm:py-12 sm:rounded-xl xs:px-2 py-4 xs:rounded-none">
        <About 
          doctor={doctorData}  
          averageRating={doctorData.average_rating || 0}
          reviewCount={doctorData.review_count || 0} 
        />
        <Insurances
          insurances={doctorData.ensurances || []}
          name={`${doctorData.user?.first_name || ""} ${doctorData.user?.last_name || ""}`}
        />
        <Locations clinics={doctorData.clinics || []} />
        <Reviews
          reviews={reviewsData.reviews}
          totalReviews={reviewsData.total_reviews}
          currentPage={reviewsData.current_page}
          totalPages={reviewsData.total_pages}
          loadMoreReviews={loadMoreReviews}
          averageRating={doctorData.average_rating || 0}
          reviewCount={doctorData.review_count || 0}
          ratingDistribution={reviewsData.rating_distribution}
          onReviewSubmitted={handleReviewSubmitted}
        />
      </div>
    </div>
  );
}

// Validate doctorId server-side
export async function getServerSideProps({ params }) {
  const { doctorId } = params;
  if (!doctorId || isNaN(doctorId)) {
    return { notFound: true }; // Return 404 for invalid IDs
  }
  return { props: {} };
}