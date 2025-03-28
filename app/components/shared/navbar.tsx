import { Link } from "react-router";
import type { ResponseAuthMe } from "~/features/user/type";
import { Button } from "../ui/button";

export function Navbar({ user }: { user: ResponseAuthMe | null }) {
  return (
    <div className="flex w-full items-center justify-center p-4 bg-[#00000080]">
      <div className="max-w-screen-xl w-full flex justify-between">
        <Link to="/">
          <h2 className="p-2 font-brand text-2xl tracking-tight text-white md:text-3xl">
            Videoboxd
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
            <p>{user.fullName}</p>
            <Button asChild>
              <Link to="/new">New Video</Link>
            </Button>
            <Button asChild>
              <Link to="/logout">Logout</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
