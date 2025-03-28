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
  register: (data: UserRegisterPayload) => any;
  login: (data: UserLoginPayload) => any;
  getUser: () => any;
  logout: () => any;
};

export const auth: Auth = {
  register: async (data: UserRegisterPayload) => {
    try {
      return await ky
        .post(`${serverApiUrl}/auth/register`, { json: data })
        .json<ResponseRegister>();
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  login: async (data: UserLoginPayload) => {
    try {
      return await ky
        .post(`${serverApiUrl}/auth/login`, { json: data })
        .json<ResponseLogin>();
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  getUser: async () => {
    try {
      return await ky.get(`${serverApiUrl}/auth/me`).json<ResponseAuthMe>();
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  logout: async () => {
    try {
      return await ky.delete(`${serverApiUrl}/auth/logout`).json<User>();
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};
