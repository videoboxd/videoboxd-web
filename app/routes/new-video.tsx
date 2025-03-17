import type { Route } from "./+types/home";
import { useState, useEffect, useRef } from "react";
import { Form, useNavigate } from "react-router";
import { FilePlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ky from "ky";
import { apiUrl } from "~/lib/api";
import { youtubeRegex, videoFormSchema, extractYouTubeID } from "~/lib/video";
import type { VideoFormValues } from "~/lib/video";

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

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<VideoFormValues>({
    resolver: zodResolver(videoFormSchema),
    defaultValues: {
      platform: "youtube",
    },
  });
  const originalUrl = watch("originalUrl", "");

  useEffect(() => {
    const validId = extractYouTubeID(originalUrl);
    setVideoId(validId);
  }, [originalUrl]);

  const goToHome = () => {
    navigate("/");
  };

  const goBack = () => {
    navigate(-1);
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);

    let formattedDate: string | null = null;
    if (data.uploadedAt && data.uploadedAt.trim() !== "") {
      try {
        const dateParts = data.uploadedAt.split("-");
        const year = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]) - 1; // JS months are 0-indexed
        const day = parseInt(dateParts[2]);

        // Create date with time to match your working example format
        const uploadedDate = new Date(Date.UTC(year, month, day, 18, 28, 0));

        if (!isNaN(uploadedDate.getTime())) {
          formattedDate = uploadedDate.toISOString();
        } else {
          formattedDate = new Date().toISOString(); // Fallback to current date
        }
      } catch (error) {
        console.error("Date parsing error:", error);
        formattedDate = new Date().toISOString();
      }
    } else {
      formattedDate = new Date().toISOString();
    }

    const payload = {
      ...data,
      userId: "01JNYFWJKVV32X3MRP7R2YQGES",
      platformVideoId: videoId,
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      uploadedAt: formattedDate,
    };

    try {
      const response = await ky.post(`${apiUrl}/videos`, {
        json: payload,
        throwHttpErrors: false,
      });

      if (response.ok) {
        alert("Succesfully submitted new video");
        reset();
        goBack();
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
    <div className="mt-20 m-5 bg-slate-700 p-3 border rounded-xl">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row m-2">
          <div className="m-1">
            <FilePlus />
          </div>
          <h1 className="text-3xl">Create Review</h1>
        </div>
        <div className="m-2">
          <button className="text-lg cursor-pointer" onClick={goToHome}>
            Close
          </button>
        </div>
      </div>
      <div className="flex flex-row">
        <div className="grid grid-cols-1 flex-2/3">
          <Form method="post" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col">
              <label className="m-2">Video Link</label>
              <input
                {...register("originalUrl")}
                type="text"
                placeholder="Paste your video link here"
                className="bg-white rounded-md m-2 py-1 px-3 placeholder:text-gray-500 text-slate-800"
              />
              {errors.originalUrl && (
                <p className="text-red-500 m-2">{errors.originalUrl.message}</p>
              )}
            </div>
            <div className="flex flex-col">
              <label className="m-2">Platform</label>
              <select
                {...register("platform")}
                className="bg-white rounded-md m-2 py-1 px-3 placeholder:text-gray-500 text-slate-800"
              >
                <option>youtube</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-sky-400 rounded-full px-3 py-2 m-2 text-black font-medium ${
                  isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-sky-500 transition-colors"
                }`}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={goBack}
                className="bg-gray-500 rounded-full px-3 py-2 m-2 text-white font-medium hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </Form>
        </div>
        <div className="flex-1/3 m-4">
          <div className="border border-white w-full aspect-[16/9] m-3">
            {videoId ? (
              <img
                src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                alt="YouTube Thumbnail"
                className="w-full object-cover"
              />
            ) : (
              <p className="text-center text-white">No Thumbnail</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
