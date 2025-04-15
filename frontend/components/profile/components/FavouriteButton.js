import { useState, useEffect } from "react";
import { apiClient } from "@/utils/api";
import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline"; // Updated import
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid"; // Updated import
// import { HeartIcon } from "@heroicons/react/outline"; // For unfilled heart
// import { HeartIcon as HeartIconSolid } from "@heroicons/react/solid"; // For filled heart

export default function FavoriteButton({ doctorId, isFavoritedInitially }) {
  const [isFavorited, setIsFavorited] = useState(isFavoritedInitially);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsFavorited(isFavoritedInitially);
  }, [isFavoritedInitially]);

  const handleToggleFavorite = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post(`/auth/toggle_favorite/${doctorId}/`);
      setIsFavorited(response.data.is_favorited);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update favorite status");
    } finally {
      setLoading(false);
    }
  };

  return (
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
  );
}