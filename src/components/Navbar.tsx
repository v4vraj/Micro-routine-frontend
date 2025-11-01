import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { LogOut, LayoutDashboard, Shield } from "lucide-react";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      {/* Left Section - App Logo & Links */}
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

      {/* Right Section - User Info */}
      <div className="flex items-center space-x-4">
        {user && (
          <>
            <span className="text-gray-700 text-sm font-medium">👋 {user}</span>
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-3 py-2 rounded-lg transition"
            >
              <LogOut size={16} />
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
