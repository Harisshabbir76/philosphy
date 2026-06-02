const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { isAdminEmail } = require("../utils/admin");

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret_key");
    req.user = await User.findOne({ _id }).select("_id email");
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Request is not authorized" });
  }
};

const requireAdmin = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authorization required" });
  }
  
  if (!isAdminEmail(req.user.email)) {
    return res.status(403).json({ error: "Admin access required" });
  }
  
  next();
};

module.exports = { requireAuth, requireAdmin };
