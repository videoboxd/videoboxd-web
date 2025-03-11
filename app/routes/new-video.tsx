import { useState, useEffect, useRef } from "react";
import { Form, useNavigate } from "react-router";
import { FilePlus, Heart } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ky from "ky";

import { apiUrl } from "~/lib/api";
import StarRatingBasic from "~/components/commerce-ui/star-rating-basic";

// FIXME: Move all of these to a separate file

const youtubeRegex =
  /(?:youtube\.com\/(?:.*[?&]v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

const ALLOWED_TAGS = [
  "technology",
  "gaming",
  "education",
  "entertainment",
  "music",
] as const;

const TagEnum = z.enum(ALLOWED_TAGS);

type Tag = z.infer<typeof TagEnum>;

const videoFormSchema = z.object({
  originalUrl: z
    .string()
    .min(1, "YouTube URL is required")
    .regex(youtubeRegex, "Invalid YouTube URL"),
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  uploadedAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format. Please enter a valid date.",
  }),
  description: z.string().optional(),
  platform: z.string().default("youtube"),
  tags: z.array(TagEnum).default([]).optional(),
  review: z.string().min(1, "Review is required"),
});

type VideoFormValues = z.infer<typeof videoFormSchema>;

function extractYouTubeID(url: string) {
  const match = url.match(youtubeRegex);
  return match ? match[1] : null;
}

// FIXME: Move to a separate component file
function LikeButton({ setLike }: { setLike: (liked: boolean) => void }) {
  const [liked, setLiked] = useState(false);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        setLiked(!liked);
        setLike(!liked);
      }}
      className="transition duration-100 cursor-pointer"
    >
      <Heart
        className={`w-8 h-8 transition-all ${
          liked
            ? "fill-red-500 text-red-500"
            : "text-gray-400 hover:text-red-500 hover:fill-red-500"
        }`}
      />
    </button>
  );
}

export default function NewVideoRoute() {
  // FIXME: Use react-hook-form or Conform
  const [rating, setRating] = useState(0);
  const [isLike, setLike] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [tagError, setTagError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
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

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
    setTagError(null);
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      const trimmedTag = tagInput.trim();
      if (trimmedTag) {
        if (trimmedTag && ALLOWED_TAGS.includes(trimmedTag as Tag)) {
          if (!selectedTags.includes(trimmedTag as Tag)) {
            setSelectedTags([...selectedTags, trimmedTag as Tag]);
            setValue("tags", [...selectedTags, trimmedTag as Tag]);
          }
          setTagInput("");
        } else {
          setTagError(`"${trimmedTag}" is not an allowed tag.`);
        }
      }
    }
  };

  const removeTag = (tagToRemove: Tag) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
    setValue(
      "tags",
      selectedTags.filter((tag) => tag !== tagToRemove)
    );
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

    // const tagList = data.tags ? data.tags.split(',').map((tag: any) => tag.trim()).filter((tag: any) => tag.length > 0) : [];

    const payload = {
      ...data,
      userId: "01JNYFWJKVV32X3MRP7R2YQGES",
      platformVideoId: videoId,
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      rating: rating,
      like: isLike,
      uploadedAt: formattedDate,
      tags: selectedTags,
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
    <div className="m-5 bg-slate-700 p-3 border rounded-xl">
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
              <label className="m-2">Title</label>
              <input
                {...register("title")}
                type="text"
                placeholder="Please input video title"
                className="bg-white rounded-md m-2 py-1 px-3 placeholder:text-gray-500 text-slate-800"
              />
              {errors.title && (
                <p className="text-red-500 m-2">{errors.title.message}</p>
              )}
            </div>
            <div className="flex flex-col">
              <label className="m-2">Uploaded At</label>
              <input
                {...register("uploadedAt")}
                type="date"
                className="bg-white rounded-md m-2 py-1 px-3 placeholder:text-gray-500 text-slate-800"
              />
              {errors.uploadedAt && (
                <p className="text-red-500 m-2">{errors.uploadedAt.message}</p>
              )}
            </div>
            <div className="flex flex-col">
              <label className="m-2">Description</label>
              <textarea
                {...register("description")}
                placeholder="Please describe the video"
                className="bg-white rounded-md m-2 py-1 px-3 placeholder:text-gray-500 text-slate-800"
              />
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
            <div className="flex flex-col">
              <label className="m-2">Tags</label>
              <div className="flex flex-wrap m-2">
                {selectedTags.map((tag) => (
                  <div
                    key={tag}
                    className="m-1 px-3 py-1 rounded-md bg-sky-500 text-white flex items-center"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-white"
                    >
                      x
                    </button>
                  </div>
                ))}
                <input
                  ref={inputRef}
                  type="text"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyDown={handleTagInputKeyDown}
                  placeholder="Enter tags (space or enter to add)"
                  className="bg-white rounded-md m-1 py-1 px-3 placeholder:text-gray-500 text-slate-800"
                />
              </div>
              {tagError && <p className="text-red-500 m-2">{tagError}</p>}
              {/* <input
                  {...register("tags")}
                  type="text"
                  placeholder="e.g. music, technology"
                  className="bg-white rounded-md m-2 py-1 px-3 placeholder:text-gray-500 text-slate-800"
                /> */}
            </div>
            <div className="flex flex-col">
              <label className="m-2">Your Review</label>
              <textarea
                {...register("review")}
                placeholder="add your review here"
                className="bg-white rounded-md m-2 py-1 px-3 placeholder:text-gray-500 text-slate-800"
              />
              {errors.review && (
                <p className="text-red-500 m-2">{errors.review.message}</p>
              )}
            </div>
            <div className="flex flex-row justify-between">
              <div className="flex flex-col item-start m-2">
                <div className="text-sm m-1 mb-3">Rating</div>
                <div className="flex flex-row items-center gap-4">
                  <StarRatingBasic
                    value={rating}
                    onChange={setRating}
                    maxStars={5}
                  />
                  <p>({rating})</p>
                </div>
              </div>
              <div className="flex flex-col items-center m-2 mr-3">
                <div className="text-sm m-1 mb-1">Like</div>
                <div className="m-2 cursor-pointer">
                  <LikeButton setLike={setLike} />
                </div>
              </div>
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
