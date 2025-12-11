// module.exports = mongoose.model("Institution", institutionSchema);
const mongoose = require("mongoose");

const institutionSchema = new mongoose.Schema(
  {
    // --- AUTH FIELDS ---
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true, 
      lowercase: true 
    },
    password: { 
      type: String, 
      required: true 
    },
    userType: {
      type: String,
      default: "institution",
      immutable: true
    },
    resetOtp: { 
      type: String 
    },
    resetOtpExpires: { 
      type: Date 
    },
    isFirstLogin: { // NEW FIELD
      type: Boolean,
      default: true, 
    },
    profileCompleted: { // Added this field
      type: Boolean,
      default: false,
    },
    // -------------------

    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["School", "College", "Coaching Center", "University", "Vocational Institute"],
    },
    location: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 0,
    },
    totalStudents: {
      type: Number,
      required: true,
      default: 0,
    },
    specialization: {
      type: String,
      required: true,
    },
    established: {
      type: Number,
      required: true,
    },
    thumbnailUrl: { 
      type: String,
      default: "/placeholder.svg", 
    },
    galleryUrls: { 
      type: [String],
      default: [],
    },
    contact: {
      phone: { type: String, default: "" },
      email: { type: String, default: "" }, 
    },
    features: [{ type: String }],
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: true, 
    },
    description: {
      type: String,
      default: "",
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Institution", institutionSchema);