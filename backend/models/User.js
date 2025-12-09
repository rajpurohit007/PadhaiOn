// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//     },
//     phone: {
//       type: String,
//       default: "",
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     userType: {
//       type: String,
//       enum: ["student", "institution", "admin"],
//       default: "student",
//     },
//     bio: {
//       type: String,
//       default: "",
//     },
//     location: {
//       type: String,
//       default: "",
//     },
//     education: {
//       type: String,
//       default: "",
//     },
//     institutionId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Institution",
//     },
//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//     isVerified: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Hash password before saving
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     return next();
//   }
//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// // Compare password method
// userSchema.methods.comparePassword = async function (candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };

// module.exports = mongoose.model("User", userSchema);
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
      required: true,
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
