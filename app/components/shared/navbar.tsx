import { Link } from "react-router";

type AuthUser = {
  id: number;
  fullname: string;
  email: string;
  avatar: string;
};

export function Navbar() {
  return (
    <div className="fixed flex w-full items-center justify-center p-4 bg-[#00000080]">
      <div className="max-w-screen-xl w-full flex justify-between">
        <Link to="/">
          <h2 className="p-2 font-brand text-2xl tracking-tight text-white md:text-3xl">
            Videoboxd
          </h2>
        </Link>
        <div className="hidden items-center gap-8 text-base font-semibold md:flex">
          <Link to="/login">
            <div className="py-4 px-6 bg-blue-400 rounded-full">Login</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
