// import type { Member } from "~/features/about/type";
import { Icon } from "@iconify/react/dist/iconify.js";

import { Link } from "react-router";

export type TeamCardProps = {
  name: string;
  role: string;
  image: string;
  github: string;
  linkedin: string;
};

export default function MemberCard({ team }: { team: TeamCardProps }) {
  return (
    <div className="relative w-full aspect-[5/6] rounded-xl overflow-hidden shadow-md group">
      <img
        src={team.image}
        alt={team.name}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:rotate-5 group-hover:scale-110"
      />
      <div className="absolute bottom-0 left-0 w-full px-2 py-2 bg-neutral-900/40 bg-opacity-25 ">
        <p className="text-sm font-semibold text-white bg-opacity-50">
          {team.name}
        </p>
        <p className="text-xs text-white">{team.role}</p>
        <div className="flex gap-2 mt-3">
          <Link to={team.linkedin} target="_blank">
            <Icon
              icon="fa-brands:linkedin"
              className="text-[16px] text-gray-100 hover:text-gray-400"
            />
          </Link>
          <Link to={team.github} target="_blank">
            <Icon
              icon="fa-brands:github"
              className="text-[16px] text-gray-100 hover:text-gray-400"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
