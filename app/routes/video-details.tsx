import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { Card, CardContent } from "~/components/ui/card";
import { apiUrl } from "~/lib/api";
import ky from "ky";
import type { ResponseVideo } from "~/features/video/type";
import { generateVideoSlug } from "~/lib/slug";
import VideoNotFound from "~/features/video/components/VideoNotFound";

type VideoDetails = ResponseVideo;

export default function VideoDetailsRoute() {
  const { slug } = useParams();
  const [video, setVideo] = useState<VideoDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await ky.get(`${apiUrl}/videos`).json<VideoDetails[]>();
        const matchingVideo = response.find(video => {
          const videoSlug = generateVideoSlug(video.title, video.uploadedAt || new Date());
          return videoSlug === slug;
        });
        
        if (!matchingVideo) {
          throw new Error("Video not found");
        }
        
        setVideo(matchingVideo);
      } catch (err) {
        setError("Failed to load video details");
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchVideoDetails();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  if (error || !video) {
    return <VideoNotFound error={error} />;
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="mb-6">
            <img
              src={video.thumbnailUrl || undefined}
              alt={video.title}
              className="w-full rounded-lg object-cover"
            />
          </div>

          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold">{video.title}</h1>
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <span>{video.platform?.name}</span>
                <span>•</span>
                <span>
                  {new Date(video.uploadedAt || new Date()).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              {video.categories?.map((category) => (
                <span
                  key={category.id}
                  className="rounded-full bg-muted px-3 py-1 text-sm"
                >
                  {category.name}
                </span>
              ))}
            </div>

            <div className="whitespace-pre-wrap text-muted-foreground">
              {video.description}
            </div>

            <div className="pt-4 flex gap-4">
              <Link
                to="/"
                className="text-sm text-blue-500 hover:underline"
              >
                Back to Home
              </Link>
              <a
                href={video.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-500 hover:underline"
              >
                Watch on {video.platform?.name}
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}