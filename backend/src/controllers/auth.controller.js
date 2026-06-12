const crypto = require("crypto");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { isAdminEmail } = require("../utils/admin");
const { sendOtpEmail } = require("../utils/mailer");

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key";

const createToken = (_id) => {
  return jwt.sign({ _id }, JWT_SECRET, { expiresIn: "3d" });
};

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      throw Error("All fields must be filled");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw Error("Incorrect email");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw Error("Incorrect password");
    }

    const token = createToken(user._id);

    const isAdmin = isAdminEmail(user.email);

    res.status(200).json({ email, token, isAdmin });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const signupUser = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!email || !password || !fullName) {
      throw Error("All fields must be filled");
    }

    const exists = await User.findOne({ email });
    if (exists) {
      throw Error("Email already in use");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await User.create({ fullName, email, password: hash });
    const token = createToken(user._id);

    const isAdmin = isAdminEmail(user.email);

    res.status(200).json({ email, token, isAdmin });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getCurrentUser = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authorization required" });
  }

  res.status(200).json({
    email: req.user.email,
    isAdmin: isAdminEmail(req.user.email),
  });
};

// Step 1: user submits email -> generate OTP, store hashed, email it
const forgotPassword = async (req, res) => {
  const email = normalizeEmail(req.body.email);

  try {
    if (!email) {
      throw Error("Email is required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "No account found with this email" });
    }

    const otp = String(crypto.randomInt(0, 1000000)).padStart(6, "0");
    const salt = await bcrypt.genSalt(10);
    user.resetPasswordOtp = await bcrypt.hash(otp, salt);
    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    await sendOtpEmail(user.email, otp);

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Forgot password failed:", error);
    res.status(500).json({ error: "Unable to send verification code. Please try again." });
  }
};

// Step 2: user submits OTP -> verify, return short-lived reset token
const verifyResetOtp = async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const otp = String(req.body.otp || "").trim();

  try {
    if (!email || !otp) {
      throw Error("Email and code are required");
    }

    const user = await User.findOne({ email });
    if (!user || !user.resetPasswordOtp || !user.resetPasswordExpires) {
      throw Error("Invalid or expired code");
    }

    if (user.resetPasswordExpires.getTime() < Date.now()) {
      user.resetPasswordOtp = null;
      user.resetPasswordExpires = null;
      await user.save();
      throw Error("Code has expired. Please request a new one.");
    }

    const match = await bcrypt.compare(otp, user.resetPasswordOtp);
    if (!match) {
      throw Error("Invalid code");
    }

    const resetToken = jwt.sign({ _id: user._id, purpose: "password_reset" }, JWT_SECRET, {
      expiresIn: "10m",
    });

    res.status(200).json({ resetToken });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Step 3: user submits new password with reset token
const resetPassword = async (req, res) => {
  const { resetToken, password } = req.body;

  try {
    if (!resetToken || !password) {
      throw Error("All fields must be filled");
    }

    if (String(password).length < 6) {
      throw Error("Password must be at least 6 characters");
    }

    let payload;
    try {
      payload = jwt.verify(resetToken, JWT_SECRET);
    } catch {
      throw Error("Reset session expired. Please start again.");
    }

    if (payload.purpose !== "password_reset") {
      throw Error("Invalid reset token");
    }

    const user = await User.findById(payload._id);
    if (!user) {
      throw Error("Account no longer exists");
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordOtp = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  signupUser,
  loginUser,
  getCurrentUser,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
};
