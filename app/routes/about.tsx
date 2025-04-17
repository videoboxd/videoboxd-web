import MemberCard from "~/components/shared/MemberCard";
import type { Route } from "./+types/about";
import teamData from "~/data/teamData";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About Videoboxd" },
    { name: "description", content: "Explore interesting videos." },
  ];
}

export async function loader() {
  return null;
}

export default function AboutRoute() {
  return (
    <div className="flex w-full items-center justify-center p-4">
      <div className="flex min-h-svh max-w-screen-xl w-full mt-10">
        <div className="relative flex w-full items-center flex-col pt-[20px] md:pt-0">
          <div className="text-2xl font-sans font-semibold text-neutral-50 mb-2">
            About Videoboxd
          </div>
          <div className="text-lg font-sans mb-8 text-center">
            Videoboxd is a platform that allows users to explore and share
            interesting videos. Our mission is to provide a space where users
            can discover new content, share their favorites, and connect with
            others who share their interests.
          </div>
          <div className="text-2xl font-sans font-semibold mt-4 mb-2">
            Our Team
          </div>
          <div className="text-lg font-sans text-center">
            Our team is made up of passionate individuals who are dedicated to
            creating the best possible experience for our users. We are always
            looking for ways to improve and welcome feedback from our community.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-10">
            {teamData.map((team, index) => (
              <MemberCard key={index} team={team} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
