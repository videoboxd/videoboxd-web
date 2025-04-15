import { parseWithZod } from "@conform-to/zod";
import { Label } from "@radix-ui/react-label";
import ky from "ky";
import { useState } from "react";
import { Form, redirect, useNavigate } from "react-router";
import StarRatingBasic from "~/components/commerce-ui/star-rating-basic";
import { Card } from "~/components/ui/card";
import { TextArea } from "~/components/ui/textarea";
import type { ResponseVideoIdentifier } from "~/features/video/type";
import { serverApiUrl } from "~/lib/api-server";
import { reviewFormSchema } from "~/lib/review";
import { getSession } from "~/lib/sessions";
import type { Route } from "./+types/review-video";
import type { ResponseReviews } from "~/features/review/type";

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

export async function loader({ request, params }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const currentUserId = session.get("userId") || null;
  if (!session.has("userId")) return redirect("/login");

  const { videoId } = params;
  const video = await ky
    .get(`${serverApiUrl}/videos/${videoId}`)
    .json<ResponseVideoIdentifier>();

  const reviews = await ky
    .get(`${serverApiUrl}/reviews?videoId=${video.id}`)
    .json<ResponseReviews>();

  const isUserReview = currentUserId
    ? reviews.some((review) => review.userId === currentUserId)
    : false;

  if (isUserReview) {
    return redirect(`/watch/${videoId}`);
  }

  return { video };
}

export async function action({ params, request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.has("userId")) {
    return redirect("/login");
  }

  const formData = await request.formData();
  // const review = Object.fromEntries(formData);
  const review = parseWithZod(formData, {
    schema: reviewFormSchema,
  });
  if (review.status !== "success") return { error: "Failed to add new review" };
  const { videoId } = params;

  const submittedReview = await ky
    .post(`${serverApiUrl}/reviews/${videoId}`, {
      credentials: "include",
      headers: { Authorization: `Bearer ${session.get("accessToken")}` },
      json: review.value,
    })
    .json();

  return redirect(`/watch/${videoId}`);
}

export default function NewReviewRoute({ loaderData }: Route.ComponentProps) {
  const { video } = loaderData;
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <Card className="bg-neutral-900/60">
          <div className="py-3 px-6">
            <div className="flex flex-row justify-between mb-4">
              <h1 className="text-2xl font-bold">Submit Review</h1>
            </div>
            <div className="grid grid-cols-1">
              <img
                src={video.thumbnailUrl || undefined}
                alt="video-thumbnail"
                className="p-2 justify-self-center rounded-xl"
              />
              <h1 className="p-2 text-xl font-bold">{video.title}</h1>

              <Form method="post">
                <div className="flex flex-col">
                  <Label className="m-2">Review</Label>
                  <TextArea
                    name="text"
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
                  <input type="hidden" name="rating" value={rating} />
                </div>
                <div className="flex flex-row justify-between mt-10">
                  <button
                    type="submit"
                    className="bg-sky-400 hover:bg-sky-500 rounded-full px-3 py-2 m-2 text-black font-medium"
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
