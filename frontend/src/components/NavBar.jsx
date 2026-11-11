import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import "./../styles/Navbar.css";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleContactClick = (e) => {
    e.preventDefault();
    if (location.pathname === "/") {
      document.getElementById("footer")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/?scrollTo=footer");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* LOGO */}
        <Link to="/" className="navbar-logo">
          <img
            src="/logo-ocp.png"
            alt="OCP Logo"
            onError={(e) => {
              e.target.style.display = "none";
              const brandText = document.getElementById("navbar-fallback-brand");
              if (brandText) brandText.style.display = "block";
            }}
          />
          <span
            id="navbar-fallback-brand"
            className="navbar-brand-text"
            style={{ display: "none" }}
          >
            OCP Reporting
          </span>
        </Link>

        {/* NAVIGATION LINKS */}
        <nav className="navbar-links">
          {isAuthenticated && (
            <Link to="/" className="navbar-link">
              Accueil
            </Link>
          )}

          <a onClick={handleContactClick} className="navbar-link contact-btn">
            Contact
          </a>

          {isAuthenticated ? (
            <div className="navbar-user-section">
              <span className="navbar-user-badge">
                <FaUser className="user-icon" size={12} />
                <span className="user-name-text">
                  {user?.name || user?.email || "Admin"}
                </span>
              </span>
              <button
                onClick={handleLogout}
                className="navbar-link logout-btn"
                title="Se déconnecter"
              >
                <FaSignOutAlt size={13} />
                <span>Déconnexion</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className="navbar-link login-nav-btn">
              Connexion
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
