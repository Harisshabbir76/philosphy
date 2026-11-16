const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
  contentId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  type: {
    type: String,
    default: 'text',
  },
  content: {
    type: String,
    default: '',
  },
  contentAr: {
    type: String,
    default: '',
  },
  styles: {
    desktop: { type: mongoose.Schema.Types.Mixed, default: {} },
    tablet: { type: mongoose.Schema.Types.Mixed, default: {} },
    mobile: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  customStyleEnabled: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Content', ContentSchema);
