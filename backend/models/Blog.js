const mongoose = require("mongoose")

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    excerpt: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      default: "",
    },
    author: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    readTime: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Study Tips", "Career Advice", "University Guide", "Academic Tips", "Study Abroad", "General"],
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Blog", blogSchema)
