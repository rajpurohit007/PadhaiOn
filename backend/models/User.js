const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: false,
    },
    userType: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    bio: {
      type: String,
      default: "",
    },
    resetOtp: { type: String },
    resetOtpExpires: { type: Date },

    verificationOtp: { type: String },
    verificationOtpExpires: { type: Date },
    isVerified: {
        type: Boolean,
        default: false,
    },
  },
  
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
