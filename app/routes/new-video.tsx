import type { Route } from "./+types/home";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Label } from "@radix-ui/react-label";
import { FilePlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ky from "ky";

import { serverApiUrl } from "~/lib/api-server";
import { videoFormSchema, extractYouTubeID } from "~/lib/video";
import type { VideoFormValues } from "~/lib/video";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { ReviewButton } from "~/components/ui/review-button";
import { checkVideoExists } from "~/lib/video";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Register New Video" },
    { name: "description", content: "Register a new video to be reviewed." },
  ];
}

export default function NewVideoRoute() {
  // FIXME: Use react-hook-form or Conform
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [videoData, setVideoData] = useState<{
    title: string;
    thumbnailUrl: string;
  } | null>(null);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<VideoFormValues>({
    resolver: zodResolver(videoFormSchema),
  });
  const originalUrl = watch("originalUrl", "");

  useEffect(() => {
    const validId = extractYouTubeID(originalUrl);
    setVideoId(validId);

    if (originalUrl.trim() === "") {
      setIsSaved(false);
    }
  }, [originalUrl]);

  useEffect(() => {
    if (videoId) {
      const check = async () => {
        const data = await checkVideoExists(setIsSaved, videoId);
        if (data) {
          setVideoData({ title: data.title, thumbnailUrl: data.thumbnailUrl });
        }
      };
      check();
      alert("This video is already registered.");
    }
  }, [videoId]);

  const goBack = () => {
    navigate(-1);
  };

  const onSubmit = async (data: any) => {
    if (isSaved) {
      return;
    }

    setIsSubmitting(true);

    const payload = {
      ...data,
    };

    try {
      const response = await ky.post(`${serverApiUrl}/videos`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        json: payload,
      });

      if (response.ok) {
        alert("Succesfully submitted new video");
        setIsSaved(true);
      } else {
        const errorData = await response.json().catch(() => null);
        console.error("Error response:", errorData);
        alert(
          `Failed to submit video. Server returned: ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      console.error("Error posting new video", error);
      alert("Failed to submit video. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <Card>
          <div className="py-3 px-6">
            <div className="flex flex-row justify-between items-center mb-4">
              <div className="flex flex-row m-2">
                <div className="m-1">
                  <FilePlus />
                </div>
                <h1 className="text-2xl font-bold">Register A Video</h1>
              </div>
              <ReviewButton
                isSaved={isSaved}
                videoId={videoId}
                title={videoData?.title}
                thumbnailUrl={videoData?.thumbnailUrl}
              />
            </div>
            <div className="flex flex-row">
              <div className="grid grid-cols-1 flex-1/2">
                <form method="post" onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex flex-col">
                    <Label className="m-2">Video Link</Label>
                    <Input
                      {...register("originalUrl")}
                      type="text"
                      placeholder="Paste your video link here"
                      className="bg-white rounded-md m-2 py-1 px-3 placeholder:text-gray-500 text-slate-800"
                    />
                    {errors.originalUrl && (
                      <p className="text-red-500 m-2">
                        {errors.originalUrl.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <Label className="m-2">Category</Label>
                    <Input
                      {...register("categorySlug")}
                      type="text"
                      placeholder="Video Category"
                      className="bg-white rounded-md m-2 py-1 px-3 placeholder:text-gray-500 text-slate-800"
                      disabled={isSaved}
                    />
                  </div>
                  <div className="flex flex-row justify-between mt-10">
                    <button
                      type="submit"
                      disabled={isSubmitting || isSaved}
                      className={`rounded-full px-3 py-2 m-2 font-medium transition-colors ${
                        isSaved
                          ? "bg-gray-500 text-white cursor-not-allowed"
                          : "bg-sky-400 text-black hover:bg-sky-500"
                      }`}
                    >
                      {isSaved
                        ? "✔ Saved"
                        : isSubmitting
                        ? "Saving..."
                        : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={goBack}
                      className="bg-gray-500 rounded-full px-3 py-2 m-2 text-white font-medium hover:bg-gray-600 transition-colors"
                    >
                      Back
                    </button>
                  </div>
                </form>
              </div>
              <div className="flex-1/2 p-4">
                <div className="flex border border-white w-full aspect-[16/9] m-3 items-center justify-center">
                  {videoId ? (
                    <img
                      src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                      alt="YouTube Thumbnail"
                      className="w-full object-cover"
                    />
                  ) : (
                    <p className="text-white">No Thumbnail</p>
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
