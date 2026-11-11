import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh",
        fontSize: "18px",
        color: "#16a34a",
        fontWeight: "600"
      }}>
        Chargement...
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page and preserve the intended destination
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
