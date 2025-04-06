import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { Form, useNavigate } from "react-router";
import StarRatingBasic from "~/components/commerce-ui/star-rating-basic";
import { Card } from "~/components/ui/card";
import { TextArea } from "~/components/ui/textarea";
import type { Route } from "./+types/new-review";
import ky from "ky";
import { serverApiUrl } from "~/lib/api-server";
import type { ResponseVideosIdentifier } from "~/features/video/type";

export function meta({ data }: Route.MetaArgs) {
  return [
    {
      title:
        `Review: ${data.video.title} - Videoboxd` || "Video Title - Videoboxd",
    },
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

export default function NewReviewRoute({ loaderData }: Route.ComponentProps) {
  const { video } = loaderData;
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <Card>
          <div className="py-3 px-6">
            <div className="flex flex-row justify-between mb-4">
              <h1 className="text-2xl font-bold">Submit Review</h1>
            </div>
            <div className="grid grid-cols-1">
              <img
                src={video.thumbnailUrl || undefined}
                alt="video-thumbnail"
                className="p-2 justify-self-center"
              />
              <h1 className="p-2 text-xl font-bold">{video.title}</h1>

              <Form method="post">
                <div className="flex flex-col">
                  <Label className="m-2">Review</Label>
                  <TextArea
                    placeholder="Write your review..."
                    className="bg-white rounded-md m-2 py-1 px-3 placeholder:text-gray-500 text-slate-800"
                  />
                  {/* TODO: Error message */}
                </div>
                <div className="flex flex-col">
                  <Label className="m-2">Rating</Label>
                  <StarRatingBasic
                    value={rating}
                    onChange={setRating}
                    maxStars={5}
                    className="p-2"
                  />
                </div>
                <div className="flex flex-row justify-between mt-10">
                  <button
                    type="submit"
                    className="bg-sky-400 rounded-full px-3 py-2 m-2 text-black font-medium"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="bg-gray-500 rounded-full px-3 py-2 m-2 text-white font-medium hover:bg-gray-600 transition-colors"
                  >
                    Back
                  </button>
                </div>
              </Form>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
