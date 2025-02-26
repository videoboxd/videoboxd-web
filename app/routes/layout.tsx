import { Link, Outlet } from "react-router";

const navigationItems = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
];

export default function LayoutRoute() {
  return (
    <div className="flex flex-col min-h-screen">
      <nav className="p-4 bg-gray-800">
        <ul className="flex gap-4">
          {navigationItems.map((navItem) => (
            <li key={navItem.label}>
              <Link to={navItem.to}>{navItem.label}</Link>
            </li>
          ))}
        </ul>
      </nav>

      <main className="flex-[1]">
        <Outlet />
      </main>

      <footer className="p-4 bg-gray-800">
        <p>Footer</p>
      </footer>
    </div>
  );
}
