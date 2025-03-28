import type { Route } from "./+types/about";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About Videoboxd" },
    { name: "description", content: "Explore interesting videos." },
  ];
}

export default function AboutRoute() {
  return (
    <div>
      <h1 className="text-3xl">About Videboxd</h1>
    </div>
  );
}
