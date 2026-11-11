import { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from "../config/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("ocp_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("ocp_token") || null;
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("ocp_token");
    const storedUser = localStorage.getItem("ocp_user");

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("ocp_token");
        localStorage.removeItem("ocp_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    let res;
    try {
      res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
    } catch (err) {
      throw new Error("Impossible de contacter le serveur backend sur le port 3000. Vérifiez qu'il est bien démarré.");
    }

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error(
        "Le backend a renvoyé une réponse HTML au lieu de JSON. Veuillez redémarrer le serveur backend (Ctrl+C puis npm run dev)."
      );
    }

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Email ou mot de passe incorrect.");
    }

    localStorage.setItem("ocp_token", data.token);
    localStorage.setItem("ocp_user", JSON.stringify(data.user));

    setToken(data.token);
    setUser(data.user);

    return data;
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, { method: "POST" });
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem("ocp_token");
      localStorage.removeItem("ocp_user");
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
