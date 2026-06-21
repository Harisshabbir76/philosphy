const OffDay = require("../models/OffDay");

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + (minutes || 0);
}

// GET /api/off-days — all off days, oldest date first.
const getOffDays = async (_req, res) => {
  try {
    const offDays = await OffDay.find().sort({ date: 1 });
    res.status(200).json(offDays);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * POST /api/off-days — create or update the off day for a date. Keyed by `date`
 * so saving the same date twice updates the existing entry instead of failing
 * on the unique index.
 */
const saveOffDay = async (req, res) => {
  try {
    const { date, fullDay } = req.body;
    let { startTime, endTime } = req.body;

    if (!date || !DATE_RE.test(date)) {
      return res.status(400).json({ error: "A valid date (YYYY-MM-DD) is required" });
    }

    const isFullDay = fullDay !== false; // default to full day

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

    const offDay = await OffDay.findOneAndUpdate(
      { date },
      { date, fullDay: isFullDay, startTime, endTime },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json(offDay);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/off-days/:id
const deleteOffDay = async (req, res) => {
  try {
    const deleted = await OffDay.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Off day not found" });
    }
    res.status(200).json({ success: true, id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getOffDays, saveOffDay, deleteOffDay };
