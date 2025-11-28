// models/RefreshToken.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const RefreshTokenSchema = new mongoose.Schema(
   {
      user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
         index: true,
      },
      tokenHash: {
         type: String,
         required: true,
      },
      expiresAt: {
         type: Date,
         required: true,
      },
      revoked: {
         type: Boolean,
         default: false,
      },
      replacedByToken: {
         type: String,
         default: null,
      },
   },
   { timestamps: true }
);

// compare raw token to hashed
RefreshTokenSchema.methods.matchToken = async function (token) {
   return bcrypt.compare(token, this.tokenHash);
};

module.exports = mongoose.model("RefreshToken", RefreshTokenSchema);
