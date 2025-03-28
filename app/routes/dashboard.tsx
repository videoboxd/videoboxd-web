import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard - Videoboxd" },
    { name: "description", content: "Your Videoboxd dashboard" },
  ];
}

export async function loader() {
  return null;
}

export default function DashboardRoute() {
  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">Welcome to your dashboard</p>
    </div>
  );
}
