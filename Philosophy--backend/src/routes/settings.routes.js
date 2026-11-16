const express = require("express");

const router = express.Router();

router.get("/public", (_req, res) => {
  res.json({
    businessWhatsappNumber: process.env.BUSINESS_WHATSAPP_NUMBER || "",
  });
});

module.exports = router;
