const express = require("express");
const { createBooking, getAdminBookings } = require("../controllers/booking.controller");
const { requireAuth, requireAdmin } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/create", createBooking);

// Admin route
router.get("/admin", requireAuth, requireAdmin, getAdminBookings);

module.exports = router;
