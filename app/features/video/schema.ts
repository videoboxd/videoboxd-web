import type { Platform } from "~/features/platform/schema";

export interface Video {
  id: string;
  userId: string;
  platformId: string;
  platformVideoId: string;
  originalUrl: string;
  title: string;
  description: string;
  thumbnail: string;
  uploadedAt: string;
  createdAt: string;
  updatedAt: string;
  platform: Platform;
  categories: string[];
}
