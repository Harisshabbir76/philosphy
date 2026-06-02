const express = require("express");
const { getPageContent, updateComponentContent } = require("../controllers/content.controller");
const { requireAuth, requireAdmin } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/:page", getPageContent);
router.put("/:page/:component", requireAuth, requireAdmin, updateComponentContent);

module.exports = router;
