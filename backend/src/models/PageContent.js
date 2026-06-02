const mongoose = require("mongoose");

const pageContentSchema = new mongoose.Schema(
  {
    page: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    component: {
      type: String,
      required: true,
      trim: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: {},
    },
  },
  { timestamps: true }
);

pageContentSchema.index({ page: 1, component: 1 }, { unique: true });

module.exports = mongoose.model("PageContent", pageContentSchema);
