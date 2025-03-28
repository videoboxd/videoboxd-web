import { useNavigate } from "react-router";

function ReviewButton({ isSaved }: { isSaved: boolean }) {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate("/review")}
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
  
export default ReviewButton;