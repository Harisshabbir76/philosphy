const express = require("express");
const {
  signupUser,
  loginUser,
  getCurrentUser,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
} = require("../controllers/auth.controller");
const { requireAuth } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/login", loginUser);
router.post("/signup", signupUser);
router.get("/me", requireAuth, getCurrentUser);

router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);

module.exports = router;
