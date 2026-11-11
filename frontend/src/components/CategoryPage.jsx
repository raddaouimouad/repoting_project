import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCalendarAlt,
  FaChartBar,
  FaLayerGroup,
  FaInfoCircle,
} from "react-icons/fa";
import { API_BASE_URL as API_URL } from "../config/api";
import "./../styles/CategoryPage.css";

// Professional corporate chart color palette
const COLORS = [
  "#107c41", // OCP Primary Green
  "#2563eb", // Royal Blue
  "#0891b2", // Cyan / Teal
  "#d97706", // Amber
  "#7c3aed", // Violet
  "#059669", // Emerald
  "#dc2626", // Red / Coral
  "#475569", // Slate
  "#ea580c", // Orange
  "#4338ca", // Indigo
  "#0d9488", // Dark Teal
  "#be185d", // Pink
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="tooltip-box">
      <p className="tooltip-date">Date : {label}</p>
      <div className="tooltip-items-list">
        {payload.map((entry, index) => (
          <div key={index} className="tooltip-row">
            <span
              className="tooltip-dot"
              style={{ backgroundColor: entry.color }}
            ></span>
            <span className="tooltip-name">{entry.name} :</span>
            <span className="tooltip-val">
              {Number(entry.value).toLocaleString("fr-FR")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CategoryPage() {
  const { nomCategorie } = useParams();
  const [searchParams] = useSearchParams();

  const decodedCategorie = decodeURIComponent(nomCategorie || "");
  const yearFromUrl = searchParams.get("year") || "2025";

  const [year, setYear] = useState(yearFromUrl);
  const [indicateurs, setIndicateurs] = useState([]);
  const [selectedIndicateur, setSelectedIndicateur] = useState("");

  const [globalChartData, setGlobalChartData] = useState([]);
  const [globalIndicators, setGlobalIndicators] = useState([]);
  const [detailChartData, setDetailChartData] = useState([]);

  const [loadingIndicateurs, setLoadingIndicateurs] = useState(false);
  const [loadingGlobalChart, setLoadingGlobalChart] = useState(false);
  const [loadingDetailChart, setLoadingDetailChart] = useState(false);

  useEffect(() => {
    fetchIndicateurs();
    fetchGlobalChartData();
    setSelectedIndicateur("");
    setDetailChartData([]);
  }, [year, decodedCategorie]);

  useEffect(() => {
    if (selectedIndicateur) {
      fetchDetailChartData();
    }
  }, [selectedIndicateur, year, decodedCategorie]);

  const fetchIndicateurs = async () => {
    try {
      setLoadingIndicateurs(true);

      const res = await axios.get(`${API_URL}/api/indicateurs-by-categorie`, {
        params: {
          year,
          categorie: decodedCategorie,
        },
      });

      setIndicateurs(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching indicateurs:", error);
      setIndicateurs([]);
    } finally {
      setLoadingIndicateurs(false);
    }
  };

  const fetchGlobalChartData = async () => {
    try {
      setLoadingGlobalChart(true);

      const res = await axios.get(`${API_URL}/api/exports`, {
        params: {
          year,
          categorie: decodedCategorie,
        },
      });

      const rawData = Array.isArray(res.data) ? res.data : [];

      const indicatorsSet = new Set();
      const groupedByDate = {};

      rawData.forEach((item) => {
        const date = new Date(item.date_export).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
        });

        const indicateurName = item.indicateur;
        indicatorsSet.add(indicateurName);

        if (!groupedByDate[date]) {
          groupedByDate[date] = { date };
        }

        groupedByDate[date][indicateurName] = Number(item.valeur) || 0;
      });

      const indicatorsArray = Array.from(indicatorsSet);

      const formattedData = Object.values(groupedByDate).map((row) => {
        indicatorsArray.forEach((ind) => {
          if (row[ind] === undefined) {
            row[ind] = 0;
          }
        });
        return row;
      });

      setGlobalIndicators(indicatorsArray);
      setGlobalChartData(formattedData);
    } catch (error) {
      console.error("Error fetching global chart data:", error);
      setGlobalIndicators([]);
      setGlobalChartData([]);
    } finally {
      setLoadingGlobalChart(false);
    }
  };

  const fetchDetailChartData = async () => {
    try {
      setLoadingDetailChart(true);

      const res = await axios.get(`${API_URL}/api/exports`, {
        params: {
          year,
          categorie: decodedCategorie,
          indicateur: selectedIndicateur,
        },
      });

      const formattedData = Array.isArray(res.data)
        ? res.data.map((item) => ({
            date: new Date(item.date_export).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "2-digit",
            }),
            valeur: Number(item.valeur) || 0,
          }))
        : [];

      setDetailChartData(formattedData);
    } catch (error) {
      console.error("Error fetching detail chart data:", error);
      setDetailChartData([]);
    } finally {
      setLoadingDetailChart(false);
    }
  };

  // Compute quick stats for detail chart
  const detailTotal = detailChartData.reduce((acc, curr) => acc + curr.valeur, 0);
  const detailMax = detailChartData.length > 0
    ? Math.max(...detailChartData.map((d) => d.valeur))
    : 0;

  return (
    <div className="category-page">
      <div className="category-shell">
        <div className="category-container">
          {/* Topbar */}
          <div className="category-topbar">
            <div className="category-topbar-left">
              <Link to="/" className="back-link">
                <FaArrowLeft size={13} />
                <span>Retour aux catégories</span>
              </Link>

              <div className="category-header-titles">
                <h1 className="category-title">{decodedCategorie}</h1>
                <p className="category-subtitle">
                  Analyse des flux d'exportation pour l'année {year}
                </p>
              </div>
            </div>

            {/* Year Selector */}
            <div className="year-selector-wrap">
              <FaCalendarAlt className="calendar-icon" size={14} />
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="year-select"
                aria-label="Sélectionner l'année"
              >
                <option value="2025">Année 2025</option>
                <option value="2026">Année 2026</option>
              </select>
            </div>
          </div>

          {/* Section 1: Global Chart */}
          <div className="section-card">
            <div className="section-card-header">
              <div className="section-header-icon">
                <FaChartBar size={18} />
              </div>
              <div>
                <h2 className="section-title">
                  Évolution Globale — {decodedCategorie} ({year})
                </h2>
                <p className="section-subtitle">
                  Histogramme comparatif des indicateurs enregistrés par date
                </p>
              </div>
            </div>

            {loadingGlobalChart ? (
              <div className="loading-state">
                <div className="loader-spinner"></div>
                <span>Chargement du graphique global...</span>
              </div>
            ) : globalChartData.length > 0 ? (
              <>
                <div className="chart-scroll">
                  <div
                    style={{
                      minWidth:
                        globalChartData.length < 12
                          ? "100%"
                          : `${globalChartData.length * 48}px`,
                      height: "480px",
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={globalChartData} barCategoryGap="20%">
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis
                          dataKey="date"
                          angle={-45}
                          textAnchor="end"
                          height={65}
                          tick={{ fill: "#64748b", fontSize: 12 }}
                        />
                        <YAxis
                          domain={[0, "auto"]}
                          tick={{ fill: "#64748b", fontSize: 12 }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        {globalIndicators.map((ind, index) => (
                          <Bar
                            key={ind}
                            dataKey={ind}
                            fill={COLORS[index % COLORS.length]}
                            radius={[4, 4, 0, 0]}
                          />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="custom-legend">
                  {globalIndicators.map((ind, index) => (
                    <div key={ind} className="legend-item">
                      <span
                        className="legend-color"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      ></span>
                      <span className="legend-text">{ind}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="empty-state">
                <FaInfoCircle size={20} />
                <p>Aucune donnée enregistrée pour cette catégorie en {year}.</p>
              </div>
            )}
          </div>

          {/* Section 2: Indicators Grid */}
          <div className="section-card">
            <div className="section-card-header">
              <div className="section-header-icon">
                <FaLayerGroup size={18} />
              </div>
              <div>
                <h2 className="section-title">Indicateurs Disponibles</h2>
                <p className="section-subtitle">
                  Sélectionnez un indicateur pour afficher son analyse détaillée
                </p>
              </div>
            </div>

            {loadingIndicateurs ? (
              <div className="loading-state">
                <div className="loader-spinner"></div>
                <span>Chargement des indicateurs...</span>
              </div>
            ) : indicateurs.length > 0 ? (
              <div className="indicators-grid">
                {indicateurs.map((ind, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedIndicateur(ind)}
                    className={`indicator-btn ${
                      selectedIndicateur === ind ? "active" : ""
                    }`}
                  >
                    <span className="indicator-name">{ind}</span>
                    <span className="indicator-hint">
                      <span>Consulter le détail</span>
                      <FaArrowRight size={11} />
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <FaInfoCircle size={20} />
                <p>Aucun indicateur trouvé pour {decodedCategorie}.</p>
              </div>
            )}
          </div>

          {/* Section 3: Detail Chart */}
          <div className="section-card">
            <div className="section-card-header">
              <div className="section-header-icon">
                <FaChartBar size={18} />
              </div>
              <div className="detail-header-text">
                <h2 className="section-title">
                  {selectedIndicateur
                    ? `Détail : ${selectedIndicateur}`
                    : "Graphique Détaillé"}
                </h2>
                <p className="section-subtitle">
                  {selectedIndicateur
                    ? `Historique des valeurs pour ${selectedIndicateur} (${year})`
                    : "Veuillez choisir un indicateur ci-dessus"}
                </p>
              </div>

              {selectedIndicateur && detailChartData.length > 0 && (
                <div className="detail-metrics-badge">
                  <div className="metric-pill">
                    <span className="metric-pill-label">Total :</span>
                    <span className="metric-pill-value">
                      {detailTotal.toLocaleString("fr-FR")}
                    </span>
                  </div>
                  <div className="metric-pill">
                    <span className="metric-pill-label">Max :</span>
                    <span className="metric-pill-value">
                      {detailMax.toLocaleString("fr-FR")}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {loadingDetailChart ? (
              <div className="loading-state">
                <div className="loader-spinner"></div>
                <span>Chargement des données détaillées...</span>
              </div>
            ) : detailChartData.length > 0 ? (
              <div className="chart-scroll">
                <div
                  style={{
                    minWidth:
                      detailChartData.length < 12
                        ? "100%"
                        : `${detailChartData.length * 48}px`,
                    height: "400px",
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={detailChartData} barCategoryGap="20%">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="date"
                        angle={-45}
                        textAnchor="end"
                        height={65}
                        tick={{ fill: "#64748b", fontSize: 12 }}
                      />
                      <YAxis
                        domain={[0, "auto"]}
                        tick={{ fill: "#64748b", fontSize: 12 }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar
                        dataKey="valeur"
                        name={selectedIndicateur}
                        fill="#107c41"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <FaInfoCircle size={20} />
                <p>
                  {selectedIndicateur
                    ? "Aucun enregistrement pour cet indicateur."
                    : "Sélectionnez un indicateur ci-dessus pour visualiser ses données spécifiques."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
