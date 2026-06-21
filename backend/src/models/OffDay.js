const mongoose = require("mongoose");

/**
 * An "off day" is a calendar date the business is unavailable, either for the
 * whole day or for a specific time window. The admin manages these from the
 * dashboard calendar. `date` is stored as a "YYYY-MM-DD" string (not a Date)
 * so it always refers to the admin's chosen calendar day, free of timezone
 * shifts, and can be used as a unique key for upserts.
 */
const offDaySchema = new mongoose.Schema(
  {
    date: {
      type: String, // "YYYY-MM-DD"
      required: true,
      unique: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
    },
    fullDay: {
      type: Boolean,
      default: true,
    },
    // Only meaningful when fullDay is false. 24-hour "HH:MM".
    startTime: {
      type: String,
      default: "",
    },
    endTime: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OffDay", offDaySchema);
