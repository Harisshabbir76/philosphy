const express = require("express");
const multer = require("multer");
const cloudinary = require("../utils/cloudinary");
const { requireAuth, requireAdmin } = require("../middleware/auth.middleware");

const router = express.Router();

// Keep the file in memory; we stream it straight to Cloudinary.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

// POST /api/upload  (admin only) — multipart field name: "image"
router.post("/", requireAuth, requireAdmin, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "philosophy", resource_type: "image" },
        (error, uploaded) => (error ? reject(error) : resolve(uploaded))
      );
      stream.end(req.file.buffer);
    });

    res.status(200).json({ url: result.secure_url, publicId: result.public_id });
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    res.status(500).json({ error: error.message || "Upload failed" });
  }
});

module.exports = router;
