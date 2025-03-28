import { Outlet, ScrollRestoration } from "react-router";
import { Footer } from "~/components/shared/footer";
import { Navbar } from "~/components/shared/navbar";
import type { Route } from "./+types/layout";
import { destroySession, getSession } from "~/lib/sessions.server";
import { auth } from "~/lib/auth";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  const userId = session.get("userId");
  if (!userId) {
    await destroySession(session);
    return { user: null };
  }

  const accessToken = session.get("accessToken");
  const refreshToken = session.get("refreshToken");

  const user = await auth.getUser(accessToken, refreshToken);
  return { user };
}

export default function LayoutRoute({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;

  return (
    <div className="flex flex-col min-h-screen">
      <pre>{JSON.stringify(user)}</pre>
      <Navbar user={user} />

      <main className="flex-[1] bg-neutral-600">
        <Outlet />
      </main>

      <Footer />
      <ScrollRestoration />
    </div>
  );
}
