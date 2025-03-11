import { z } from 'zod';
import { Cookies as ReactCookie } from 'react-cookie';
import { dueDate } from './utils';
import ky from 'ky';
import { apiUrl } from "~/lib/api";

export const UserLoginPayloadSchema = z.object({
   username: z.string({message: 'This field is required'}),
   password: z.string({message: 'This field is required'}),
});

export const UserRegisterPayloadSchema = z.object({
   username: z.string({message: 'Username is required'}),
   email: z.string({message: 'Email is required'}),
   password: z.string({message: 'Password is required'}),
});

export type UserLoginPayload = z.infer<typeof UserLoginPayloadSchema>;
export type UserRegisterPayload = z.infer<typeof UserRegisterPayloadSchema>;

export type Auth = {
   isAuthenticated: boolean;
   getToken: () => void;
   register: (userRegister: UserRegisterPayload) => Promise<boolean>;
   login: (userLogin: UserLoginPayload) => Promise<boolean>;
   logout: () => void;
};

const COOKIE_NAME = 'access-token-name';

export const accessTokenCookie = new ReactCookie(null, {
   path: '/',
   sameSite: 'none',
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
      const response = await ky.post(`${apiUrl}/auth/register`, {json: userRegister}).json();

      console.log(`xyzTHis is data register: ${response}`);

      return true;
   },
   login: async (userLogin: UserLoginPayload) => {
      const response = await ky.post(`${apiUrl}/auth/login`, {json: userLogin}).json();
      
      console.log(`xyzTHis is login: ${response}`);
      return false;
   },
   logout: () => {
      accessToken.remove();
      auth.isAuthenticated = false;
   },
};