import { Outlet, ScrollRestoration } from "react-router";
import { Footer } from "~/components/shared/footer";
import { Navbar } from "~/components/shared/navbar";
import { destroySession, getSession } from "~/lib/sessions";
import type { Route } from "./+types/layout";
import { auth } from "~/lib/auth";

export async function loader({ request }: Route.LoaderArgs) {
  // TODO: Fix this session issue that cause the navigation to be blocked
  const session = await getSession(request.headers.get("Cookie"));

  const userId = session.get("userId");
  if (!userId) {
    await destroySession(session);
    return { user: null };
  }

  const accessToken = session.get("accessToken");
  const refreshToken = session.get("refreshToken");

  const user = await auth.getUser(accessToken, refreshToken);

  return { user: null };
}

export default function LayoutRoute({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={user} />

      <main className="bg-gradient-to-br from-purple-950 via-sky-950 to-blue-950 dark:from-indigo-950 dark:via-blue-950 dark:to-neutral-950 bg-[#00000090]">
        <Outlet />
      </main>

      <Footer />
      <ScrollRestoration />
    </div>
  );
}
