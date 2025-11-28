// models/User.model.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
   {
      email: {
         type: String,
         required: true,
         trim: true,
         lowercase: true,
         unique: true,
      },
      password: {
         type: String,
         required: true,
      },
      // add more fields if needed (name, avatar, etc.)
   },
   {
      timestamps: true,
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
   }
);

// hash password before saving (only when modified)
UserSchema.pre("save", async function (next) {
   if (!this.isModified("password")) return next();
   try {
      const salt = await bcrypt.genSalt(12);
      this.password = await bcrypt.hash(this.password, salt);
      next();
   } catch (err) {
      next(err);
   }
});

// compare plaintext password with hashed password
UserSchema.methods.comparePassword = async function (candidatePassword) {
   return bcrypt.compare(candidatePassword, this.password);
};

// expose id
UserSchema.virtual("id").get(function () {
   return this._id.toString();
});

UserSchema.method("toJSON", function () {
   const { _id, __v, password, ...object } = this.toObject({ virtuals: true });
   return object;
});

module.exports = mongoose.model("User", UserSchema);
