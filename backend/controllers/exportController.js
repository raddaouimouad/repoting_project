const ExportData = require("../models/ExportData");

// GET all exports with optional filters
const getAllExports = async (req, res) => {
  try {
    const { year, categorie, indicateur } = req.query;

    let filter = {};

    if (year) {
      filter.year = Number(year);
    }

    if (categorie) {
      filter.categorie = categorie;
    }

    if (indicateur) {
      filter.indicateur = indicateur;
    }

    const data = await ExportData.find(filter).sort({ date_export: 1 });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET distinct categories
const getCategories = async (req, res) => {
  try {
    const { year } = req.query;

    let filter = {};

    if (year) {
      filter.year = Number(year);
    }

    const categories = await ExportData.distinct("categorie", filter);

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET distinct indicateurs
const getIndicateurs = async (req, res) => {
  try {
    const { year } = req.query;

    let filter = {};

    if (year) {
      filter.year = Number(year);
    }

    const indicateurs = await ExportData.distinct("indicateur", filter);

    res.json(indicateurs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET chart data by categorie and year
const getChartDataByCategorie = async (req, res) => {
  try {
    const { categorie, year } = req.query;

    let filter = {};

    if (categorie) {
      filter.categorie = categorie;
    }

    if (year) {
      filter.year = Number(year);
    }

    const data = await ExportData.find(filter).sort({ date_export: 1 });

    const formattedData = data.map((item) => ({
      date: item.date_export.toISOString().split("T")[0],
      indicateur: item.indicateur,
      value: item.valeur,
    }));

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET indicateurs by categorie
const getIndicateursByCategorie = async (req, res) => {
  try {
    const { year, categorie } = req.query;

    let filter = {};

    if (year) {
      filter.year = Number(year);
    }

    if (categorie) {
      filter.categorie = categorie;
    }

    const indicateurs = await ExportData.distinct("indicateur", filter);

    res.json(indicateurs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllExports,
  getCategories,
  getIndicateurs,
  getChartDataByCategorie,
  getIndicateursByCategorie,
};