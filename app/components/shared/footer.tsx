import { Link } from "react-router";

export function Footer() {
  return (
    <footer className=" flex flex-col items-center justify-between bg-neutral-950 p-4 md:flex-row md:p-8">
      <div className="flex flex-col items-center gap-2 md:items-start">
        <h2 className="font-brand text-2xl text-white md:text">Videoboxd</h2>
        <p className="text-center text-sm md:text-left text-neutral-300">
          Explore interesting videos.
        </p>
        <div className="text-white">© Videoboxd. All Rights Reserved.</div>
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-4 md:mt-0 md:flex-row md:gap-8">
        <div className="min-w-[120px] flex-1 text-sm">
          <h2 className="font-bold tracking-tight text-white">Help</h2>
          <ul className="mt-2 space-y-1 text-white">
            <li>
              <Link to="/">Contact Us</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
