// backend/routes/upload.js
const express = require("express")
const multer = require("multer")
const path = require("path")
const fs = require("fs")

const router = express.Router()

const uploadsDir = path.join(process.cwd(), "uploads")
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir)
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname)
    const base = path.basename(file.originalname, ext).replace(/\s+/g, "-")
    cb(null, `${base}-${Date.now()}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
})

// Upload multiple images
router.post("/images", upload.array("images", 10), async (req, res) => {
  try {
    // This correctly extracts the file data and constructs the URL
    const files = (req.files || []).map((f) => ({
      filename: f.filename,
      url: `/uploads/${f.filename}`, // The frontend will use this URL to display the image
      mimetype: f.mimetype,
      size: f.size,
    }))
    res.json({ success: true, files })
  } catch (error) {
    res.status(400).json({ success: false, message: "Upload failed", error: error.message })
  }
})

module.exports = router