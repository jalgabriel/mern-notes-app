// controllers/auth.controller.js
const jwt = require("jsonwebtoken");
const User = require("../models/User.model.js");
const RefreshToken = require("../models/RefreshToken.model.js");
const {
   generateRefreshTokenString,
   hashToken,
} = require("../utils/token.utils");

// --- ACCESS TOKEN ---
const createAccessToken = (user) => {
   return jwt.sign(
      { id: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m" }
   );
};

// cookie options for refresh token
const cookieOptions = (req) => {
   const secure = process.env.NODE_ENV === "production";
   return {
      httpOnly: true,
      secure,
      sameSite: secure ? "None" : "Lax",
      path: "/api/auth/refresh",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
   };
};

// --- CREATE REFRESH TOKEN (DB + Cookie) ---
const issueRefreshToken = async (user, res, req) => {
   const refreshTokenString = generateRefreshTokenString();
   const tokenHash = await hashToken(refreshTokenString);

   const expiresAt = new Date();
   expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

   await RefreshToken.create({
      user: user._id,
      tokenHash,
      expiresAt,
   });

   // store plain token in cookie
   res.cookie("jid", refreshTokenString, cookieOptions(req));

   return refreshTokenString;
};

// --- REGISTER ---
const register = async (req, res) => {
   try {
      const { email, password } = req.body;
      if (!email || !password)
         return res.status(400).json({ message: "Email and password required" });

      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing)
         return res.status(409).json({ message: "Email already in use" });

      const user = new User({ email, password });
      await user.save();

      const accessToken = createAccessToken(user);
      await issueRefreshToken(user, res, req);

      res.status(201).json({
         user: user.toJSON(),
         accessToken,
      });

   } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
   }
};

// --- LOGIN ---
const login = async (req, res) => {
   try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user)
         return res.status(401).json({ message: "Invalid credentials" });

      const match = await user.comparePassword(password);
      if (!match)
         return res.status(401).json({ message: "Invalid credentials" });

      const accessToken = createAccessToken(user);
      await issueRefreshToken(user, res, req);

      res.json({
         user: user.toJSON(),
         accessToken,
      });

   } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
   }
};

// --- REFRESH ACCESS TOKEN (DB backed) ---
const refresh = async (req, res) => {
   try {
      const token = req.cookies?.jid;
      if (!token) return res.status(401).json({ message: "No token" });

      // fetch all refresh tokens for user — we'll match hash manually
      const tokens = await RefreshToken.find().lean();

      let foundTokenDoc = null;

      for (const doc of tokens) {
         const matches = await require("bcryptjs").compare(token, doc.tokenHash);
         if (matches) {
         foundTokenDoc = doc;
         break;
         }
      }

      if (!foundTokenDoc)
         return res.status(401).json({ message: "Invalid token" });

      if (foundTokenDoc.revoked)
         return res.status(401).json({ message: "Token revoked" });

      if (new Date(foundTokenDoc.expiresAt) < new Date())
         return res.status(401).json({ message: "Token expired" });

      // Load user
      const user = await User.findById(foundTokenDoc.user);
      if (!user)
         return res.status(401).json({ message: "User not found" });

      // ROTATE refresh token
      await RefreshToken.findByIdAndUpdate(foundTokenDoc._id, {
         revoked: true,
      });

      await issueRefreshToken(user, res, req);

      // Issue access token
      const accessToken = createAccessToken(user);

      res.json({
         user: user.toJSON(),
         accessToken,
      });

   } catch (err) {
      console.error("Refresh error:", err);
      res.status(500).json({ message: "Server error" });
   }
};

// --- LOGOUT (REVOKE TOKEN) ---
const logout = async (req, res) => {
   try {
      const token = req.cookies?.jid;
      if (token) {
         const tokens = await RefreshToken.find();

         for (const doc of tokens) {
         const matches = await require("bcryptjs").compare(token, doc.tokenHash);
         if (matches) {
            await RefreshToken.findByIdAndUpdate(doc._id, { revoked: true });
         }
         }
      }

      res.clearCookie("jid", { path: "/api/auth/refresh" });
      res.json({ message: "Logged out" });

   } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
   }
};

module.exports = {
   login,
   register,
   refresh,
   logout,
};
