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
    </footer>
  );
}
