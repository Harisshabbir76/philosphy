const express = require("express");
const { getServiceBlocks, saveServiceBlock, deleteServiceBlock } = require("../controllers/serviceblock.controller");
const { requireAuth, requireAdmin } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/public", getServiceBlocks);
router.get("/", requireAuth, requireAdmin, getServiceBlocks);
router.post("/", requireAuth, requireAdmin, saveServiceBlock);
router.delete("/:id", requireAuth, requireAdmin, deleteServiceBlock);

module.exports = router;
