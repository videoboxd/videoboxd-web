import { Link } from "react-router";

export function Footer() {
  return (
    <footer className="flex w-full items-center justify-center p-6 bg-neutral-950 text-neutral-300">
      <div className="flex flex-col items-start max-w-screen-xl w-full space-y-4">
        <h2 className="font-brand text-2xl text-white">Videoboxd</h2>
        <p className="text-left text-sm">
          Explore interesting videos and share your favorites.
        </p>
        <div className="text-center text-xs">
          © {new Date().getFullYear()} Videoboxd. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
