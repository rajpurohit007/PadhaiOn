const express = require("express");
const router = express.Router();
const Consultation = require("../models/Consultation");

// Get all consultations
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    const query = {};
    if (userId) {
      query.userId = userId;
    }
    const consultations = await Consultation.find(query)
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      count: consultations.length,
      data: consultations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching consultations",
      error: error.message,
    });
  }
});

// Create new consultation
router.post("/", async (req, res) => {
  try {
    const consultation = new Consultation(req.body);
    await consultation.save();
    res.status(201).json({
      success: true,
      message: "Consultation booked successfully",
      data: consultation,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error booking consultation",
      error: error.message,
    });
  }
});

// Get single consultation
router.get("/:id", async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id).populate("userId", "name email phone");
    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Consultation not found",
      });
    }
    res.json({
      success: true,
      data: consultation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching consultation",
      error: error.message,
    });
  }
});

module.exports = router;