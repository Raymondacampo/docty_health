import { useState, useEffect } from "react";
import Star from "./Star";
import { apiClient } from "@/app/utils/api";
import { useRouter } from "next/navigation";
import { CheckAuth } from "@/app/lib/CheckAuth";
import { useAlert } from "@/app/context/AlertContext";

export type Review = {
  id: number;
  rating: number;
  headline: string;
  body: string;
  created_at: string;
};

interface LeaveAReviewProps {
  doctorId: number;
  onReviewSubmitted: () => void;
}

const LeaveAReview = ({ doctorId, onReviewSubmitted }: LeaveAReviewProps) => {
  const router = useRouter();
  const { showAlert } = useAlert();
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [headline, setHeadline] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [reload, setReload] = useState<number>(0);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const check = async () => {
      const result = await CheckAuth();
      setIsAuthenticated(result ?? false);
    };
    check();
  }, []);

  // Check authentication on mount


  // Fetch existing review
  useEffect(() => {
    const fetchUserReview = async () => {
      if (!isAuthenticated) return;
      try {
        const response = await apiClient.get<{ review: Review }>(
          `/reviews/user_review/${doctorId}/`
        );
        if (response.data.review) {
          setUserReview(response.data.review);
        }
      } catch (err: any) {
        console.warn("No existing review or error fetching it", err);
      }
    };

    if (doctorId && isAuthenticated) {
      fetchUserReview();
    }
  }, [doctorId, isAuthenticated, reload]);

  // Clear rating-required error when user selects a rating
  useEffect(() => {
    if (rating > 0 && error === "Please select a rating.") {
      setError(null);
    }
  }, [rating, error]);

  const handleLeaveReviewClick = () => {
    if (!isAuthenticated) {
      const redirectUrl = encodeURIComponent(window.location.pathname);
      router.push(`/login?redirect=${redirectUrl}`);
      return;
    }

    setShowForm(true);
    setIsEditing(false);
    setRating(0);
    setHeadline("");
    setBody("");
    setError(null);
  };

  const handleEditReviewClick = () => {
    if (userReview) {
      setShowForm(true);
      setIsEditing(true);
      setRating(userReview.rating);
      setHeadline(userReview.headline);
      setBody(userReview.body);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Rating validation
    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isEditing && userReview) {
        // Update review
        await apiClient.put(`/reviews/update/${userReview.id}/`, {
          rating,
          headline,
          body,
        });
        setUserReview({ ...userReview, rating, headline, body });
        showAlert("Review updated successfully", "success");
      } else {
        // Create new review
        await apiClient.post(`/reviews/create/${doctorId}/`, {
          rating,
          headline,
          body,
        });
        showAlert("Review submitted successfully", "success");
      }

      // Success – close form & reset
      setShowForm(false);
      setRating(0);
      setHeadline("");
      setBody("");
      setIsEditing(false);
      onReviewSubmitted?.();
    } catch (err: any) {
      const msg = err.response?.data?.error || `Failed to submit review. ${err}`;
      showAlert(msg, "error");
      setError(msg);
    } finally {
      setLoading(false);
      setReload((prev) => prev + 1);
    }
  };

  const handleDeleteReview = async () => {
    if (!userReview) return;

    if (!confirm("Are you sure you want to delete your review?")) return;

    setLoading(true);
    setError(null);

    try {
      await apiClient.delete(`/reviews/delete/${userReview.id}/`);
      showAlert("Review deleted successfully", "success");
      setUserReview(null);
      setShowForm(false);
      onReviewSubmitted?.();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to delete review.");
    } finally {
      setLoading(false);
      setReload((prev) => prev + 1);
    }
  };

  return (
    <div className="flex justify-center mx-auto items-center relative lg:w-[45%] w-full">
      {/* 1. No review → Show "Leave a Review" button */}
      {!userReview && !showForm && (
        <div className="flex flex-col items-center gap-4">
          <div className="text-[#293241] tracking-wide text-lg">
            Share your experience with this doctor
          </div>
          <button
            onClick={handleLeaveReviewClick}
            className="px-4 py-2 bg-[#ee6c4d] rounded-[5px] border border-[#ee6c4d] text-white tracking-wide text-lg hover:bg-[#e55a3a] transition"
          >
            Leave a Review
          </button>
        </div>
      )}

      {/* 2. Existing review → Show review + Edit button */}
      {userReview && !showForm && (
        <div className="w-full flex flex-col justify-start items-start gap-2">
          <div className="justify-start items-start gap-1 inline-flex sm:flex-row flex-col">
            <div className="flex gap-2 items-center">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} filled={i < userReview.rating} />
              ))}
              <svg width="4" height="4" viewBox="0 0 4 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="2" cy="2" r="2" fill="gray" />
              </svg>
              <div className="text-black/50 tracking-wide text-xs">Your review</div>
            </div>
          </div>

          <div className="w-full break-words whitespace-pre-wrap text-[#293241] font-semibold tracking-wide xs:text-base">
            {userReview.headline}
          </div>
          <div className="w-full break-words whitespace-pre-wrap text-[#3d5a80] tracking-wide text-sm">
            {userReview.body}
          </div>

          <div className="text-black/50 font-extralight tracking-wide text-xs">
            {new Date(userReview.created_at).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </div>

          <button
            onClick={handleEditReviewClick}
            className="px-3 py-1.5 bg-[#ee6c4d] rounded-[5px] border border-[#ee6c4d] text-white tracking-wide text-base hover:bg-[#e55a3a] transition"
          >
            Edit Review
          </button>
        </div>
      )}

      {/* 3. Review Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex justify-center items-center z-50">
          <div className="relative w-full sm:min-w-[450px] sm:max-w-md bg-white sm:shadow-[0px_4px_4px_rgba(0,0,0,0.15)] sm:rounded-xl p-6 sm:p-8 flex flex-col gap-6 sm:gap-8 overflow-y-auto h-full sm:h-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-[#293241] font-semibold tracking-wide text-xl">
                {isEditing ? "Edit Review" : "Write a Review"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#293241]/20 transition-colors duration-200"
                aria-label="Close"
              >
                <div className="relative w-6 h-6">
                  <span className="absolute top-1/2 left-0 w-full h-0.5 bg-[#293241] rotate-45"></span>
                  <span className="absolute top-1/2 left-0 w-full h-0.5 bg-[#293241] -rotate-45"></span>
                </div>
              </button>
            </div>

            {/* Error Message – prominent & centered */}
            {error && (
              <div className="mx-auto max-w-md bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-center text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Rating */}
              <div className="flex flex-col gap-3">
                <label className="text-[#293241] tracking-wide text-base font-medium">
                  Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4 justify-center sm:justify-start">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star filled={hoverRating >= star || rating >= star} size={40} />
                    </button>
                  ))}
                </div>
                {rating === 0 && error === "Please select a rating." && (
                  <p className="text-red-500 text-xs mt-1 text-center sm:text-left">
                    ↑ Please choose a star rating
                  </p>
                )}
              </div>

              {/* Headline */}
              <div className="flex flex-col gap-2">
                <label className="text-[#293241] tracking-wide text-base">
                  Headline (optional)
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  maxLength={100}
                  placeholder="Summarize your experience"
                  className="w-full px-3 py-2 border border-gray-300 rounded-[5px] text-[#3d5a80] text-base focus:outline-none focus:border-[#ee6c4d]"
                />
              </div>

              {/* Body */}
              <div className="flex flex-col gap-2">
                <label className="text-[#293241] tracking-wide text-base">
                  Review (optional)
                </label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={5}
                  placeholder="Share your detailed experience"
                  className="w-full px-3 py-2 border border-gray-300 rounded-[5px] text-[#3d5a80] text-base focus:outline-none focus:border-[#ee6c4d] resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 px-6 py-3 bg-[#ee6c4d] rounded-[5px] text-white font-medium tracking-wide transition ${
                    loading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#e55a3a]"
                  }`}
                >
                  {loading
                    ? "Submitting..."
                    : isEditing
                    ? "Update Review"
                    : "Submit Review"}
                </button>

                {isEditing && (
                  <button
                    type="button"
                    onClick={handleDeleteReview}
                    disabled={loading}
                    className={`flex-1 px-6 py-3 bg-red-600 rounded-[5px] text-white font-medium tracking-wide transition ${
                      loading ? "opacity-70 cursor-not-allowed" : "hover:bg-red-700"
                    }`}
                  >
                    {loading ? "Deleting..." : "Delete Review"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveAReview;