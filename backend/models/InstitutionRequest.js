// const mongoose = require("mongoose");

// const institutionRequestSchema = new mongoose.Schema(
//   {
//     institutionName: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     category: {
//       type: String,
//       required: true,
//       enum: ["School", "College", "Coaching Center", "University", "Vocational Institute"],
//     },
//     contactPerson: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       lowercase: true,
//     },
//     phone: {
//       type: String,
//       required: true,
//     },
//     location: {
//       type: String,
//       required: true,
//     },
//     city: {
//       type: String,
//       required: true,
//     },
//     established: {
//       type: Number,
//       required: true,
//     },
//     specialization: {
//       type: String,
//       required: true,
//     },
//     totalStudents: {
//       type: Number,
//       default: 0,
//     },
//     description: {
//       type: String,
//       required: true,
//     },

//     // --- ADDED IMAGE FIELDS ---
//     thumbnailUrl: { 
//         type: String, 
//         required: false
//     },
//     galleryUrls: { 
//         type: [String], 
//         default: [] 
//     },
//     // --- ADDED FEE FIELDS ---
//     feeStructure: {
//         selectedPlanId: { type: String, enum: ['basic', 'pro', 'enterprise', 'N/A'], default: 'N/A' },
//         initialFee: { type: Number, default: 0 },
//         recurringFee: { type: Number, default: 0 },
//         frequency: { type: String, enum: ['Annually', 'Monthly', 'N/A'], default: 'N/A' }
//     },

//     documents: [
//       {
//         name: String,
//         url: String,
//       },
//     ],
//     status: {
//       type: String,
//       enum: ["pending", "approved", "rejected"],
//       default: "pending",
//     },
//     rejectionReason: {
//       type: String,
//       default: "",
//     },
//     approvedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//     approvedAt: {
//       type: Date,
//     },
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       default: null,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("InstitutionRequest", institutionRequestSchema);
const mongoose = require("mongoose");

const institutionRequestSchema = new mongoose.Schema(
  {
    institutionName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    established: {
      type: Number,
      required: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    totalStudents: {
      type: Number,
      default: 0,
    },
    // Images
    thumbnailUrl: {
      type: String,
      default: "",
    },
    galleryUrls: {
      type: [String],
      default: [],
    },
    // Fee Structure Object
    feeStructure: {
      selectedPlanId: String,
      initialFee: Number,
      recurringFee: Number,
      frequency: String,
    },
    // Request Status
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: {
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("InstitutionRequest", institutionRequestSchema);