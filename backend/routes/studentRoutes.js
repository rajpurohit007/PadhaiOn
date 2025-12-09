const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const Institution = require("../models/Institution");
const Notification = require("../models/Notification");
const Inquiry = require("../models/Inquiry");
const { isAuthenticated, isStudent } = require("../middleware/roleAuth");

// Submit review
router.post("/reviews", isAuthenticated, isStudent, async (req, res) => {
  try {
    const { institutionId, rating, comment, course } = req.body;
    
    // Check if user already reviewed this institution
    const existingReview = await Review.findOne({
      userId: req.user.id,
      institutionId,
    });
    
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this institution",
      });
    }

    const review = new Review({
      userId: req.user.id,
      institutionId,
      rating,
      comment,
      course: course || "",
    });
    await review.save();

    // Recalculate institution rating
    const allReviews = await Review.find({ institutionId, isApproved: true });
    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = allReviews.length > 0 ? (totalRating / allReviews.length).toFixed(1) : 0;

    await Institution.findByIdAndUpdate(institutionId, {
      rating: avgRating,
      totalReviews: allReviews.length,
    });

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: review,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error submitting review",
      error: error.message,
    });
  }
});

// Get student's reviews
router.get("/reviews", isAuthenticated, isStudent, async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user.id })
      .populate("institutionId", "name")
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching reviews",
      error: error.message,
    });
  }
});

// Submit inquiry
router.post("/inquiries", isAuthenticated, isStudent, async (req, res) => {
  try {
    const { institutionId, subject, message } = req.body;
    const inquiry = new Inquiry({
      userId: req.user.id,
      institutionId,
      subject,
      message,
    });
    await inquiry.save();
    
    res.status(201).json({
      success: true,
      message: "Inquiry sent successfully",
      data: inquiry,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error sending inquiry",
      error: error.message,
    });
  }
});

// Get student notifications
router.get("/notifications", isAuthenticated, isStudent, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    
    const unreadCount = await Notification.countDocuments({
      userId: req.user.id,
      isRead: false,
    });

    res.json({
      success: true,
      data: notifications,
      unreadCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching notifications",
      error: error.message,
    });
  }
});

// Mark notification as read
router.patch("/notifications/:id/read", isAuthenticated, isStudent, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { isRead: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.json({
      success: true,
      data: notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating notification",
      error: error.message,
    });
  }
});

// Mark all notifications as read
router.patch("/notifications/read-all", isAuthenticated, isStudent, async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user.id, isRead: false },
      { isRead: true }
    );
    
    res.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating notifications",
      error: error.message,
    });
  }
});

module.exports = router;