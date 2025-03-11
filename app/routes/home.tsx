import ky from "ky";
import { Button } from "~/components/ui/button";
import type { Route } from "./+types/home";
import { apiUrl } from "~/lib/api";
import heroImage from "~/asset/images/hero-image.png";
import SearchForm from "~/components/shared/SearchFrom";
import VideoContent from "~/components/shared/VideoContent";
import type { Video } from "~/schema/schema";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Videoboxd" },
    { name: "description", content: "Explore interesting videos." },
  ];
}

export async function loader(): Promise<{ videos: Video[] }> {
  const videos = await ky.get(`${apiUrl}/videos`).json<Video[]>();
  return { videos };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { videos } = loaderData;

  return (
    <div
      className="bg-fixed bg-cover bg-top bg-no-repeat"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <section className="min-h-[90dvh] flex flex-col items-center justify-center font-bold text-5xl md:text-6xl px-8">
        <h1 className="text-center leading-20">
          Explore interesting videos
          <br />
          Rate your favorites
          <br />
          Tell your friends
        </h1>
        <SearchForm />
      </section>

      <section className="bg-[#1a1a1a]">
        <div className="container mx-auto py-12">
          <h3 className="text-4xl">Popular review this week...</h3>
          <div className="mt-8">
            <ul className="grid grid-cols-3">
              {videos.map((video) => (
                <VideoContent key={video.id} {...video} />
              ))}
            </ul>
          </div>

          <h3 className="text-4xl mt-12">Just reviewed...</h3>
          <div className="mt-8 overflow-x-auto">
            <ul className="flex flex-nowrap">
              {videos.map((video) => (
                <VideoContent key={video.id} {...video} />
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
