// pages/profile/[doctorId].js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import About from "@/components/profile/About";
import Insurances from "@/components/profile/Insurances";
import Locations from "@/components/profile/Locations";
import Reviews from "@/components/profile/Reviews";
import { publicApiClient } from "@/utils/api"; // Use apiClient for consistency

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

  const fetchDoctorData = async () => {
    try {
      const response = await publicApiClient.get(`/doctors/${doctorId}`);
      setDoctorData(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchReviewData = async () => {
    try {
      const response = await publicApiClient.get(`/reviews/${doctorId}`);
      setReviewsData({
        reviews: response.data.reviews,
        total_reviews: response.data.total_reviews,
        current_page: response.data.current_page,
        total_pages: response.data.total_pages,
        rating_distribution: response.data.rating_distribution,
      });
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (!doctorId) return;

    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([fetchDoctorData(), fetchReviewData()]);
      setLoading(false);
    };

    fetchAll();
  }, [doctorId]);

  const loadMoreReviews = async () => {
    if (reviewsData.current_page >= reviewsData.total_pages) return;

    try {
      const nextPage = reviewsData.current_page + 1;
      const response = await publicApiClient.get(`/reviews/${doctorId}?page=${nextPage}`);
      setReviewsData((prev) => ({
        ...prev,
        reviews: [...prev.reviews, ...response.data.reviews],
        current_page: response.data.current_page,
        total_pages: response.data.total_pages,
        rating_distribution: response.data.rating_distribution,
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReviewSubmitted = () => {
    fetchReviewData(); // Refresh reviews
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!doctorData) return <div>No doctor data found</div>;

  return (
    <div className="w-full py-4 flex-col justify-start items-center gap-[81px] inline-flex">
      <div className="w-full max-w-6xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.15)] md:px-10 sm:py-12 sm:rounded-xl xs:px-2 py-4 xs:rounded-none">
        <About doctor={doctorData} />
        <Insurances
          insurances={doctorData.ensurances}
          name={`${doctorData.user.first_name} ${doctorData.user.last_name}`}
        />
        <Locations clinics={doctorData.clinics} />
        <Reviews
          reviews={reviewsData.reviews}
          totalReviews={reviewsData.total_reviews}
          currentPage={reviewsData.current_page}
          totalPages={reviewsData.total_pages}
          loadMoreReviews={loadMoreReviews}
          averageRating={doctorData.average_rating}
          reviewCount={doctorData.review_count}
          ratingDistribution={reviewsData.rating_distribution}
          onReviewSubmitted={handleReviewSubmitted} // Pass callback
        />
      </div>
    </div>
  );
}