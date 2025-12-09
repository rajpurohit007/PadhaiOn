const express = require("express");
const router = express.Router();
const Institution = require("../models/Institution");
const Inquiry = require("../models/Inquiry");
const Review = require("../models/Review");
const Notification = require("../models/Notification"); // 🚀 ADDED: Import Notification
const { isAuthenticated, isInstitution } = require("../middleware/roleAuth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// --- MULTER CONFIGURATION (For Media Updates) ---
const uploadDir = path.join(__dirname, "../public/uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 25 * 1024 * 1024 },
});

const uploadFields = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "galleryImages", maxCount: 5 },
]);

// --- 1. Get Institution Profile ---
router.get("/profile", isAuthenticated, isInstitution, async (req, res) => {
  try {
    // req.user is the Institution document from middleware
    res.json({ success: true, data: req.user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// --- 2. Update Institution Profile (UPDATED FOR MEDIA) ---
router.post("/profile", isAuthenticated, isInstitution, uploadFields, async (req, res) => {
  try {
    // req.body contains text fields. req.files contains new uploads.
    const updates = req.body;

    // Prevent updating sensitive login fields
    delete updates.password; 
    delete updates.email; 
    delete updates.userType;
    delete updates.isFirstLogin; 

    // --- HANDLE MEDIA UPDATES ---
    
    // 1. Thumbnail: If a new file is uploaded, use it. Otherwise, use the retained URL from body.
    if (req.files?.thumbnail) {
        updates.thumbnailUrl = `/public/uploads/${req.files.thumbnail[0].filename}`;
    } else if (updates.retainedThumbnail) {
        updates.thumbnailUrl = updates.retainedThumbnail;
    }

    // 2. Gallery: Merge retained URLs with new Uploads
    let finalGallery = [];
    
    // Parse retained URLs (Frontend sends them as a JSON string or array)
    if (updates.retainedGallery) {
        try {
            const retained = JSON.parse(updates.retainedGallery);
            if (Array.isArray(retained)) finalGallery = [...retained];
        } catch (e) {
            if (Array.isArray(updates.retainedGallery)) finalGallery = updates.retainedGallery;
            else if (typeof updates.retainedGallery === 'string') finalGallery.push(updates.retainedGallery);
        }
    }

    // Append new files
    if (req.files?.galleryImages) {
        const newUrls = req.files.galleryImages.map(f => `/public/uploads/${f.filename}`);
        finalGallery = [...finalGallery, ...newUrls];
    }

    updates.galleryUrls = finalGallery;
    // -----------------------------

    // Automatically mark profile as completed on update
    updates.profileCompleted = true;

    const updatedInstitution = await Institution.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json({ success: true, message: "Profile updated", data: updatedInstitution });
  } catch (error) {
    console.error("Profile Update Error:", error);
    res.status(400).json({ success: false, message: "Update failed", error: error.message });
  }
});

// --- 3. Get Inquiries ---
router.get("/inquiries", isAuthenticated, isInstitution, async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ institutionId: req.user._id })
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 }); 
    
    res.json({ success: true, data: inquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching inquiries" });
  }
});

// --- 4. Get Reviews ---
router.get("/reviews", isAuthenticated, isInstitution, async (req, res) => {
  try {
    const reviews = await Review.find({ institutionId: req.user._id })
      .populate("userId", "name")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching reviews" });
  }
});

// --- 5. Reply to a Review ---
router.post("/reviews/:id/reply", isAuthenticated, isInstitution, async (req, res) => {
  try {
    const { reply } = req.body;
    
    if (!reply) return res.status(400).json({ success: false, message: "Reply text is required" });

    const review = await Review.findOne({ _id: req.params.id, institutionId: req.user._id });
    if (!review) return res.status(404).json({ success: false, message: "Review not found or does not belong to you" });

    review.reply = reply;
    await review.save();

    // Create Notification
    try {
        await Notification.create({
            userId: review.userId,
            type: "review_reply",
            title: "Institution Replied",
            message: `${req.user.name} replied to your review.`,
            relatedId: review._id,
            relatedModel: "Review"
        });
    } catch (notifyError) {
        console.error("⚠️ Notification failed:", notifyError.message);
    }

    res.json({ success: true, message: "Reply posted", data: review });

  } catch (error) {
    console.error("Reply Error:", error);
    res.status(500).json({ success: false, message: "Error replying", error: error.message });
  }
});

// --- 6. Like/Unlike a Review ---
router.patch("/reviews/:id/like", isAuthenticated, isInstitution, async (req, res) => {
  try {
    const review = await Review.findOne({ _id: req.params.id, institutionId: req.user._id });
    if (!review) return res.status(404).json({ success: false, message: "Review not found" });

    const likerId = req.user._id;
    const index = review.likes.indexOf(likerId);

    if (index === -1) {
        review.likes.push(likerId); // Like
    } else {
        review.likes.splice(index, 1); // Unlike
    }

    await review.save();
    res.json({ success: true, message: "Success", data: review.likes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error toggling like" });
  }
});

// --- 7. Change Password (For First Login) ---
router.post("/change-password", isAuthenticated, isInstitution, async (req, res) => {
  try {
    const { newPassword } = req.body;
    
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    await Institution.findByIdAndUpdate(req.user._id, {
        password: newPassword,
        isFirstLogin: false
    });

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Change Password Error:", error);
    res.status(500).json({ success: false, message: "Error updating password" });
  }
});

// --- 8. 🚀 GET NOTIFICATIONS (This was missing, causing the 404) ---
router.get("/notifications", isAuthenticated, isInstitution, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    
    const unreadCount = await Notification.countDocuments({
      userId: req.user._id,
      isRead: false,
    });

    res.json({ success: true, data: notifications, unreadCount });
  } catch (error) {
    console.error("Notif Fetch Error:", error);
    res.status(500).json({ success: false, message: "Error fetching notifications" });
  }
});

// --- 9. 🚀 MARK NOTIFICATION READ ---
router.patch("/notifications/:id/read", isAuthenticated, isInstitution, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isRead: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ success: false, message: "Notification not found" });
    res.json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating notification" });
  }
});

// --- 10. 🚀 MARK ALL NOTIFICATIONS READ (New Feature) ---
router.patch("/notifications/read-all", isAuthenticated, isInstitution, async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
    res.json({ success: true, message: "All marked as read" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating notifications" });
  }
});

module.exports = router;