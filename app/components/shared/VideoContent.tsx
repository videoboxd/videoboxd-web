import { Icon } from "@iconify/react";
import { Link } from "react-router";

import type { ResponseVideo } from "~/features/video/type";
import StarRating_Fractions from "~/components/commerce-ui/star-rating-fractions";

export default function VideoContent({ video }: { video: ResponseVideo }) {
  const { reviews } = video;
  const totalReview = reviews.length;
  const averageRating =
    reviews?.length > 0
      ? reviews
          .map((review) => review.rating)
          .reduce((a: number, b: number) => a + b, 0) / reviews.length
      : 0;
  const roundedAverageRating =
    averageRating && Number(averageRating.toFixed(1));

  return (
    <li className="bg-neutral-900/60 rounded-lg overflow-hidden m-2">
      <Link to={`/watch/${video.id}`} className="block">
        {video.thumbnailUrl && (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-60 object-cover"
          />
        )}

        <div className="p-4 space-y-1 flex flex-col h-[300px]">
          <div className="flex-[0_0_5%]">
            <span className="text-[#888888]">{video.creator}</span>
          </div>

          <div className="my-2 flex-[0_0_20%] overflow-hidden">
            <h3
              className="font-bold text-xl overflow-hidden text-ellipsis"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {video.title}
            </h3>
          </div>

          <div className="flex justify-between items-center flex-[0_0_5%]">
            <span className="flex items-center gap-2 text-[15px]">
              <Icon icon="fa-solid:comment-alt" className="text-[16px]" />
              <span>{totalReview} </span>
            </span>

            {averageRating > 0 ? (
              <StarRating_Fractions
                value={roundedAverageRating}
                maxStars={5}
                readOnly={true}
              />
            ) : (
              <p className="text-gray-300">Not yet rated</p>
            )}
          </div>

          <div className="flex-1 mt-2">
            <p
              className="text-[#888888] overflow-hidden text-ellipsis"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 5,
                WebkitBoxOrient: "vertical",
              }}
            >
              {video.description}
            </p>
          </div>
        </div>
      </Link>
    </li>
  );
}
