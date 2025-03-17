import { z } from "zod";

export const youtubeRegex =
  /(?:youtube\.com\/(?:.*[?&]v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

export const videoFormSchema = z.object({
  originalUrl: z
    .string()
    .min(1, "YouTube URL is required")
    .regex(youtubeRegex, "Invalid YouTube URL"),
  platform: z.string().default("youtube"),
});

export type VideoFormValues = z.infer<typeof videoFormSchema>;

export function extractYouTubeID(url: string) {
  const match = url.match(youtubeRegex);
  return match ? match[1] : null;
}