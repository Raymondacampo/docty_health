// components/profile/LeaveAReview.js
import { useState, useEffect } from "react";
import Star from "./Star";
import { apiClient } from "@/utils/api";
import { useRouter } from "next/router";

const LeaveAReview = ({ onReviewSubmitted }) => {
  const router = useRouter();
  const { doctorId } = router.query;
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [headline, setHeadline] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkAuthentication = async () => {
    try {
      await apiClient.get("/auth/me/");
      return true; // User is authenticated
    } catch (err) {
      if (err.response?.status === 401) {
        // Redirect to login with return URL
        const returnUrl = encodeURIComponent(router.asPath); // Current page URL
        router.push(`/login?returnUrl=${returnUrl}`);
        return false;
      }
      setError("An error occurred while checking authentication.");
      return false;
    }
  };

  const handleLeaveReviewClick = async () => {
    const isAuthenticated = await checkAuthentication();
    if (isAuthenticated) {
      setShowForm(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      setError("Please select a rating.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await apiClient.post(`/reviews/create/${doctorId}/`, {
        rating,
        headline,
        body,
      });
      setShowForm(false);
      setRating(0);
      setHeadline("");
      setBody("");
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mx-auto items-center md:w-auto xs:w-full">
      {!showForm ? (
        <div className="flex flex-col items-center gap-4">
          <div className="text-[#293241] font-['Inter'] tracking-wide text-lg">
            Share your experience with this doctor
          </div>
          <button
            onClick={handleLeaveReviewClick}
            className="px-4 py-2 bg-[#ee6c4d] rounded-[5px] border border-[#ee6c4d] text-white font-['Inter'] tracking-wide text-lg"
          >
            Leave a Review
          </button>
        </div>
      ) : (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex justify-center items-center z-50">
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full sm:min-w-[450px] sm:max-w-md bg-white sm:shadow-[0px_4px_4px_rgba(0,0,0,0.15)] sm:rounded-xl p-6 sm:p-8 flex flex-col gap-6 sm:gap-8 overflow-y-auto sm:h-auto h-full"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-[#293241] font-['Inter'] font-semibold tracking-wide text-xl">
                Write a Review
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-[#293241] font-['Inter'] text-lg"
              >
                ✕
              </button>
            </div>
            {error && (
              <div className="text-red-500 font-['Inter'] text-sm">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[#293241] font-['Inter'] tracking-wide text-base">
                  Rating *
                </label>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="cursor-pointer"
                    >
                      <Star
                        filled={hoverRating >= star || rating >= star}
                        size={32}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[#293241] font-['Inter'] tracking-wide text-base">
                  Headline (optional)
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  maxLength={100}
                  className="w-full px-3 py-2 border border-gray-300 rounded-[5px] text-[#3d5a80] font-['Inter'] text-base"
                  placeholder="Summarize your experience"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[#293241] font-['Inter'] tracking-wide text-base">
                  Review (optional)
                </label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-[5px] text-[#3d5a80] font-['Inter'] text-base"
                  rows={4}
                  placeholder="Share your detailed experience"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 bg-[#ee6c4d] rounded-[5px] border border-[#ee6c4d] text-white font-['Inter'] tracking-wide text-lg ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveAReview;