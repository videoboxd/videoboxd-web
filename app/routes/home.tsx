import ky from "ky";
import { useEffect } from "react";
import SearchForm from "~/components/shared/SearchFrom";
import VideoContent from "~/components/shared/VideoContent";
import type { ResponseVideos } from "~/features/video/type";
import { serverApiUrl } from "~/lib/api-server";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Videoboxd" },
    { name: "description", content: "Explore interesting videos." },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const videos = await ky
    .get(q ? `${serverApiUrl}/videos?q=${q}` : `${serverApiUrl}/videos`)
    .json<ResponseVideos>();
  return { videos, q };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { videos, q } = loaderData;

  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  }, [q]);

  return (
    <div>
      <section className="flex flex-col items-center justify-center font-bold text-xl px-8">
        <h1 className="text-center leading-20">Rate interesting videos</h1>
        <SearchForm searchQuery={q || ""} />
      </section>

      <section className="bg-[#1a1a1a]">
        <div className="container mx-auto py-12">
          <div className="mt-8">
            <ul className="grid grid-cols-3">
              {videos.map((video) => (
                <VideoContent key={video.id} video={video} />
              ))}
            </ul>
          </div>

          <h3 className="text-4xl mt-12">Just reviewed...</h3>

          <div className="mt-8 overflow-x-auto">
            <ul className="flex flex-wrap">
              {videos.map((video) => (
                <VideoContent key={video.id} video={video} />
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
