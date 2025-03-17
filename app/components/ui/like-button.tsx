import { useState } from "react";
import { Heart } from "lucide-react";

function LikeButton({ setLike }: { setLike: (liked: boolean) => void }) {
    const [liked, setLiked] = useState(false);
  
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setLiked(!liked);
          setLike(!liked);
        }}
        className="transition duration-100 cursor-pointer"
      >
        <Heart
          className={`w-8 h-8 transition-all ${
            liked
              ? "fill-red-500 text-red-500"
              : "text-gray-400 hover:text-red-500 hover:fill-red-500"
          }`}
        />
      </button>
    );
  }