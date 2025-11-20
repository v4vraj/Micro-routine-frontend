import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { LogOut, LayoutDashboard, Shield, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      {/* Left Section */}
      <div className="flex items-center space-x-6">
        <h1 className="text-2xl font-bold text-indigo-600 tracking-tight">
          FitTrack
        </h1>

        <div className="hidden sm:flex space-x-4">
          <Link
            to="/dashboard"
            className={`flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg transition ${
              location.pathname === "/dashboard"
                ? "bg-indigo-100 text-indigo-700"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          <Link
            to="/permission"
            className={`flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg transition ${
              location.pathname === "/permission"
                ? "bg-indigo-100 text-indigo-700"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <Shield size={18} />
            Permission
          </Link>
        </div>
      </div>

      {/* Right Section */}
      <div className="relative" ref={dropdownRef}>
        {user && (
          <>
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-3 py-2 rounded-full transition"
            >
              <User size={16} />
              {`${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() ||
                user.username}{" "}
              ▼
            </button>

            {/* Dropdown */}
            {open && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border p-1 z-50">
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <User size={16} />
                  Profile
                </Link>

                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
