const express = require("express");
const router = express.Router();

const {
  getAllExports,
  getCategories,
  getIndicateurs,
  getChartDataByCategorie,
  getIndicateursByCategorie,
} = require("../controllers/exportController");

router.get("/exports", getAllExports);
router.get("/categories", getCategories);
router.get("/indicateurs", getIndicateurs);
router.get("/chart-data", getChartDataByCategorie);
router.get("/indicateurs-by-categorie", getIndicateursByCategorie);
module.exports = router;