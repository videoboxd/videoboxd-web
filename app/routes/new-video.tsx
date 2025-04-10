import type { Route } from "./+types/new-video";
import { Form, Link, redirect, useNavigate } from "react-router";
import { Label } from "@radix-ui/react-label";
import { FilePlus } from "lucide-react";

import { VideoFormSchema } from "~/lib/video";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
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
    { title: "Add New Video  - Videoboxd" },
    { name: "description", content: "Add a new video to be reviewed." },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.has("userId")) {
    return redirect("/login");
  }

  const categories = await ky
    .get(`${serverApiUrl}/categories`, {
      credentials: "include",
      headers: { Authorization: `Bearer ${session.get("accessToken")}` },
    })
    .json<Array<{ id: string; name: string; slug: string }>>();

  return { categories };
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

  const video = await ky
    .post(`${serverApiUrl}/videos`, {
      credentials: "include",
      headers: { Authorization: `Bearer ${session.get("accessToken")}` },
      json: submission.value,
    })
    .json<ResponseNewVideo>();
  if (!video) return { error: "Failed to add new video" };

  return { video };
}

export default function NewVideoRoute({
  actionData,
  loaderData,
}: Route.ComponentProps) {
  const { video, error } = actionData || {};
  const { categories } = loaderData;

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
            <div className="flex flex-row m-2 items-center">
              <div className="inline-flex gap-1 items-center">
                <FilePlus />
                <h1 className="text-2xl font-bold">Add a new video</h1>
              </div>
            </div>

            <Form
              method="post"
              id={form.id}
              onSubmit={form.onSubmit}
              className="p-6 md:p-8"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <Label className="w-24">Video URL</Label>
                  <Input
                    name="originalUrl"
                    type="text"
                    placeholder="Paste your video URL here"
                    className="flex-1 bg-white rounded-md placeholder:text-gray-500 text-slate-800"
                  />
                </div>
                <p className="text-red-400 text-xs ml-28">{fields.originalUrl.errors}</p>

                <div className="flex items-center gap-4">
                  <Label className="w-24">Category</Label>
                  <Select name="categorySlug">
                    <SelectTrigger className="bg-white rounded-md">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.slug}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end mt-6 w-full">
                  <Button type="submit" className="cursor-pointer w-full">
                    Submit Video
                  </Button>
                </div>
              </div>
            </Form>

            <div className="px-6 pb-8">
              <div className="flex flex-col gap-4">
                <div className="border border-white w-full aspect-[16/9] items-center justify-center flex">
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
                <div className="flex w-full aspect-[16/9] border border-white items-center justify-center">
                  {video?.originalUrl ? (
                    <VideoPlayer url={video.originalUrl} />
                  ) : (
                    <p className="text-white">No Video</p>
                  )}
                </div>
                <div className="flex justify-end gap-4 mt-4 w-full">
                  <Button
                    className="cursor-pointer w-full"
                    disabled={!actionData?.video?.platformVideoId}
                    onClick={() => {
                      navigate(`/watch/${video?.platformVideoId}`);
                    }}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
