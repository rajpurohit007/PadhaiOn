const express = require("express")
const router = express.Router()
const Course = require("../models/Course")

// Get all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 })

    res.json({
      success: true,
      count: courses.length,
      data: courses,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching courses",
      error: error.message,
    })
  }
})

// Get single course by ID
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      })
    }

    res.json({
      success: true,
      data: course,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching course",
      error: error.message,
    })
  }
})

// Create new course
router.post("/", async (req, res) => {
  try {
    const course = new Course(req.body)
    await course.save()

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating course",
      error: error.message,
    })
  }
})

module.exports = router
