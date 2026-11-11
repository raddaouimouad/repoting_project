const app = require("../backend/app");
const connectDB = require("../backend/configs/db");

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (err) {
    console.error("Database connection failed in serverless handler:", err);
  }
  return app(req, res);
};
