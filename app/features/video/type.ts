import type { paths } from "~/schema";
import type { ElementType } from "~/types/util";

export type ResponseVideos =
  paths["/videos"]["get"]["responses"][200]["content"]["application/json"];

export type ResponseVideo = ElementType<ResponseVideos>;

export type ResponseVideosIdentifier =
  paths["/videos/{identifier}"]["get"]["responses"][200]["content"]["application/json"];

export type ResponseNewVideo =
  paths["/videos"]["post"]["responses"][201]["content"]["application/json"];

export type ResponseAllVideos =
  paths["/videos"]["get"]["responses"][200]["content"]["application/json"];
