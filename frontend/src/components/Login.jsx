import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaKey, FaBolt, FaLock, FaEnvelope } from "react-icons/fa";
import "./../styles/Login.css";

const DEMO_EMAIL = "admin123@dev.com";
const DEMO_PASSWORD = "admin123";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const destination = location.state?.from?.pathname || "/";
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleFillDemo = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      const destination = location.state?.from?.pathname || "/";
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message || "Erreur de connexion. Vérifiez vos identifiants.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <div className="login-icon-badge">
            <FaLock size={22} />
          </div>
          <h2>Espace Authentification</h2>
          <p className="login-subtitle">Plateforme de Reporting & Suivi d'Exportation</p>
        </div>

        {error && (
          <div className="login-error-alert">
            <span className="error-dot"></span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Adresse Email</label>
            <div className="input-with-icon">
              <FaEnvelope className="field-icon" size={16} />
              <input
                id="email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin123@dev.com"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <div className="input-with-icon">
              <FaLock className="field-icon" size={16} />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Votre mot de passe"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? "Masquer" : "Afficher"}
              </button>
            </div>
          </div>

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? (
              <span className="btn-spinner-content">
                <span className="spinner-dot"></span> Connexion en cours...
              </span>
            ) : (
              "Se connecter"
            )}
          </button>
        </form>

        {/* Demo Credentials Box - Clean and professional without emojis */}
        <div className="demo-credentials-box">
          <div className="demo-header">
            <span className="demo-badge">
              <FaKey className="demo-badge-icon" size={12} />
              Compte de Démonstration
            </span>
            <button
              type="button"
              className="demo-fill-btn"
              onClick={handleFillDemo}
            >
              <FaBolt size={11} />
              Remplir automatiquement
            </button>
          </div>
          <div className="demo-info-grid">
            <div className="demo-field">
              <span className="demo-label">Email</span>
              <code className="demo-value">{DEMO_EMAIL}</code>
            </div>
            <div className="demo-field">
              <span className="demo-label">Mot de passe</span>
              <code className="demo-value">{DEMO_PASSWORD}</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
