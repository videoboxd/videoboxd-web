import { zodResolver } from "@hookform/resolvers/zod";
import ky from "ky";
import { FilePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Form, useNavigate } from "react-router";
import { z } from "zod";

import ReactPlayer from "react-player";
import ToastAlert from "~/components/shared/ToastAlert";
import { apiUrl } from "~/lib/api";

const youtubeRegex =
  /(?:youtube\.com\/(?:.*[?&]v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
const youtubeRegexStrict =
  /^https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})$/;

const videoFormSchema = z.object({
  originalUrl: z
    .string()
    .min(1, "YouTube URL is required")
    .regex(youtubeRegex, "Invalid YouTube URL"),
  categorySlug: z.string().default("technology"),
});

type VideoFormValues = z.infer<typeof videoFormSchema>;

function extractYouTubeID(url: string) {
  let match = url.match(youtubeRegex);
  if (!match) {
    match = url.match(youtubeRegexStrict);
  }
  return match ? match[1] : null;
}

export default function NewVideoRoute() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOriginalUrlSubmitted, setIsOriginalUrlSubmitted] = useState(false);
  const [error, setError] = useState({
    isError: false,
    title: "",
    description: "",
  });
  const [success, setSuccess] = useState({
    isSuccess: false,
    title: "",
    description: "",
  });

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
      categorySlug: "youtube",
    },
  });
  const originalUrl = watch("originalUrl", "");

  useEffect(() => {
    const validId = extractYouTubeID(originalUrl);
  }, [originalUrl]);

  const goToHome = () => {
    navigate("/");
  };

  const goBack = () => {
    navigate(-1);
  };

  const handlOnEnter = () => {
    setIsOriginalUrlSubmitted(true);
  };

  const handleOnErrorAlertClose = () => {
    setError((prev) => ({
      ...prev,
      isError: false,
    }));
  };

  const handleOnSuccessAlertClose = () => {
    setSuccess((prev) => ({
      ...prev,
      isSuccess: false,
    }));
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);

    const payload = {
      ...data,
    };

    console.log(`Payload: ${JSON.stringify(payload)}`);
    setError((prev) => ({
      ...prev,
      isError: false,
    }));

    try {
      const response = await ky.post(`${apiUrl}/videos`, {
        json: payload,
        throwHttpErrors: false,
        credentials: "include",
      });

      if (response.ok) {
        setError((prev) => ({ ...prev, isError: false }));
        setSuccess((prev) => ({
          ...prev,
          isSuccess: true,
          title: "Video entry created successfully",
          description: "Your video has been added successfully.",
        }));
        reset();
        goBack();
      } else {
        const errorData: { message: string } = (await response
          .json()
          .catch(() => ({
            message: "Unknown error occurred",
            success: false,
          }))) as {
          message: string;
          success: boolean;
        };
        setSuccess((prev) => ({ ...prev, isSuccess: false }));
        setError((prev) => ({
          ...prev,
          isError: true,
          title: "Oops! Something went wrong..",
          description: errorData.message,
        }));
      }
    } catch (error) {
      console.error("Error posting new video", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="m-5 bg-slate-700 p-3 border rounded-xl">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row m-2">
          <div className="m-1">
            <FilePlus />
          </div>
          <h1 className="text-3xl">Create New Video Entry</h1>
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
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handlOnEnter();
                  }
                }}
                onBlur={handlOnEnter}
                placeholder="Paste your video link here"
                className="bg-white rounded-md m-2 py-1 px-3 placeholder:text-gray-500 text-slate-800"
              />
              {errors.originalUrl && (
                <p className="text-red-500 m-2">{errors.originalUrl.message}</p>
              )}
            </div>
            <div className="flex flex-col">
              <label className="m-2">Category</label>
              <select
                {...register("categorySlug")}
                className="bg-white rounded-md m-2 py-1 px-3 placeholder:text-gray-500 text-slate-800"
              >
                <option value="technology">Technology</option>
                <option value="gaming">Gaming</option>
                <option value="education">Education</option>
                <option value="entertainment">Entertainment</option>
                <option value="music">Music</option>
                <option value="politic">Politic</option>
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
          <div
            className={`border ${
              !errors.originalUrl && isOriginalUrlSubmitted
                ? "border-0"
                : "border-white"
            } w-full aspect-[16/9] m-3`}
          >
            {!errors.originalUrl && isOriginalUrlSubmitted ? (
              <ReactPlayer url={originalUrl} />
            ) : (
              <p className="text-center text-white">No Thumbnail</p>
            )}
          </div>
        </div>
      </div>
      {success.isSuccess && (
        <ToastAlert
          title={success.title}
          description={success.description}
          handleClose={handleOnSuccessAlertClose}
        />
      )}
      {error.isError && (
        <ToastAlert
          title={error.title}
          description={error.description}
          handleClose={handleOnErrorAlertClose}
        />
      )}
    </div>
  );
}
