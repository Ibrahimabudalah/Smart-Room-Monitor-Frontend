import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex items-center justify-between bg-white shadow px-6 py-4">
        <h1 className="text-xl font-bold">Smart Room</h1>

        <div className="flex gap-6">
          <NavItem to="/dashboard" label="Dashboard" />
          <NavItem to="/chat" label="Chat" />
        </div>
      </div>

      {/* Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 md:hidden">
        <NavItem to="/dashboard" label="Dashboard" />
        <NavItem to="/chat" label="Chat" />
      </div>
    </>
  );
}

// Reusable Nav Item
function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `text-sm font-medium ${isActive ? "text-blue-500" : "text-gray-500"}`
      }
    >
      {label}
    </NavLink>
  );
}
