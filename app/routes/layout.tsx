import { useEffect } from "react";
import { Outlet, ScrollRestoration, useNavigate } from "react-router";
import { Footer } from "~/components/shared/footer";
import { Navbar } from "~/components/shared/navbar";
import { auth } from "~/lib/auth";
import type { Route } from "./+types/layout";

const navigationItems = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
];

export async function loader() {
  return null;
}

export default function LayoutRoute({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await auth.getUser();
      if (authenticated  && location.pathname === "/login") return navigate("/");
    };

    checkAuth();
  }, []);
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={loaderData} />

      <main className="flex-[1] bg-neutral-600">
        <Outlet />
      </main>

      <Footer />
      <ScrollRestoration />
    </div>
  );
}
