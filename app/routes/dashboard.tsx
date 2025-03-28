import { getSession } from "~/lib/sessions.server";
import type { Route } from "./+types/dashboard";
import { redirect } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard - Videoboxd" },
    { name: "description", content: "Your Videoboxd dashboard" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.has("userId")) {
    return redirect("/login");
  }

  return { userId: session.get("userId") };
}

export default function DashboardRoute({ loaderData }: Route.ComponentProps) {
  const { userId } = loaderData;

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">Welcome to your dashboard</p>
      <pre>{JSON.stringify({ userId }, null, 2)}</pre>
    </div>
  );
}
