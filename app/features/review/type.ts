import type { paths } from "~/schema";
import type { ElementType } from "~/types/util";

export type ResponseReviews =
  paths["/reviews"]["get"]["responses"][200]["content"]["application/json"];

// /videos/:videoId/reviews

export type ResponseReview = ElementType<ResponseReviews>;


export type ResponseReviewsIdentifier =
  paths["/reviews/{identifier}"]["get"]["responses"][200]["content"]["application/json"];
