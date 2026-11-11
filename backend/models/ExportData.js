const mongoose = require("mongoose");

const ExportDataSchema = new mongoose.Schema(
  {
    date_export: {
      type: Date,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    categorie: {
      type: String,
      required: true,
    },
    indicateur: {
      type: String,
      required: true,
    },
    valeur: {
      type: Number,
      required: true,
      default: 0,
    },
    source_sheet: {
      type: String,
      default: "EXPORT",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ExportData", ExportDataSchema);