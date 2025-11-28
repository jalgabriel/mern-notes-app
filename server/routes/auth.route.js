// routes/auth.route.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller.js");

// POST /api/auth/register
router.post("/register", authController.register);

// POST /api/auth/login
router.post("/login", authController.login);

// POST /api/auth/refresh - uses cookie to refresh tokens
router.post("/refresh", authController.refresh);

// POST /api/auth/logout
router.post("/logout", authController.logout);

module.exports = router;
