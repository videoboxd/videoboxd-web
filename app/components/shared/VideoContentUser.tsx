import { Link } from "react-router";
import { Icon } from "@iconify/react";

import type { ResponseVideo } from "~/features/video/type";

export default function VideoContentUser({ video }: { video: ResponseVideo }) {
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
          <h3 className="text-lg font-medium text-white">{video.title}</h3>
          <div className="flex justify-between items-center"></div>
        </div>
      </Link>
    </li>
  );
}
