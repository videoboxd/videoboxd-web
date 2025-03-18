import { z } from "zod";
import { Cookies as ReactCookie } from "react-cookie";
import ky from "ky";

import { dueDate } from "~/lib/date";
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
  getToken: () => void;
  register: (userRegister: UserRegisterPayload) => Promise<boolean>;
  login: (userLogin: UserLoginPayload) => Promise<boolean>;
  getUser(): Promise<User | null>;
  logout: () => void;
};

const COOKIE_NAME = "access-token-name";

export const accessTokenCookie = new ReactCookie(null, {
  path: "/",
  sameSite: "none",
  secure: true,
  expires: dueDate(30),
});

export const accessToken = {
  get: () => {
    return accessTokenCookie.get(COOKIE_NAME) || null;
  },
  set: (token: string) => {
    accessTokenCookie.set(COOKIE_NAME, token);
  },
  remove: () => {
    accessTokenCookie.remove(COOKIE_NAME);
  },
};

export const auth: Auth = {
  isAuthenticated: false,
  getToken: () => {
    return accessToken.get();
  },
  register: async (userRegister: UserRegisterPayload) => {
    try {
      const response = await ky
      .post(`${apiUrl}/auth/register`, { json: userRegister })
      .json<ApiResponse<User>>();

    if (!response) return false;
    
    return true;
    } catch (error) {
      console.error(error);
      return false
    }
  },
  login: async (userLogin: UserLoginPayload) => {
    try {
      const response = await ky
      .post(`${apiUrl}/auth/login`, { json: userLogin })
      .json<ApiResponse<User>>();

      auth.isAuthenticated = true;

      return true;    

    } catch (error) {
      console.error(error);
      accessToken.remove();
      auth.isAuthenticated = false;
      return false;
    }
  
  },
  getUser: async () => {
    const token = accessToken.get();
    if (!token) return null;
    try {
      const response = await ky.get(`${apiUrl}/auth/me`).json<User>();

      auth.isAuthenticated = true;

      return response;
    } catch (error) {
      console.error(error);

      accessToken.remove();
      auth.isAuthenticated = false;
      return null
    }
  },
  logout: () => {
    accessToken.remove();
    auth.isAuthenticated = false;
  },
};
