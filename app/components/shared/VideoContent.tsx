import { Link } from "react-router";
import { Icon } from "@iconify/react";

import StarRatingBasic from "~/components/commerce-ui/star-rating-basic";
import type { ResponseVideo } from "~/features/video/type";

export default function VideoContent({ video }: { video: ResponseVideo }) {
  return (
    <li className="bg-[#252525] rounded-lg overflow-hidden max-w-[420px] m-2">
      <Link to={video.platformVideoId} className="block">
        {video.thumbnailUrl && (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-60 object-contain"
          />
        )}

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
          <p className="text-[#888888] overflow-hidden text-ellipsis" style={{ display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical' }}>{video.description}</p>
        </div>
      </Link>
    </li>
  );
}
