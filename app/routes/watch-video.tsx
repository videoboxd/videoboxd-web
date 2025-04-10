import type { Route } from "./+types/watch-video";
import ky from "ky";
import { Link } from "react-router";
import { useState } from "react";
import type { ResponseVideoIdentifier } from "~/features/video/type";
import type { ResponseReviews } from "~/features/review/type";
import { serverApiUrl } from "~/lib/api-server";
import { Button } from "~/components/ui/button";
import StarRatingBasic from "~/components/commerce-ui/star-rating-basic";
import { getSession } from "~/lib/sessions";

export function meta({ data }: Route.MetaArgs) {
  return [
    { title: `${data.video.title} - Videoboxd` || "Video Title - Videoboxd" },
    {
      name: "description",
      content: data.video.description || "No Description",
    },
  ];
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const isAuthenticated = session.has("userId");

  const { videoId } = params;

  const video = await ky
    .get(`${serverApiUrl}/videos/${videoId}`)
    .json<ResponseVideoIdentifier>();

  const reviews = await ky
    .get(`${serverApiUrl}/reviews?videoId=${video.id}`)
    .json<ResponseReviews>();

  return { isAuthenticated, video, reviews };
}

export default function VideoDetailsRoute({
  loaderData,
}: Route.ComponentProps) {
  const { isAuthenticated, video, reviews } = loaderData;
  const [expanded, setExpanded] = useState(false);

  const toggleDescription = () => setExpanded(!expanded);

  return (
    <main className="flex items-center justify-center">
      <div className="w-full max-w-sm md:max-w-5xl p-3">
        {/* Video Info Section */}
        <div className="space-y-4">
          {/* Highlighted Action Buttons */}
          <div className="mt-4 flex flex-wrap justify-between">
            <Link
              to="/"
              className="py-2 text-md font-medium hover:text-neutral-300  rounded-lg transition"
            >
              Back to Home
            </Link>
            <a
              href={video.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 text-md font-semibold text-white hover:text-neutral-300 rounded-lg transition"
            >
              Watch on {video.platform?.name}
            </a>
          </div>

          {/* Thumbnail */}
          <img
            src={video.thumbnailUrl || undefined}
            alt={video.title}
            className="w-full object-cover rounded-xl shadow-md"
          />

          {/* Title & Metadata */}
          <div className="space-y-3 text-neutral-100">
            <h1 className="text-3xl font-bold">{video.title}</h1>

            <div className="flex items-center gap-2 text-neutral-200 text-sm">
              <span>{video.platform?.name}</span>
              <span>•</span>
              <span>
                {new Date(video.uploadedAt || new Date()).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }
                )}
              </span>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 text-neutral-200">
              {video.categories?.map((category) => (
                <span
                  key={category.id}
                  className="bg-neutral-950 px-3 py-1 rounded-full text-sm"
                >
                  {category.name}
                </span>
              ))}
            </div>

            {/* Expandable Description */}
            <div className="text-neutral-300 mt-4 relative">
              <div
                className={`whitespace-pre-wrap overflow-hidden transition-all duration-300 ${
                  expanded ? "max-h-full" : "max-h-[16rem]"
                }`}
              >
                {video.description}
              </div>
              {video.description?.split("\n").length > 10 && (
                <button
                  onClick={toggleDescription}
                  className="mt-2 text-blue-500 text-sm hover:underline"
                >
                  {expanded ? "Show less" : "Show more"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section with Different Background */}
        <div className="py-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Reviews</h2>
            {isAuthenticated && (
              <div>
                <Button asChild>
                  <Link to={`/review/${video.id}`}>Add Review</Link>
                </Button>
              </div>
            )}
          </div>

          {reviews.length === 0 && (
            <p className="text-muted-foreground italic">
              No reviews yet. Be the first to add one!
            </p>
          )}

          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-lg p-4 bg-slate-600/50 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">
                      {review.user.username[0].toUpperCase()}
                    </div>
                    <span className="font-medium">{review.user.username}</span>
                  </div>
                  <StarRatingBasic
                    value={review.rating}
                    maxStars={review.rating}
                    readOnly={true}
                    className="p-2"
                  />
                </div>
                <p className="whitespace-pre-wrap text-white">{review.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
