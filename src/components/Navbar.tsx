import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav
      style={{
        padding: "10px",
        background: "#f0f0f0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <Link to="/dashboard" style={{ marginRight: "10px" }}>
          Dashboard
        </Link>
        <Link to="/permission">Permission</Link>
      </div>
      <div>
        {user && (
          <>
            <span style={{ marginRight: "10px" }}>👋 {user}</span>
            <button onClick={logout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
