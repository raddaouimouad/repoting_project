const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const connectDB = require("../configs/db");
const ExportData = require("../models/ExportData");

dotenv.config();

const filePath = path.join(__dirname, "../data/export_db_raw_all.csv");

function transformValue(rawValue, valueStatus) {
  if (valueStatus === "blank") {
    return null;
  }

  if (valueStatus === "error") {
    return 0;
  }

  const cleaned = String(rawValue ?? "").trim();
  const num = Number(cleaned);

  return Number.isNaN(num) ? 0 : num;
}

async function importCsvToMongo() {
  try {
    await connectDB();

    console.log("IMPORT FILE PATH:", filePath);

    const rows = [];
    let suspiciousCount = 0;

    fs.createReadStream(filePath, { encoding: "utf8" })
      .pipe(
        csv({
          mapHeaders: ({ header }) => header.replace(/^\uFEFF/, "").trim(),
          mapValues: ({ value }) => value.trim(),
        })
      )
      .on("data", (row) => {
        const valeur = transformValue(row.raw_value, row.value_status);

        if (
          String(row.raw_value).trim() !== "0" &&
          String(row.raw_value).trim() !== "" &&
          valeur === 0
        ) {
          suspiciousCount++;

          console.log("SUSPICIOUS ROW:");
          console.log({
            date_export: row.date_export,
            categorie: row.categorie,
            indicateur: row.indicateur,
            raw_value: row.raw_value,
            value_status: row.value_status,
            parsed_value: valeur,
          });
        }

        if (valeur === null) {
          return;
        }

        const exportDate = new Date(row.date_export);

        rows.push({
          date_export: exportDate,
          year: Number(row.year) || exportDate.getFullYear(),
          categorie: row.categorie,
          indicateur: row.indicateur,
          valeur: valeur,
          source_sheet: row.source_sheet || "EXPORT",
        });
      })
      .on("end", async () => {
        try {
          console.log(`Rows found: ${rows.length}`);
          console.log(`Suspicious rows: ${suspiciousCount}`);

          await ExportData.deleteMany({});

          await ExportData.insertMany(rows);

          console.log("Import terminé avec succès.");
        } catch (error) {
          console.error("Erreur pendant l'import :", error.message);
        } finally {
          await mongoose.connection.close();
          console.log("MongoDB connection closed.");
        }
      })
      .on("error", async (error) => {
        console.error("CSV read error:", error.message);
        await mongoose.connection.close();
      });
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
  }
}

importCsvToMongo();