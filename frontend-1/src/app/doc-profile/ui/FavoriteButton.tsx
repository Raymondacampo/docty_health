import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { apiClient } from "@/app/utils/api";
import { useAlert } from "@/app/context/AlertContext";
import { useRouter } from "next/navigation";

export default function FavoriteButton({ doctorId, isUserAuthenticated }: { doctorId: number; isUserAuthenticated: boolean | null }) {
  const [favorited, setFavorited] = useState(false);
  const { showAlert } = useAlert();
  const router = useRouter();

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      if (isUserAuthenticated) {
        try {
          const isfav = await apiClient.get(`/doctor_in_favorite/${doctorId}/`);
          setFavorited(isfav.data.is_favorite);
        } catch (error) {
          console.error("Failed to fetch favorite status", error);
        }
      }
    };
    fetchFavoriteStatus();
  }, []);

  const handleFavoriteToggle = async () => {
    try {
      if (!isUserAuthenticated) {
        const redirectUrl = encodeURIComponent(window.location.pathname);
        router.push(`/login?redirect=${redirectUrl}`);
        return;
      }
      const response = await apiClient.post(`/auth/toggle_favorite/${doctorId}/`);
      setFavorited(response.data.is_favorited);
      showAlert(
        response.data.is_favorited
          ? "Added to favorites!"
          : "Removed from favorites!",
        "success"
      );
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Failed to update favorite status";
      showAlert(errorMsg, "error");
    }
  };

  return (
    <button
      onClick={handleFavoriteToggle}
      className={`flex justify-center gap-2 py-3 lg:py-2 px-3 w-[220px] rounded bg-gray-200 text-black"
      }`}
    >
      <Heart className={`w-6 h-6 ${favorited ? "text-red-600 fill-red-600" : "text-blue-500"}`} />
      {favorited ? "Remove Favorite" : "Add to Favorite"} 
    </button>
  );
}