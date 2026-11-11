import "./../styles/Footer.css";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="footer-container">
        {/* LEFT */}
        <div className="footer-left">
          <img
            src="/logo-ocp.png"
            alt="OCP Logo"
            className="footer-logo-img"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <p className="footer-text">
            Plateforme décisionnelle de suivi des exportations et des opérations maritimes.
          </p>
        </div>

        {/* RIGHT */}
        <div className="footer-right">
          <h4 className="footer-title">Réseaux Sociaux</h4>
          <div className="footer-socials">
            <a
              href="https://web.facebook.com/OCPGroupINT"
              target="_blank"
              rel="noreferrer"
              className="social-icon"
              aria-label="Facebook"
            >
              <FaFacebookF size={14} />
            </a>
            <a
              href="https://www.instagram.com/ocpgroup/"
              target="_blank"
              rel="noreferrer"
              className="social-icon"
              aria-label="Instagram"
            >
              <FaInstagram size={14} />
            </a>
            <a
              href="https://ma.linkedin.com/company/ocpgroup"
              target="_blank"
              rel="noreferrer"
              className="social-icon"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn size={14} />
            </a>
            <a
              href="https://www.youtube.com/ocpchannel"
              target="_blank"
              rel="noreferrer"
              className="social-icon"
              aria-label="YouTube"
            >
              <FaYoutube size={14} />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} OCP Group &mdash; Plateforme de Reporting Interne.</p>
      </div>
    </footer>
  );
}
