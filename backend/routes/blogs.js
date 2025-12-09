const express = require("express")
const router = express.Router()
const Blog = require("../models/Blog")

// Get all blogs with filters
router.get("/", async (req, res) => {
  try {
    const { search, category } = req.query

    const query = {}

    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
      ]
    }

    // Category filter
    if (category && category !== "All") {
      query.category = category
    }

    const blogs = await Blog.find(query).sort({ createdAt: -1 })

    res.json({
      success: true,
      count: blogs.length,
      data: blogs,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching blogs",
      error: error.message,
    })
  }
})

// Get single blog by ID
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      })
    }

    res.json({
      success: true,
      data: blog,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching blog",
      error: error.message,
    })
  }
})

// Create new blog
router.post("/", async (req, res) => {
  try {
    const blog = new Blog(req.body)
    await blog.save()

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: blog,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating blog",
      error: error.message,
    })
  }
})

module.exports = router
