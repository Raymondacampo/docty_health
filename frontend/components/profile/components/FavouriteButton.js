import { useState, useEffect } from "react";
import { apiClient } from "@/utils/api";
import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/router";
import CustomAlert from "@/components/CustomAlert";

export default function FavoriteButton({ doctorId, isFavoritedInitially }) {
  const { user } = useAuth();
  const [isFavorited, setIsFavorited] = useState(isFavoritedInitially);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ msg: "", status: null });
  const router = useRouter();

  useEffect(() => {
    setIsFavorited(isFavoritedInitially);
  }, [isFavoritedInitially]);

  const showAlert = (message, status) => {
    setAlert({ msg: message, status });
    setTimeout(() => setAlert({ msg: "", status: null }), 3000);
  };

  const handleToggleFavorite = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post(`/auth/toggle_favorite/${doctorId}/`);
      setIsFavorited(response.data.is_favorited);
      showAlert(
        response.data.is_favorited
          ? "Added to favorites!"
          : "Removed from favorites!",
        "success"
      );
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to update favorite status";
      showAlert(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleNonLoggedInClick = () => {
    // Redirect to login with current page as redirect query param
    const redirectUrl = encodeURIComponent(router.asPath); // Current URL (e.g., /profile/[doctorId])
    router.push(`/login?redirect=${redirectUrl}`);
  };

  if (!user) {
    return (
      <>
        <button
          onClick={handleNonLoggedInClick}
          className="flex items-center gap-2 px-4 py-2 rounded-md font-['Inter'] text-sm bg-[#293241]/10 text-[#293241] hover:bg-[#293241]/20 transition-colors duration-200"
          aria-label="Login to add to favorites"
          title="Login to add to favorites"
        >
          <HeartIconOutline className="w-5 h-5 text-gray-600" />
          <span>Add to Favorite</span>
        </button>
        <CustomAlert message={alert.msg} status={alert.status} />
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleToggleFavorite}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-md font-['Inter'] text-sm transition-colors duration-200 ${
          isFavorited
            ? "bg-blue-100/80 text-[#293241] hover:bg-[#293241]/20"
            : "bg-[#293241]/10 text-[#293241] hover:bg-[#293241]/20"
        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
        title={isFavorited ? "Remove from favorites" : "Add to favorites"}
      >
        {isFavorited ? (
          <HeartIconSolid className="w-5 h-5 text-blue-900" />
        ) : (
          <HeartIconOutline className="w-5 h-5 text-gray-600" />
        )}
        <span>{isFavorited ? "Favorite" : "Add to Favorite"}</span>
      </button>
      <CustomAlert message={alert.msg} status={alert.status} />
    </>
  );
}