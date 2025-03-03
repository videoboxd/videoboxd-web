import { Button } from "~/components/ui/button";
import type { Route } from "./+types/home";
import { apiUrl } from "~/lib/api";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Videoboxd" },
    { name: "description", content: "Explore interesting videos." },
  ];
}

// TODO:
type Video = {
  id: string;
  title: string;
  description: string;
  url: string;
};

// TODO: use ky package
// export async function loader() {
//   const response = await fetch(`${apiUrl}/videos`);
//   const videos: Video[] = await response.json();

//   return { videos };
// }

export default function Home({ loaderData }: Route.ComponentProps) {
  // const { videos } = loaderData;

  return (
    <div>
      <h1 className="text-3xl">Videboxd</h1>
      <Button>Search Videos</Button>

      <ul>
        {/* {videos.map((video) => (
          <li key={video.id}>
            <h2>{video.title}</h2>
            <p>{video.description}</p>
            <a href={video.url}>Watch</a>
          </li>
        ))} */}
      </ul>
    </div>
  );
}
