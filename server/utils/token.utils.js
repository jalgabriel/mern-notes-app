// utils/token.utils.js
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

// random generator for refresh tokens (secure)
const generateRefreshTokenString = () => {
   return crypto.randomBytes(64).toString("hex"); // 128 chars
};

// hash refresh token before saving in DB
const hashToken = async (token) => {
   const salt = await bcrypt.genSalt(12);
   return bcrypt.hash(token, salt);
};

module.exports = {
   generateRefreshTokenString,
   hashToken,
};
