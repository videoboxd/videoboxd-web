import { useNavigate } from "react-router";

export function ReviewButton({
  isSaved,
  videoId,
  title,
  thumbnailUrl,
}: {
  isSaved: boolean;
  videoId: string | null;
  title: string;
  thumbnailUrl: string;
}) {
  const navigate = useNavigate();

  const handleReview = () => {
    if (isSaved && videoId) {
      navigate(`/review/${videoId}`, {
        state: { title, thumbnailUrl },
      });
    }
  };

  return (
    <button
      onClick={handleReview}
      disabled={!isSaved || !videoId}
      className={`relative flex items-start px-3 py-2 m-2 font-medium transition-colors clip-path-button
                    ${
                      isSaved
                        ? "bg-sky-400 text-black hover:bg-sky-500"
                        : "bg-gray-500 text-white cursor-not-allowed"
                    }
                `}
    >
      <span className="z-10 pr-2">Review</span>
    </button>
  );
}
