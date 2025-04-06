import ky from "ky";
import { Link } from "react-router";
import { Card, CardContent } from "~/components/ui/card";
import type { ResponseVideosIdentifier } from "~/features/video/type";
import { serverApiUrl } from "~/lib/api-server";
import type { Route } from "./+types/video-details";

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
  return { video };
}

export default function VideoDetailsRoute({
  loaderData,
}: Route.ComponentProps) {
  const { video } = loaderData;

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
                  {new Date(video.uploadedAt || new Date()).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
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
              <Link to="/" className="text-sm text-blue-500 hover:underline">
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
