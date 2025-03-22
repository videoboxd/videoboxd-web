import ky from "ky";
import { z } from "zod";

import { apiUrl } from "~/lib/api";

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

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
  isAuthenticated: boolean;
  register: (userRegister: UserRegisterPayload) => Promise<boolean>;
  login: (userLogin: UserLoginPayload) => Promise<boolean>;
  getUser(): Promise<User | null>;
  logout: () => void;
};

export const auth: Auth = {
  isAuthenticated: false,
  register: async (userRegister: UserRegisterPayload) => {
    try {
      const response = await ky
        .post(`${apiUrl}/auth/register`, { json: userRegister })
        .json<ApiResponse<User>>();

      if (!response) return false;

      return true;
    } catch (error) {
      return false;
    }
  },
  login: async (userLogin: UserLoginPayload) => {
    try {
      const response = await ky
        .post(`${apiUrl}/auth/login`, {
          json: userLogin,
          credentials: "include",
          mode: "cors",
        })
        .json<ApiResponse<User>>();

      auth.isAuthenticated = true;

      return true;
    } catch (error) {
      auth.isAuthenticated = false;
      return false;
    }
  },
  getUser: async () => {
    try {
      const response = await ky
        .get(`${apiUrl}/auth/me`, {
          credentials: "include",
        })
        .json<User>();

      auth.isAuthenticated = true;

      return response;
    } catch (error) {
      auth.isAuthenticated = false;
      return null;
    }
  },
  logout: async () => {
    try {
      const response = await ky
        .delete(`${apiUrl}/auth/logout`, {
          credentials: "include",
        })
        .json<User>();

      auth.isAuthenticated = false;

      return response;
    } catch (error) {
      return null;
    }
  },
};
