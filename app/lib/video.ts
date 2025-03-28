import { z } from "zod";
import ky from "ky";
import { clientApiUrl } from "./api-client";

export const youtubeRegex =
  /(?:youtube\.com\/(?:.*[?&]v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

export const VideoFormSchema = z.object({
  originalUrl: z
    .string()
    .min(1, "YouTube URL is required")
    .regex(youtubeRegex, "Invalid YouTube URL"),
  // platform: z.string().default("youtube"),
  categorySlug: z.string(),
});

export type VideoFormValues = z.infer<typeof VideoFormSchema>;

export function extractYouTubeID(url: string) {
  const match = url.match(youtubeRegex);
  return match ? match[1] : null;
}

export const checkVideoExists = async (
  setIsSaved: (value: boolean) => void,
  videoId: string
) => {
  if (!videoId) return;

  try {
    const response = await ky.get(`${clientApiUrl}/videos/${videoId}`, {
      credentials: "include",
    });

    if (response.ok) {
      setIsSaved(true);
      const data = await response.json();
      return data;
    } else {
      setIsSaved(false);
    }
  } catch (error) {
    console.error("Error checking video existance", error);
    setIsSaved(false);
  }
};
