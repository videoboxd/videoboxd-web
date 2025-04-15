import ky from "ky";
import { useEffect } from "react";
import SearchForm from "~/components/shared/SearchFrom";
import VideoContent from "~/components/shared/VideoContent";
import type { ResponseVideos } from "~/features/video/type";
import { serverApiUrl } from "~/lib/api-server";
import type { Route } from "./+types/home";
import { Button } from "~/components/ui/button";
import { Link, NavLink, useNavigation } from "react-router";
import { LoaderIcon } from "lucide-react";
import { cn } from "~/lib/utils";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Videoboxd" },
    { name: "description", content: "Explore interesting videos." },
  ];
}

const DEFAULT_LIMIT = 6;

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") || "";
  const limit = Number(url.searchParams.get("limit") || DEFAULT_LIMIT);

  const videos = await ky
    .get(
      q
        ? `${serverApiUrl}/videos?q=${q}&offset=0&limit=${limit}`
        : `${serverApiUrl}/videos?offset=0&limit=${limit}`
    )
    .json<ResponseVideos>();

  return { videos, q, limit };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { videos, q, limit } = loaderData;

  const navigation = useNavigation();
  const isLoadingMore = navigation.state !== "idle";

  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  }, [q]);

  return (
    <div>
      <section className="flex flex-col items-center justify-center font-bold text-xl px-8 h-[80dvh] bg-[url('/images/home-bg.jpg')] bg-cover bg-center">
        <h1 className="text-center leading-20">Rate interesting videos</h1>
        <SearchForm searchQuery={q || ""} />
      </section>

      <section className="">
        <div className="container mx-auto py-12">
          <div className="mt-8">
            <ul className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
              {videos.map((video) => (
                <VideoContent key={video.id} video={video} />
              ))}
            </ul>

            {videos.length === limit && (
              <div className="mt-6 flex justify-center">
                <Button
                  asChild
                  disabled={isLoadingMore}
                  className={cn(isLoadingMore && "opacity-50")}
                >
                  <NavLink
                    preventScrollReset
                    to={
                      q
                        ? `?q=${q}&limit=${limit + DEFAULT_LIMIT}`
                        : `?limit=${limit + DEFAULT_LIMIT}`
                    }
                  >
                    {isLoadingMore && <LoaderIcon className="animate-spin" />}
                    <span>Load More</span>
                  </NavLink>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
