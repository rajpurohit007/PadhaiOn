const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Institution = require("../models/Institution");
const Inquiry = require("../models/Inquiry");
const Review = require("../models/Review");
const User = require("../models/User"); 
const Notification = require("../models/Notification"); // 🚀 ADDED: Import Notification
const { sendVerificationOtpEmail } = require("../services/emailService");

// Get all institutions (Permissive filter)
router.get("/", async (req, res) => {
  try {
    const { search, category, city, sortBy } = req.query;
    const query = { isActive: true, isVerified: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
        { specialization: { $regex: search, $options: "i" } },
      ];
    }

    if (category && category !== "All") {
      const categoryList = category.split(",");
      query.category = { $in: categoryList };
    }

    if (city && city !== "All") {
      const cityList = city.split(",");
      query.city = { $in: cityList };
    }

    const sort = {};
    if (sortBy === "rating") sort.rating = -1;
    else if (sortBy === "students") sort.totalStudents = -1;
    else if (sortBy === "name") sort.name = 1;
    else sort.rating = -1;

    const institutions = await Institution.find(query).sort(sort);
    res.json({ success: true, count: institutions.length, data: institutions });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching institutions", error: error.message });
  }
});

// Get single institution
router.get("/:id", async (req, res) => {
  try {
    const institution = await Institution.findById(req.params.id);
    if (!institution) return res.status(404).json({ success: false, message: "Institution not found" });
    res.json({ success: true, data: institution });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching institution", error: error.message });
  }
});

// Create institution
router.post("/", async (req, res) => {
  try {
    // 🚀 FIX 1: Destructure email from req.body
    const { email } = req.body;
    
    // 🚀 FIX 2: Check if institution already exists (or is unverified)
    const existingInstitution = await Institution.findOne({ email });
    if (existingInstitution) {
        if (existingInstitution.isVerified === false) {
             return res.status(400).json({ success: false, message: "Institution registered, but email not verified. Please check your inbox for the OTP." });
        }
        return res.status(400).json({ success: false, message: "Institution already exists" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    const institution = new Institution({
        ...req.body,
        isVerified: false, 
        otp,
        otpExpires,
    });
    await institution.save();

    // Now email is defined and the account is saved temporarily
    const mailResult = await sendVerificationOtpEmail(email, otp);
    if (!mailResult.success) {
        console.error("Failed to send institution verification email:", mailResult.error);
        // Allow registration to proceed, but user won't get the email (delivery issue)
    }

    // CRITICAL: NO ADMIN NOTIFICATION HERE. IT MUST BE AFTER OTP VERIFICATION.
    res.status(202).json({ success: true, message: "Institution registered successfully. Please verify your email with the OTP sent." });
  } catch (error) {
    // Check for specific unique index errors (like duplicate email)
    if (error.code === 11000) {
        return res.status(400).json({ success: false, message: "Email already registered." });
    }
    res.status(400).json({ success: false, message: "Error creating institution", error: error.message });
  }
});

// 🚀 NEW ROUTE: Verify OTP and Trigger Admin Request
router.post("/verify-otp", async (req, res) => {
    try {
        const { email, otp } = req.body;

        const institution = await Institution.findOne({ email });

        if (!institution) {
            return res.status(404).json({ success: false, message: "Institution not found." });
        }

        if (institution.isVerified) {
            return res.status(400).json({ success: false, message: "Email already verified." });
        }

        // 1. Check if OTP is correct AND not expired
        if (institution.otp === otp && institution.otpExpires > Date.now()) {
            // 2. Verification success: Update status
            institution.isVerified = true;
            institution.otp = undefined; // Clear the OTP field
            institution.otpExpires = undefined; // Clear the expiry field
            await institution.save();
            
            // 🚀 TRIGGER ADMIN REQUEST/NOTIFICATION HERE
            // The request is now verified, so we notify the admin
            await Notification.create({
                userId: institution._id, // Institution ID is the user ID here
                type: "institution_request",
                title: "NEW Institution Request Pending Approval",
                message: `The institution ${institution.name} has submitted a verified registration request.`,
                relatedId: institution._id,
                relatedModel: "Institution"
            });
            // You might also want to send an email to the ADMIN here if necessary.

            return res.status(200).json({ 
                success: true, 
                message: "Email verified successfully. Your registration request has been submitted for admin review." 
            });
        } else {
            // 3. OTP is wrong or expired
            return res.status(400).json({ 
                success: false, 
                message: "Invalid or expired OTP. Please try again or re-register." 
            });
        }

    } catch (error) {
        console.error("Institution OTP verification error:", error);
        res.status(500).json({ success: false, message: "Server error during verification." });
    }
});
// --- INQUIRY ROUTE ---
router.post("/:id/inquiry", async (req, res) => {
  try {
    const institutionId = req.params.id;
    const { userId, name, email, phone, course, message } = req.body;

    const institution = await Institution.findById(institutionId);
    if (!institution) return res.status(404).json({ success: false, message: "Institution not found" });

    if (userId) {
        await Inquiry.deleteMany({ userId: userId, institutionId: institutionId });
    }

    const inquiry = new Inquiry({
      institutionId: institutionId,
      userId,
      studentName: name,
      studentEmail: email,
      studentPhone: phone,
      courseInterest: course || "General Inquiry",
      message: message || "I am interested.",
    });

    await inquiry.save();

    // 🚀 ADDED: Create Notification for Institution
    await Notification.create({
        userId: institutionId,
        type: "admin_message", 
        title: "New Inquiry Received",
        message: `You have received a new inquiry from ${name}.`,
        relatedId: inquiry._id,
        relatedModel: "Inquiry"
    });

    res.status(201).json({ success: true, message: "Inquiry saved", data: inquiry });
  } catch (error) {
    res.status(400).json({ success: false, message: "Error sending inquiry", error: error.message });
  }
});

// --- REVIEW ROUTES ---

// 1. Get Reviews
router.get("/:id/reviews", async (req, res) => {
  try {
    const reviews = await Review.find({ institutionId: req.params.id, isApproved: true })
      .populate("userId", "name")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching reviews", error: error.message });
  }
});

// 2. Add Review
router.post("/:id/reviews", async (req, res) => {
  try {
    const institutionId = req.params.id;
    const { userId, rating, comment, course } = req.body;

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }
    
    if (user.userType !== 'student') {
        return res.status(403).json({ success: false, message: "Only students are allowed to write reviews." });
    }

    const existingReview = await Review.findOne({ institutionId, userId });
    if (existingReview) return res.status(400).json({ success: false, message: "You have already reviewed this institution." });

    const review = new Review({ institutionId, userId, rating, comment, course });
    await review.save();

    const stats = await Review.aggregate([
        { $match: { institutionId: new mongoose.Types.ObjectId(institutionId), isApproved: true } },
        { $group: { _id: '$institutionId', avgRating: { $avg: '$rating' }, numReviews: { $sum: 1 } } }
    ]);

    if (stats.length > 0) {
        await Institution.findByIdAndUpdate(institutionId, {
            rating: stats[0].avgRating.toFixed(1),
            totalReviews: stats[0].numReviews
        });
    }

    // 🚀 ADDED: Create Notification for Institution
    await Notification.create({
        userId: institutionId,
        type: "admin_message",
        title: "New Review Received",
        message: `${user.name} has posted a new review (${rating}/5).`,
        relatedId: review._id,
        relatedModel: "Review"
    });

    res.status(201).json({ success: true, message: "Review submitted", data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error submitting review", error: error.message });
  }
});

module.exports = router;