const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

const JWT_SECRET = process.env.JWT_SECRET || "ocp_reporting_secret_key_2026";
const DEMO_EMAIL = "admin123@dev.com";
const DEMO_PASSWORD = "admin123";

// Helper to generate JWT token
function generateToken(user) {
  return jwt.sign(
    {
      id: user._id || "demo-admin-id",
      email: user.email,
      name: user.name,
      role: user.role || "admin",
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Veuillez renseigner l'email et le mot de passe.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Try finding user in database
    let user = await User.findOne({ email: normalizedEmail });

    // 2. If user doesn't exist yet but credentials match demo admin, auto-seed admin
    if (!user && normalizedEmail === DEMO_EMAIL && password === DEMO_PASSWORD) {
      user = await User.create({
        name: "Admin OCP",
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
        role: "admin",
      });
    }

    // 3. Verify password
    if (user) {
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Email ou mot de passe incorrect.",
        });
      }
    } else if (normalizedEmail === DEMO_EMAIL && password === DEMO_PASSWORD) {
      // Fallback in case DB is offline/unavailable
      user = {
        _id: "demo-admin-id",
        email: DEMO_EMAIL,
        name: "Admin OCP",
        role: "admin",
      };
    } else {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect.",
      });
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      message: "Connexion réussie",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la connexion.",
    });
  }
});

// GET /api/auth/me (check current user session)
router.get("/me", authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur serveur." });
  }
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  res.json({
    success: true,
    message: "Déconnexion réussie.",
  });
});

module.exports = router;
