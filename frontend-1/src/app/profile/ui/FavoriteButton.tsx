import { useState } from "react";
import { Heart } from "lucide-react";

export default function FavoriteButton({ isFavorited, doctorId }: { isFavorited: boolean; doctorId: number }) {
  const [favorited, setFavorited] = useState(isFavorited);

  const handleFavoriteToggle = () => {
    setFavorited(!favorited);
    // Call API to update favorite status
  };

  return (
    <button
      onClick={handleFavoriteToggle}
      className={`flex justify-center gap-2 py-3 lg:py-2 px-3 w-[220px] rounded ${
        favorited ? "bg-red-500 text-white" : "bg-gray-200 text-black"
      }`}
    >
      <Heart className="w-6 h-6 text-blue-900" />{favorited ? "Remove Favorite" : "Add to Favorite"} 
    </button>
  );
}