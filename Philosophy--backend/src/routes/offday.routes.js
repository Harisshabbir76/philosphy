const express = require("express");
const { getOffDays, saveOffDay, deleteOffDay } = require("../controllers/offday.controller");
const { requireAuth, requireAdmin } = require("../middleware/auth.middleware");

const router = express.Router();

// Public: the booking page reads off days to show unavailable dates/times.
router.get("/public", getOffDays);

// All off-day management is admin only.
router.get("/", requireAuth, requireAdmin, getOffDays);
router.post("/", requireAuth, requireAdmin, saveOffDay);
router.delete("/:id", requireAuth, requireAdmin, deleteOffDay);

module.exports = router;
