import type { paths } from "~/schema";

export type ResponseRegister =
  paths["/auth/register"]["post"]["responses"][201]["content"]["application/json"];

export type ResponseLogin =
  paths["/auth/login"]["post"]["responses"][200]["content"]["application/json"];

export type ResponseAuthMe =
  paths["/auth/me"]["get"]["responses"][200]["content"]["application/json"];
