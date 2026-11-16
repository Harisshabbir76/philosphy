const express = require("express");
const { createBooking, getAdminBookings, deleteBooking, getBookedDates } = require("../controllers/booking.controller");
const { requireAuth, requireAdmin } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/create", createBooking);
router.get("/booked-dates", getBookedDates);

// Admin routes
router.get("/admin", requireAuth, requireAdmin, getAdminBookings);
router.delete("/:id", requireAuth, requireAdmin, deleteBooking);

module.exports = router;
