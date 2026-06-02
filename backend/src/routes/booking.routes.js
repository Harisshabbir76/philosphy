const express = require("express");
const { createCheckoutSession, saveBookingSuccess, getAdminBookings } = require("../controllers/booking.controller");
const { requireAuth, requireAdmin } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/create-checkout-session", createCheckoutSession); // optionally requireAuth
router.post("/success", saveBookingSuccess);

// Admin route
router.get("/admin", requireAuth, requireAdmin, getAdminBookings);

module.exports = router;
