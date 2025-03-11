import { Link, Outlet, ScrollRestoration } from "react-router";
import { Footer } from "~/components/shared/footer";
import { Navbar } from "~/components/shared/navbar";

const navigationItems = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
];

export default function LayoutRoute() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-[1] bg-neutral-600">
        <Outlet />
      </main>

      <Footer />
      <ScrollRestoration />
    </div>
  );
}
