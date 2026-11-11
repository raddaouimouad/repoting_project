import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./components/HomePage";
import CategoryPage from "./components/CategoryPage";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import Login from "./components/Login";

function App() {
  return (
    <AuthProvider>
      <div className="app-layout">
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/categorie/:nomCategorie"
              element={
                <ProtectedRoute>
                  <CategoryPage />
                </ProtectedRoute>
              }
            />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
