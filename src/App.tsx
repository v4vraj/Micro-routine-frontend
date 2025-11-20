import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ProtectedRoutes from "./pages/auth/ProtectedRoutes";
import Dashboard from "./pages/Dashboard";
import Permissions from "./pages/Permissions";
import MainLayout from "./layouts/MainLayout";
import OAuthSuccess from "./pages/OAuthSuccess";
import Profile from "./components/Profile";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected */}
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <MainLayout />
            </ProtectedRoutes>
          }
        >
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="permission" element={<Permissions />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
