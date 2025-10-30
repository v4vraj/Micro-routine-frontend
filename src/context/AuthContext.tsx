import React, { createContext, useState, useContext } from "react";

// The base URL of your Flask API
const API_URL = "/api/auth";

// Define the shape of the context's dat  a
interface AuthContextType {
  user: string | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create the context with a default value
export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
});

// Create the provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Initialize state from localStorage to persist login across page reloads
  const [user, setUser] = useState<string | null>(() =>
    localStorage.getItem("user")
  );
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // --- LOGIN FUNCTION ---
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to login."); // backend sends `detail` for 401
      }

      // Store user and token properly
      localStorage.setItem("user", email);
      localStorage.setItem("token", data.access_token); // ⚡ key fix
      setUser(email);
      setToken(data.access_token);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // --- SIGNUP FUNCTION ---
  const signup = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create account.");
      }

      // Optionally, you can automatically log the user in after a successful signup
      await login(username, password);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // --- LOGOUT FUNCTION ---
  const logout = () => {
    // Clear user data from both state and localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  // Provide the auth state and functions to the rest of the app
  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, error, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily use the auth context in other components
export const useAuth = () => {
  return useContext(AuthContext);
};
