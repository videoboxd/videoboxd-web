import ky from "ky";
import { Link } from "react-router";
import { Card, CardContent } from "~/components/ui/card";
import { useState } from "react";
import type { ResponseVideosIdentifier } from "~/features/video/type";
import type { ResponseReviews } from "~/features/review/type";
import { serverApiUrl } from "~/lib/api-server";
import type { Route } from "./+types/video-details";
import { Button } from "~/components/ui/button";

export function meta({ data }: Route.MetaArgs) {
  return [
    { title: `${data.video.title} - Videoboxd` || "Video Title - Videoboxd" },
    {
      name: "description",
      content: data.video.description || "No Description",
    },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  const { platformVideoId } = params;
  const video = await ky
    .get(`${serverApiUrl}/videos/${platformVideoId}`)
    .json<ResponseVideosIdentifier>();

  const reviews = await ky
    .get(`${serverApiUrl}/reviews?videoId=${video.id}`)
    .json<ResponseReviews>();

  return { video, reviews };
}

export default function VideoDetailsRoute({
  loaderData,
}: Route.ComponentProps) {
  const { video, reviews } = loaderData;
  const [expanded, setExpanded] = useState(false);

  const toggleDescription = () => setExpanded(!expanded);

  return (
    <main className="flex bg-card items-center justify-center">
      <div className="w-full max-w-sm md:max-w-5xl p-3">
        {/* Video Info Section */}
        <div className="space-y-4">
          {/* Highlighted Action Buttons */}
          <div className="mt-4 flex flex-wrap justify-between">
            <Link
              to="/"
              className="px-4 py-2 text-md font-medium hover:text-gray-600 rounded-lg transition"
            >
              ← Back to Home
            </Link>
            <a
              href={video.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-md font-semibold text-primary hover:text-blue-800 rounded-lg transition"
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
          <div className="space-y-3">
            <h1 className="text-3xl font-bold">{video.title}</h1>

            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <span>{video.platform?.name}</span>
              <span>•</span>
              <span>
                {new Date(video.uploadedAt || new Date()).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {video.categories?.map((category) => (
                <span
                  key={category.id}
                  className="bg-muted px-3 py-1 rounded-full text-sm text-muted-foreground"
                >
                  {category.name}
                </span>
              ))}
            </div>

            {/* Expandable Description */}
            <div className="text-muted-foreground mt-4 relative">
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
        <div className="rounded-xl px-2 py-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Reviews</h2>
            <Button asChild>
              <Link to={`/review/${video.platformVideoId}`}>Add Review</Link>
            </Button>
          </div>

          {reviews.length === 0 && (
            <p className="text-muted-foreground italic">No reviews yet. Be the first to add one!</p>
          )}

          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-4 bg-background shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">
                    {review.user.username[0].toUpperCase()}
                  </div>
                  <span className="font-medium">{review.user.username}</span>
                </div>
                <p className="whitespace-pre-wrap text-muted-foreground">{review.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
