import { Link } from "react-router";
import type { ResponseAuthMe } from "~/features/user/type";
import { Button } from "../ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";

export function Navbar({ user }: { user: ResponseAuthMe | null }) {
  return (
    <div className="flex w-full items-center justify-center p-4 bg-neutral-950">
      <div className="max-w-screen-xl w-full flex justify-between">
        <Link to="/">
          <h2 className="p-2 font-brand text-2xl tracking-tight text-white md:text-3xl">
            🎞️Videoboxd
          </h2>
        </Link>

        {!user && (
          <div className="hidden items-center gap-8 text-base font-semibold md:flex">
            <Button asChild>
              <Link to="/login">Login</Link>
            </Button>
          </div>
        )}

        {user && (
          <div className="hidden items-center gap-8 text-base font-semibold md:flex">
            <Button asChild radius={"full"}>
              <Link to="/new">
                <Icon icon="mdi:plus" className="text-white text-lg" />
                New Video
              </Link>
            </Button>

            <Link to={"/dashboard"}>
              <span className="relative bg-neutral-800 flex size-9 shrink-0 overflow-hidden rounded-full">
                <img
                  className="aspect-square h-full w-full"
                  src={user?.avatarUrl ?? ""}
                />
              </span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
