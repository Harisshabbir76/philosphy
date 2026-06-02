const express = require("express");
const { signupUser, loginUser, getCurrentUser } = require("../controllers/auth.controller");
const { requireAuth } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/login", loginUser);
router.post("/signup", signupUser);
router.get("/me", requireAuth, getCurrentUser);

module.exports = router;
