import type { Route } from "./+types/new-video";
import { Form, Link, redirect, useNavigate } from "react-router";
import { Label } from "@radix-ui/react-label";
import { FilePlus } from "lucide-react";

import { VideoFormSchema } from "~/lib/video";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { serverApiUrl } from "~/lib/api-server";
import ky from "ky";
import type { ResponseNewVideo } from "~/features/video/type";
import { getSession } from "~/lib/sessions.server";
import { Button } from "~/components/ui/button";
import VideoPlayer from "~/components/shared/VideoPlayer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Register New Video" },
    { name: "description", content: "Register a new video to be reviewed." },
  ];
}

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.has("userId")) {
    return redirect("/login");
  }

  const formData = await request.formData();
  const submission = parseWithZod(formData, {
    schema: VideoFormSchema,
  });
  if (submission.status !== "success")
    return { error: "Failed to add new video" };

  console.log({ submission });

  const video = await ky
    .post(`${serverApiUrl}/videos`, {
      credentials: "include",
      headers: { Authorization: `Bearer ${session.get("accessToken")}` },
      json: submission.value,
    })
    .json<ResponseNewVideo>();
  if (!video) return { error: "Failed to add new video" };

  console.log({ video });

  return { video };
}

export default function NewVideoRoute({ actionData }: Route.ComponentProps) {
  const { video, error } = actionData || {};

  const [form, fields] = useForm({
    shouldValidate: "onBlur",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: VideoFormSchema });
    },
  });

  const navigate = useNavigate();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      {error ? <div className="error">{error}</div> : null}

      <div className="w-full max-w-sm md:max-w-3xl">
        <Card>
          <div className="py-3 px-6">
            <div className="flex flex-row m-2 items-center justify-between">
              <div className="inline-flex gap-1 items-center">
                <FilePlus />
                <h1 className="text-2xl font-bold">Add a new video</h1>
              </div>
              <Button
                className="cursor-pointer"
                disabled={!actionData?.video?.platformVideoId}
                onClick={() => {
                  navigate(`/${video?.platformVideoId}`);
                }}
              >
                Continue
              </Button>
            </div>
            {/* <ReviewButton
                isSaved={isSaved}
                videoId={videoId}
                title={videoData?.title}
                thumbnailUrl={videoData?.thumbnailUrl}
              /> */}
            <div className="flex flex-row">
              <div className="grid grid-cols-1 flex-1/2">
                <Form
                  method="post"
                  id={form.id}
                  onSubmit={form.onSubmit}
                  className="p-6 md:p-8"
                >
                  <div className="flex flex-col">
                    <Label className="m-2">Video Link</Label>
                    <Input
                      name="originalUrl"
                      type="text"
                      placeholder="Paste your video link here"
                      className="bg-white rounded-md m-2 py-1 px-3 placeholder:text-gray-500 text-slate-800"
                    />
                    <p className="text-red-400 text-xs">
                      {fields.originalUrl.errors}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <Label className="m-2">Category</Label>
                    <Input
                      name="categorySlug"
                      type="text"
                      placeholder="Video Category"
                      className="bg-white rounded-md m-2 py-1 px-3 placeholder:text-gray-500 text-slate-800"
                    />
                  </div>
                  <div className="flex flex-row justify-between mt-10">
                    <Button type="submit" className="cursor-pointer">
                      Submit Video
                    </Button>
                  </div>
                </Form>
              </div>
              <div className="flex-1/2 p-4">
                <div className="flex border border-white w-full aspect-[16/9] m-3 items-center justify-center">
                  {video?.thumbnailUrl ? (
                    <img
                      src={video.thumbnailUrl}
                      alt="YouTube Thumbnail"
                      className="w-full object-cover"
                    />
                  ) : (
                    <p className="text-white">No Thumbnail</p>
                  )}
                </div>
                <div className="flex w-full aspect-[16/9] border border-white m-3 items-center justify-center">
                  {video?.originalUrl ? (
                    <VideoPlayer url={video.originalUrl} />
                  ) : (
                    <p className="text-white">No Video</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
