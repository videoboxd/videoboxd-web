import { Link } from "react-router";

export function Footer() {
  return (
    <footer className="flex w-full items-center justify-center p-6 bg-neutral-950 text-neutral-300">
      <div className="max-w-screen-xl w-full flex justify-between">
        <div className="flex flex-col items-start max-w-screen-xl">
          <h2 className="font-brand text-2xl text-white">Videoboxd</h2>
          <p className="text-left text-sm">
            Explore interesting videos and share your favorites.
          </p>
          <div className="text-center text-xs mt-5">
            © {new Date().getFullYear()} Videoboxd. All Rights Reserved.
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <ul className="flex flex-col space-x-4">
            <li>
              <Link
                to="/about"
                className="text-sm text-neutral-300 hover:underline"
                // target="_blank"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="https://github.com/videoboxd"
                className="text-sm text-neutral-300 hover:underline"
                target="_blank"
              >
                Source code on Github
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
