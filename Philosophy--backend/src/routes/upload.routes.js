const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
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

// SVGs have no raster pixels and GIF animation would collapse to a single
// frame under a WebP re-encode, so those two formats are uploaded as-is.
const SKIP_CONVERSION_MIMETYPES = new Set(["image/svg+xml", "image/gif"]);

// POST /api/upload  (admin only) — multipart field name: "image"
router.post("/", requireAuth, requireAdmin, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    let buffer = req.file.buffer;
    if (!SKIP_CONVERSION_MIMETYPES.has(req.file.mimetype)) {
      buffer = await sharp(buffer).webp({ quality: 80 }).toBuffer();
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "philosophy", resource_type: "image" },
        (error, uploaded) => (error ? reject(error) : resolve(uploaded))
      );
      stream.end(buffer);
    });

    res.status(200).json({ url: result.secure_url, publicId: result.public_id });
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    res.status(500).json({ error: error.message || "Upload failed" });
  }
});

module.exports = router;
