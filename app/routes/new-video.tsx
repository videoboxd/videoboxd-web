import type { Route } from "./+types/home";
import { useState, useEffect } from "react";
import { Form, useSubmit } from "react-router";
import StarRating_Basic from "components/commerce-ui/star-rating-basic";
import { FilePlus, Heart } from "lucide-react";
import { useForm } from "react-hook-form";
import ky from "ky";
import { apiUrl } from "~/lib/api";

function LoveButton({ setLike }: {setLike: (liked: boolean) => void }) {
  const [liked, setLiked] = useState(false);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        setLiked(!liked);
        setLike(!liked);
      }}
      className="transition duration-100 cursor-pointer"
    >
      <Heart
        className={`w-8 h-8 transition-all ${
          liked ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500 hover:fill-red-500"
        }`}
      />
    </button>
  )
}

const youtubeRegex = /(?:youtube\.com\/(?:.*[?&]v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

function extractYouTubeID(url: string) {
  const match = url.match(youtubeRegex);
  return match ? match[1] : null;
}

export default function NewVideo() {
    const [rating, setRating] = useState(0);
    const [isLike, setLike] = useState(false);
    const [videoId, setVideoId] = useState<string | null>(null);

    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const originalUrl = watch("originalUrl", "");

    useEffect(() => {
      const validId = extractYouTubeID(originalUrl);
      setVideoId(validId); // Now runs only when originalUrl changes
    }, [originalUrl]);

    const onSubmit = async (data: any) => {
      if (data.uploadedAt && data.uploadedAt.trim() !== '') {
        try {
          const dateParts = data.uploadedAt.split('-');
          const year = parseInt(dateParts[0]);
          const month = parseInt(dateParts[1]) - 1; // JS months are 0-indexed
          const day = parseInt(dateParts[2]);
          
          // Create date with time to match your working example format
          const uploadedDate = new Date(Date.UTC(year, month, day, 18, 28, 0));
          
          if (!isNaN(uploadedDate.getTime())) {
            data.uploadedAt = uploadedDate.toISOString();
          } else {
            data.uploadedAt = new Date().toISOString(); // Fallback to current date
          }
        } catch (error) {
          console.error("Date parsing error:", error);
          data.uploadedAt = new Date().toISOString();
        }
      } else {
        data.uploadedAt = new Date().toISOString();
      }
      data.tags = data.tags ? data.tags.split(',').map((tag: any) => tag.trim()).filter((tag: any) => tag.length > 0) : [];
      data['userId'] = "01JNYFWJKVV32X3MRP7R2YQGES";
      data['platformVideoId'] = videoId;
      data['thumbnail'] = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      data['rating'] = rating;
      data['like'] = isLike;

      console.log("Sending Data:", JSON.stringify(data, null, 2));

      try {
        await ky.post(`${apiUrl}/videos`, {json: data}).json();
        alert("Succesfully submitted new video");
      } catch (error) {
        console.error("Error posting new video", error);
        alert("Failed to submit video. Check console for details.");
      }
    }

    return (
      <div className="m-5 bg-slate-700 p-3 border rounded-xl">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row m-2">
            <div className="m-1">
              <FilePlus/>
            </div>
            <h1 className="text-3xl">Create Review</h1>
          </div>
          <div className="m-2">
            <button className="text-lg cursor-pointer">
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
                  {...register("originalUrl", {
                    required: "YouTube URL is required",
                    pattern: {
                      value: youtubeRegex,
                      message: "Invalid YouTube URL",
                    }
                  })}
                  type="text"
                  placeholder="Paste your video link here"
                  className="bg-white rounded-md m-2 py-1 px-3 placeholder:text-gray-500 text-slate-800"
                />
                {errors.originalUrl && <p className="text-red-500 m-2">{String(errors.originalUrl.message)}</p>}
              </div>
              <div className="flex flex-col">
                <label className="m-2">Title</label>
                <input 
                  {...register("title")}
                  type="text"
                  placeholder="Please input video title"
                  className="bg-white rounded-md m-2 py-1 px-3 placeholder:text-gray-500 text-slate-800"
                />
              </div>
              <div className="flex flex-col">
                <label className="m-2">Uploaded At</label>
                <input 
                  {...register("uploadedAt")}
                  type="date"
                  className="bg-white rounded-md m-2 py-1 px-3 placeholder:text-gray-500 text-slate-800"
                />
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
                <input
                  {...register("tags")}
                  type="text"
                  placeholder="e.g. music, technology"
                  className="bg-white rounded-md m-2 py-1 px-3 placeholder:text-gray-500 text-slate-800"
                />
              </div>
              <div className="flex flex-col">
                <label className="m-2">Your Review</label>
                <textarea
                  {...register("review")}
                  placeholder="add your review here"
                  className="bg-white rounded-md m-2 py-1 px-3 placeholder:text-gray-500 text-slate-800"
                />
              </div>
              <div className="flex flex-row justify-between">
                <div className="flex flex-col item-start m-2">
                  <div className="text-sm m-1 mb-3">
                    Rating
                  </div>
                  <div className="flex flex-row items-center gap-4">
                    <StarRating_Basic value={rating} onChange={setRating} maxStars={5} />
                    <p>({rating})</p>
                  </div>
                </div>
                <div className="flex flex-col items-center m-2 mr-3">
                  <div className="text-sm m-1 mb-1">
                    Like
                  </div>
                  <div className="m-2 cursor-pointer">
                    <LoveButton
                      setLike={setLike}
                    />
                  </div>
                </div>
              </div>
              <button type="submit">
                <div className="bg-sky-400 rounded-full px-3 py-2 m-2 text-black font-medium">
                  Save
                </div>
              </button>
            </Form>
          </div>
          <div className="flex-1/3 m-4">
            <div className="border border-white w-full aspect-[16/9] m-3">
              {
                videoId ?
                <img
                  src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                  alt="YouTube Thumbnail"
                  className="w-full object-cover"
                /> :
                <p className="text-center text-white">No Thumbnail</p>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
  