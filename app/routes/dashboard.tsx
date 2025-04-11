import ky from "ky";
import { Link, redirect } from "react-router";
import VideoContentUser from "~/components/shared/VideoContentUser";
import { Button } from "~/components/ui/button";
import type { ResponseUsersIndetifier } from "~/features/user/type";
import { serverApiUrl } from "~/lib/api-server";
import { auth } from "~/lib/auth";
import { getSession } from "~/lib/sessions";
import type { Route } from "./+types/dashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard - Videoboxd" },
    { name: "description", content: "Your Videoboxd dashboard" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  const accessToken = session.get("accessToken");
  const refreshToken = session.get("refreshToken");

  const user = await auth.getUser(accessToken, refreshToken);

  if (!session.has("userId")) {
    return redirect("/login");
  }

  const userWithData = await ky
    .get(`${serverApiUrl}/users/${user?.id}`)
    .json<ResponseUsersIndetifier>();

  return { userWithData };
}

export default function DashboardRoute({ loaderData }: Route.ComponentProps) {
  const { userWithData } = loaderData;

  return (
    <div className="flex w-full items-center justify-center p-4">
      <div className="flex flex-col min-h-svh max-w-screen-xl w-full ">
        <div className="relative flex w-full flex-col pt-[20px] md:pt-0">
          <p className="text-2xl font-semibold text-neutral-50 mb-10">
            Welcome to your dashboard
          </p>

          <div className="h-min flex  max-w-full">
            <span className="relative flex h-40 w-40 shrink-0 overflow-hidden rounded-xl bg-white/50">
              <img
                className="aspect-square h-full w-full"
                src={userWithData?.avatarUrl ?? ""}
              />
            </span>
            <div className="pl-4">
              <p className="text-xl font-extrabold text-zinc-950 dark:text-white md:text-3xl">
                {userWithData?.username}
              </p>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 md:mt-2 md:text-base">
                {userWithData?.fullName ?? ""}
              </p>
              <Button asChild className="mt-10">
                <Link to="/logout">Logout</Link>
              </Button>
            </div>
          </div>
          {/* Divider */}
          <div className="border-t border-gray-300 my-6"></div>
          <div>
            <p className="text-2xl font-semibold text-neutral-50 mb-10">
              Your videos
            </p>
            <div className="mt-8">
              <ul className="grid grid-cols-4 gap-4">
                {userWithData?.videos.map((video) => (
                  <VideoContentUser key={video.id} video={video} />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
