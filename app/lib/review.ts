import { z } from "zod";

export const reviewFormSchema = z.object({
  text: z
    .string()
    .min(1, "Review is required"),
  rating: z.number(),
});

export type ReviewFormValues = z.infer<typeof reviewFormSchema>;