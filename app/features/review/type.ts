import type { paths } from "~/schema";
import type { ElementType } from "~/types/util";

export type ResponseReviews =
  paths["/reviews"]["get"]["responses"][200]["content"]["application/json"];

export type ResponseReview = ElementType<ResponseReviews>;