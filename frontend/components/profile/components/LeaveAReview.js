import { useState, useEffect, useRef } from "react";
import Star from "./Star";
import { apiClient } from "@/utils/api";
import { useRouter } from "next/router";
import LoadingComponent from "@/components/LoadingComponent";
import CustomAlert from "@/components/CustomAlert";
import useAlert from "@/hooks/useAlert";

const LeaveAReview = ({ onReviewSubmitted }) => {
  const router = useRouter();
  const { doctorId } = router.query;
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [headline, setHeadline] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userReview, setUserReview] = useState(null);
  const [reload, setReload] = useState(0);

  const { alert, showAlert } = useAlert() // Initialize with empty message

  // Check if user has already reviewed this doctor
  useEffect(() => {
    const fetchUserReview = async () => {
      try {
        const response = await apiClient.get(`/reviews/user_review/${doctorId}/`);
        if (response.data.review) {
          setUserReview(response.data.review);
        }
      } catch (err) {
        // No review found or other error, proceed without setting userReview
      }
    };
    if (doctorId) {
      fetchUserReview();
    }
  }, [doctorId, reload]);

  const checkAuthentication = async () => {
    try {
      await apiClient.get("/auth/me/");
      return true;
    } catch (err) {
      if (err.response?.status === 401) {
        const returnUrl = encodeURIComponent(router.asPath);
        handleNonLoggedInClick();
        return false;
      }
      setError("An error occurred while checking authentication.");
      return false;
    }
  };

  const handleNonLoggedInClick = () => {
    // Redirect to login with current page as redirect query param
    const redirectUrl = encodeURIComponent(router.asPath); // Current URL (e.g., /profile/[doctorId])
    router.push(`/login?redirect=${redirectUrl}`);
  };

  const handleLeaveReviewClick = async () => {
    const isAuthenticated = await checkAuthentication();
    if (isAuthenticated) {
      setShowForm(true);
      setIsEditing(false);
      setRating(0);
      setHeadline("");
      setBody("");
    }
  };

  const handleEditReviewClick = async () => {
    const isAuthenticated = await checkAuthentication();
    if (isAuthenticated && userReview) {
      setShowForm(true);
      setIsEditing(true);
      setRating(userReview.rating);
      setHeadline(userReview.headline);
      setBody(userReview.body);
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
      if (isEditing && userReview) {
        // Update existing review
        await apiClient.put(`/reviews/update/${userReview.id}/`, {
          rating,
          headline,
          body,
        });
        setUserReview({ ...userReview, rating, headline, body });
      } else {
        // Create new review
        await apiClient.post(`/reviews/create/${doctorId}/`, {
          rating,
          headline,
          body,
        });
      }
      setShowForm(false);
      setRating(0);
      setHeadline("");
      setBody("");
      setIsEditing(false);
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit review.");
      showAlert(error, 'success')
    } finally {
      setLoading(false);
      setReload((prev) => prev + 1); // Trigger a reload to fetch the updated review
      showAlert('Review created', 'success')
    }
  };

  const handleDeleteReview = async () => {
    if (!userReview) return;

    setLoading(true);
    setError(null);

    try {
      await apiClient.delete(`/reviews/delete/${userReview.id}/`);
      setUserReview(null);
      setShowForm(false);
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete review.");
      showAlert(error, 'success')
    } finally {
      setLoading(false);
      showAlert('Review deleted', 'success')
    }
  };

  return (
    <div className="flex justify-center mx-auto items-center relative lg:w-[45%] xs:w-full">
      <CustomAlert message={alert.msg} status={alert.status} />
      <LoadingComponent isLoading={loading} />
      {!userReview && !showForm ? (
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
      ) : userReview && !showForm ? (
        <div className="w-full flex-col justify-start items-start gap-2 flex">
          <div className="justify-start items-start gap-1 inline-flex sm:flex-row xs:flex-col">
            <div className="flex gap-2 items-center">
              {Array(5)
                .fill(false)
                .map((_, index) => (
                  <div key={index}>
                    <Star filled={index < userReview.rating} />
                  </div>
                ))}
                <div data-svg-wrapper>
                <svg width="4" height="4" viewBox="0 0 4 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 0C1.46957 0 0.96086 0.210714 0.585787 0.585787C0.210714 0.96086 0 1.46957 0 2C0 2.53043 0.210714 3.03914 0.585787 3.41421C0.96086 3.78929 1.46957 4 2 4C3.11 4 4 3.11 4 2C4 1.46957 3.78929 0.96086 3.41421 0.585787C3.03914 0.210714 2.53043 0 2 0Z"
                    fill="gray"
                  />
                </svg>
              </div>
              <div className="text-black/50 font-['Inter'] tracking-wide text-xs">
                Your review
              </div>
            </div>
          </div>
          <div className="w-full break-words whitespace-pre-wrap text-[#293241] font-['Inter'] font-semibold tracking-wide break-all xs:text-base">
            {userReview.headline}
          </div>
          <div className="w-full break-words whitespace-pre-wrap text-[#3d5a80] font-['Inter'] tracking-wide text-sm break-all">
            {userReview.body}
          </div>
          <div className="justify-start items-center gap-2 inline-flex">
            <div className="text-center text-black/50 font-extralight font-['Inter'] tracking-wide text-xs">
              {new Date(userReview.created_at).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </div>
          </div>
          <button
            onClick={handleEditReviewClick}
            className="px-3 py-1.5 bg-[#ee6c4d] rounded-[5px] border border-[#ee6c4d] text-white font-['Inter'] tracking-wide text-base"
          >
            Edit Review
          </button>
        </div>
      ) : (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex justify-center items-center z-50">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full sm:min-w-[450px] sm:max-w-md bg-white sm:shadow-[0px_4px_4px_rgba(0,0,0,0.15)] sm:rounded-xl p-6 sm:p-8 flex flex-col gap-6 sm:gap-8 overflow-y-auto sm:h-auto h-full">
            <div className="flex justify-between items-center">
              <h2 className="text-[#293241] font-['Inter'] font-semibold tracking-wide text-xl">
                {isEditing ? "Edit Review" : "Write a Review"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#293241]/20 transition-colors duration-200"
                aria-label="Close search overlay"
              >
                <div className="relative w-6 h-6">
                  <span className="absolute top-1/2 left-0 w-full h-0.5 bg-[#293241] transform rotate-45"></span>
                  <span className="absolute top-1/2 left-0 w-full h-0.5 bg-[#293241] transform -rotate-45"></span>
                </div>
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
              <div className={`flex gap-4 justify-center sm:static bottom-2 left-1/2 transform -translate-x-1/2 w-full
                sm:left-none sm:translate-x-0 sm:translate-y-0 sm:top-auto sm:bottom
                xs:fixed `}>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-3 py-1.5 bg-[#ee6c4d] rounded-[5px] border border-[#ee6c4d] text-white font-['Inter'] tracking-wide text-base 
                    ${loading ? "opacity-50 cursor-not-allowed" : ""}
                    ${!isEditing ? "w-[95%] mx-auto" : "w-[45%]"}
                    `}
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
                    className={`px-3 py-1.5 bg-red-500 w-[45%] rounded-[5px] border border-red-500 text-white font-['Inter'] tracking-wide text-base ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
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