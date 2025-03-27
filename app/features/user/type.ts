import type { paths } from "~/schema";

export type ResponseAuthMe =
  paths["/auth/me"]["get"]["responses"][200]["content"]["application/json"];
