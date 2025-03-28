import { z } from "zod";
import ky from "ky";
import { apiUrl } from "./api";

export const youtubeRegex =
  /(?:youtube\.com\/(?:.*[?&]v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

export const videoFormSchema = z.object({
  originalUrl: z
    .string()
    .min(1, "YouTube URL is required")
    .regex(youtubeRegex, "Invalid YouTube URL"),
  // platform: z.string().default("youtube"),
  categorySlug: z.string()
});

export type VideoFormValues = z.infer<typeof videoFormSchema>;

export function extractYouTubeID(url: string) {
  const match = url.match(youtubeRegex);
  return match ? match[1] : null;
}

export const checkVideoExists = async (setIsSaved: (value: boolean) => void, videoId: string) => {
  if (!videoId) return;

  try {
    const response = await ky.get(`${apiUrl}/videos/${videoId}`, {
      credentials: "include",
    });

    if (response.ok) {
      setIsSaved(true)
    } else {
      setIsSaved(false);
    }
  } catch (error) {
    console.error("Error checking video existance", error);
    setIsSaved(false);
  };
}