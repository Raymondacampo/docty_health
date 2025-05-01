// pages/profile/[doctorId].js
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import About from "@/components/profile/About";
import Insurances from "@/components/profile/Insurances";
import Locations from "@/components/profile/Locations";
import Reviews from "@/components/profile/Reviews";
import { publicApiClient, apiClient } from "@/utils/api";
import { useAuth } from "@/context/auth";
import LoadingComponent from "@/components/LoadingComponent";

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
  const [activeSection, setActiveSection] = useState("about");
  const user = useAuth().user;

  // Refs for sections
  const aboutRef = useRef(null);
  const insurancesRef = useRef(null);
  const locationsRef = useRef(null);
  const reviewsRef = useRef(null);

  const fetchDoctorData = async (id) => {
    try {
      const token = localStorage.getItem('access_token');
      let response;
      if (token) {
        response = await apiClient.get(`/doctors/${id}/`);
      } else {
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
    if (!router.isReady) return;

    if (!doctorId || doctorId === "undefined" || isNaN(doctorId)) {
      setError("Invalid doctor profile");
      setLoading(false);
      return;
    }

    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      await Promise.all([fetchDoctorData(doctorId), fetchReviewData(doctorId)]);
      setLoading(false);
    };

    fetchAll();
  }, [router.isReady, doctorId]);

  // Scroll-based logic to detect section closest to top
  useEffect(() => {
    // Set "about" as active on mount
    setActiveSection("about");

    const sections = [
      { id: "about", ref: aboutRef },
      { id: "insurances", ref: insurancesRef },
      { id: "locations", ref: locationsRef },
      { id: "reviews", ref: reviewsRef },
    ];

    // Debounce function to limit updates
    let debounceTimeout;
    const debounceUpdate = (callback) => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(callback, 100);
    };

    const handleScroll = () => {
      // If at top of page (scrollY === 0), force "about" as active
      if (window.scrollY === 0) {
        setActiveSection("about");
        return;
      }

      // Find section closest to top of viewport
      debounceUpdate(() => {
        let closestSection = null;
        let minDistance = Infinity;

        sections.forEach(({ id, ref }) => {
          if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            // Consider sections above or at the top (with 100px offset)
            const distance = Math.abs(rect.top - 100); // Offset matches scrollToSection
            if (distance < minDistance) {
              minDistance = distance;
              closestSection = id;
            }
          }
        });

        if (closestSection) {
          setActiveSection(closestSection);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    // Trigger initial check
    handleScroll();

    return () => {
      clearTimeout(debounceTimeout);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [doctorData]);

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
      setError(err.response?.data?.error || "Failed to fetch more reviews");
    }
  };

  const handleReviewSubmitted = () => {
    fetchReviewData(doctorId);
  };

  const scrollToSection = (sectionRef, sectionId) => {
    if (sectionRef.current) {
      const offset = 100;
      const sectionTop = sectionRef.current.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: sectionTop, behavior: "smooth" });
      setActiveSection(sectionId);
    }
  };

  if (loading) return <LoadingComponent isLoading={loading}/>;
  if (error) return <div className="text-red-500 font-['Inter'] text-center">Error: {error}</div>;
  if (!doctorData) return <div className="text-[#293241] font-['Inter'] text-center">No doctor data found</div>;

  return (
    <div className="w-full py-4 flex-col justify-start items-center gap-[81px] inline-flex">
      <div className="w-full bg-white max-w-6xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.15)] md:px-10 sm:py-12 sm:rounded-xl xs:px-2 py-4 xs:rounded-none">
        <div ref={aboutRef}>
          <About 
            doctor={doctorData}  
            averageRating={doctorData.average_rating || 0}
            reviewCount={doctorData.review_count || 0}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            scrollToSection={scrollToSection}
            aboutRef={aboutRef}
            insurancesRef={insurancesRef}
            locationsRef={locationsRef}
            reviewsRef={reviewsRef}
          />
        </div>
        <div ref={insurancesRef}>
          <Insurances
            insurances={doctorData.ensurances || []}
            name={`${doctorData.user?.first_name || ""} ${doctorData.user?.last_name || ""}`}
          />
        </div>
        <div ref={locationsRef}>
          <Locations clinics={doctorData.clinics || []} />
        </div>
        <div ref={reviewsRef}>
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
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const { doctorId } = params;
  if (!doctorId || isNaN(doctorId)) {
    return { notFound: true };
  }
  return { props: {} };
}