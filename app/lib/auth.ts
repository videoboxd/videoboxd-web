import ky from "ky";
import { z } from "zod";
import type {
  ResponseAuthMe,
  ResponseLogin,
  ResponseRegister,
} from "~/features/user/type";

import { serverApiUrl } from "~/lib/api-server";

export type User = {
  id: string;
  fullname: string;
  email: string;
  avatarUrl: string;
  username: string;
};

export const UserLoginPayloadSchema = z.object({
  username: z.string({ message: "This field is required" }),
  password: z.string({ message: "This field is required" }),
});

export const UserRegisterPayloadSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
  password: z.string({ message: "Password is required" }),
  fullName: z.string({ message: "Fullname is required" }),
  username: z.string({ message: "Username is required" }),
});

export type UserLoginPayload = z.infer<typeof UserLoginPayloadSchema>;
export type UserRegisterPayload = z.infer<typeof UserRegisterPayloadSchema>;

export type Auth = {
  register: (data: UserRegisterPayload) => Promise<ResponseRegister>;
  login: (data: UserLoginPayload) => Promise<ResponseLogin>;
  getUser: (
    accessToken?: string,
    refreshToken?: string
  ) => Promise<ResponseAuthMe | null>;
  logout: () => Promise<User>;
};

export const auth: Auth = {
  register: async (data: UserRegisterPayload) => {
    return await ky
      .post(`${serverApiUrl}/auth/register`, { json: data })
      .json<ResponseRegister>();
  },

  login: async (data: UserLoginPayload) => {
    return await ky
      .post(`${serverApiUrl}/auth/login`, { json: data })
      .json<ResponseLogin>();
  },

  getUser: async (accessToken, refreshToken) => {
    try {
      const data = await ky
        .get(`${serverApiUrl}/auth/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            // Cookie: `access_token=${accessToken}; refresh_token=${refreshToken};`,
          },
        })
        .json<ResponseAuthMe>();
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  logout: async () => {
    return await ky.delete(`${serverApiUrl}/auth/logout`).json<User>();
  },
};
