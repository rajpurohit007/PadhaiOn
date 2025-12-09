const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      default: "",
    },
    consultationType: {
      type: String,
      required: true,
      enum: [
        "school-selection",
        "college-admission",
        "coaching-center",
        "university-application",
        "career-guidance",
        "study-abroad",
        "entrance-exam",
      ],
    },
    // Removed consultantId
    // Removed consultantName
    selectedDate: {
      type: String,
      required: true,
    },
    selectedTime: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed", "cancelled"],
      default: "pending",
    },
    meetingType: {
      type: String,
      enum: ["online", "offline"],
      default: "online",
    },
    meetingLink: {
      type: String,
      default: "",
    },
    meetingLocation: {
      type: String,
      default: "",
    },
    scheduledDate: {
      type: String,
      default: "",
    },
    scheduledTime: {
      type: String,
      default: "",
    },
    adminNotes: {
      type: String,
      default: "",
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    approvedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
      default: "",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Consultation", consultationSchema);