import { createCookieSessionStorage } from "react-router";

type SessionData = {
  userId: string;
  accessToken: string;
  refreshToken: string;
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: "__session",
      // expires: new Date(Date.now() + 60_000),
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      sameSite: "lax",
      secrets: [String(process.env.SECRET)],
      secure: true,
    },
  });

export { getSession, commitSession, destroySession };
