import { Link } from "react-router";

export default function VideoNotFound({ error }: { error?: string | null }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
      <div className="text-6xl font-bold">404</div>
      <h1 className="text-2xl font-semibold">{error || "Video not found"}</h1>
      <p className="text-muted-foreground">The video you're looking for doesn't exist or has been removed.</p>
      <Link
        to="/"
        className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back to Home
      </Link>
    </div>
  );
}