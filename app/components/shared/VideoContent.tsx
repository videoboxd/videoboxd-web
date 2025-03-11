import { Link } from "react-router";
import { Icon } from "@iconify/react";
import type { Video } from "~/schema/schema";
import StarRatingBasic from "../commerce-ui/star-rating-basic";

export default function VideoContent(video: Video) {
  return (
    <li className="bg-[#252525] rounded-lg overflow-hidden max-w-[420px]">
      <Link to="#" className="block">
        {/* <img src={video.thumbnail} alt={video.title} /> */}
        <div className="p-4 space-y-1">
          <h3 className="font-bold text-2xl">{video.title}</h3>
          <p>
            Review by <span className="font-bold">Ganesh</span>
          </p>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2 text-[15px]">
              <Icon icon="fa-solid:comment-alt" className="text-[16px]" />
              29
            </span>

            <StarRatingBasic value={5} maxStars={5} />
          </div>
          <p className="text-[#888888]">{video.description}</p>
        </div>
      </Link>
    </li>
  );
}
