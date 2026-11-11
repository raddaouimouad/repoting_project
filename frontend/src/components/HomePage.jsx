import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaShip,
  FaChartPie,
  FaBoxes,
  FaFlask,
  FaIndustry,
  FaSeedling,
  FaArrowRight,
  FaSearch,
  FaCalendarAlt,
  FaDatabase,
  FaCheckCircle,
} from "react-icons/fa";
import "./../styles/HomePage.css";

const CATEGORIES_DATA = [
  {
    name: "Chargement",
    tag: "Opérations Portuaires",
    description: "Indicateurs et tonnages chargés par navire et terminal.",
    icon: FaShip,
  },
  {
    name: "Répartition Chargé",
    tag: "Répartition & Volumes",
    description: "Analyse globale de la répartition des cargaisons expédiées.",
    icon: FaChartPie,
  },
  {
    name: "Stock",
    tag: "Niveaux & Stockage",
    description: "Suivi des niveaux de stock et de la capacité disponible.",
    icon: FaBoxes,
  },
  {
    name: "Navires ACP",
    tag: "Acide Phosphorique",
    description: "Statistiques d'exportation pour les navires de type ACP.",
    icon: FaFlask,
  },
  {
    name: "Navires APP",
    tag: "Acide Purifié",
    description: "Suivi des expéditions des navires transportant l'APP.",
    icon: FaIndustry,
  },
  {
    name: "Navires Engrais",
    tag: "Engrais & Dérivés",
    description: "Exportations mondiales d'engrais et flux logistiques.",
    icon: FaSeedling,
  },
];

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = CATEGORIES_DATA.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="home-page-container">
      {/* Hero Section */}
      <div className="home-hero">
        <span className="hero-pill">Direction Commerciale & Export</span>
        <h1 className="hero-title">Tableau de Bord des Exportations</h1>
        <p className="hero-subtitle">
          Supervision analytique des expéditions, tonnages et indicateurs clés par catégorie.
        </p>

        {/* Global KPI Summary Bar */}
        <div className="home-kpi-bar">
          <div className="kpi-item">
            <div className="kpi-icon-wrap">
              <FaDatabase size={16} />
            </div>
            <div className="kpi-text">
              <span className="kpi-value">{CATEGORIES_DATA.length}</span>
              <span className="kpi-label">Catégories d'Export</span>
            </div>
          </div>

          <div className="kpi-divider"></div>

          <div className="kpi-item">
            <div className="kpi-icon-wrap">
              <FaCalendarAlt size={16} />
            </div>
            <div className="kpi-text">
              <span className="kpi-value">2025 - 2026</span>
              <span className="kpi-label">Périodes Analysées</span>
            </div>
          </div>

          <div className="kpi-divider"></div>

          <div className="kpi-item">
            <div className="kpi-icon-wrap">
              <FaCheckCircle size={16} />
            </div>
            <div className="kpi-text">
              <span className="kpi-value">Connecté</span>
              <span className="kpi-label">Base de Données OCP</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="home-search-wrap">
          <FaSearch className="search-icon" size={14} />
          <input
            type="text"
            placeholder="Rechercher une catégorie ou un type d'export..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="home-search-input"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="search-clear-btn"
              type="button"
            >
              Effacer
            </button>
          )}
        </div>
      </div>

      {/* Cards Grid */}
      {filteredCategories.length > 0 ? (
        <div className="category-cards-grid">
          {filteredCategories.map((cat, index) => {
            const IconComponent = cat.icon;
            return (
              <Link
                key={index}
                to={`/categorie/${encodeURIComponent(cat.name)}`}
                className="category-card"
              >
                <div className="card-top-row">
                  <div className="card-icon-container">
                    <IconComponent size={20} />
                  </div>
                  <span className="card-tag">{cat.tag}</span>
                </div>

                <div className="card-content">
                  <h3 className="category-name">{cat.name}</h3>
                  <p className="category-desc">{cat.description}</p>
                </div>

                <div className="card-footer-action">
                  <span>Accéder aux indicateurs</span>
                  <FaArrowRight className="arrow-icon" size={12} />
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="no-results-box">
          <p>Aucune catégorie ne correspond à votre recherche "{searchTerm}".</p>
          <button onClick={() => setSearchTerm("")} className="btn-reset-search">
            Réinitialiser la recherche
          </button>
        </div>
      )}
    </div>
  );
}
