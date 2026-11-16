const ServiceBlock = require("../models/ServiceBlock");

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + (minutes || 0);
}

const getServiceBlocks = async (_req, res) => {
  try {
    const blocks = await ServiceBlock.find().sort({ date: 1 });
    res.status(200).json(blocks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const saveServiceBlock = async (req, res) => {
  try {
    const { date, services, fullDay } = req.body;
    let { startTime, endTime } = req.body;

    if (!date || !DATE_RE.test(date)) {
      return res.status(400).json({ error: "A valid date (YYYY-MM-DD) is required" });
    }
    if (!Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ error: "At least one service is required" });
    }

    const isFullDay = fullDay !== false;

    if (!isFullDay) {
      startTime = String(startTime || "").trim();
      endTime = String(endTime || "").trim();
      if (!TIME_RE.test(startTime) || !TIME_RE.test(endTime)) {
        return res.status(400).json({ error: "Valid start and end times (HH:MM) are required" });
      }
      if (timeToMinutes(startTime) >= timeToMinutes(endTime)) {
        return res.status(400).json({ error: "End time must be after start time" });
      }
    } else {
      startTime = "";
      endTime = "";
    }

    const block = await ServiceBlock.create({ date, services, fullDay: isFullDay, startTime, endTime });
    res.status(201).json(block);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteServiceBlock = async (req, res) => {
  try {
    const deleted = await ServiceBlock.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Service block not found" });
    }
    res.status(200).json({ success: true, id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getServiceBlocks, saveServiceBlock, deleteServiceBlock };
