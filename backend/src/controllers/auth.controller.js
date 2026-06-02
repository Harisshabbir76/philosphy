const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { isAdminEmail } = require("../utils/admin");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET || "fallback_secret_key", { expiresIn: "3d" });
};

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

module.exports = { signupUser, loginUser, getCurrentUser };
