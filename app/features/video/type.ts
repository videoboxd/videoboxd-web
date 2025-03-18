import type { paths } from "~/schema";
import type { ElementType } from "~/types/util";

export type ResponseVideos =
  paths["/videos"]["get"]["responses"][200]["content"]["application/json"];

export type ResponseVideo = ElementType<ResponseVideos>;
