import { Link } from "react-router";
import { Icon } from "@iconify/react";

import StarRatingBasic from "~/components/commerce-ui/star-rating-basic";
import type { ResponseVideo } from "~/features/video/type";

export default function VideoContent({ video }: { video: ResponseVideo }) {
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

        <div className="p-4 space-y-1">
          <h3 className="font-bold text-2xl">{video.title}</h3>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2 text-[15px]">
              <Icon icon="fa-solid:comment-alt" className="text-[16px]" />
              <span>
                {video?.reviews.length > 0 ? video?.reviews.length : 0}
              </span>
            </span>

            {/* <StarRatingBasic
              value= {3}
              maxStars={5}
              readOnly={true}
              className="p-2"
            /> */}
          </div>
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
      </Link>
    </li>
  );
}
