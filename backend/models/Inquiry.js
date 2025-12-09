// const mongoose = require("mongoose")

// const inquirySchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: false, // make optional to support guest inquiries
//     },
//     institutionId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Institution",
//       required: true,
//     },
//     name: { type: String, default: "" },
//     email: { type: String, default: "" },
//     phone: { type: String, default: "" },

//     subject: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     message: {
//       type: String,
//       required: true,
//     },
//     status: {
//       type: String,
//       enum: ["new", "contacted", "closed"],
//       default: "new",
//     },
//   },
//   { timestamps: true },
// )

// module.exports = mongoose.model("Inquiry", inquirySchema)

const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema(
  {
    institutionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institution",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Requires user to be logged in
    },
    studentName: {
      type: String,
      required: true,
    },
    studentEmail: {
      type: String,
      required: true,
    },
    studentPhone: {
      type: String,
      required: true,
    },
    courseInterest: {
      type: String,
      default: "General",
    },
    message: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["new", "contacted", "converted", "closed"],
      default: "new",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Inquiry", inquirySchema);