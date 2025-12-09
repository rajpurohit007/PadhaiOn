const express = require("express")
const router = express.Router()
const Testimonial = require("../models/Testimonial")

// Get all testimonials
router.get("/", async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 })

    res.json({
      success: true,
      count: testimonials.length,
      data: testimonials,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching testimonials",
      error: error.message,
    })
  }
})

// Create new testimonial
router.post("/", async (req, res) => {
  try {
    const testimonial = new Testimonial(req.body)
    await testimonial.save()

    res.status(201).json({
      success: true,
      message: "Testimonial created successfully",
      data: testimonial,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating testimonial",
      error: error.message,
    })
  }
})

module.exports = router
