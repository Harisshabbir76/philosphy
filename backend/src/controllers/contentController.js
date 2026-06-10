const Content = require('../models/Content');

// @desc    Get all content as a mapped object (id -> content)
// @route   GET /api/content/all
// @access  Public
exports.getAllContent = async (req, res) => {
  try {
    const contents = await Content.find({});
    
    // Map array to object: { "hero-title": { ... }, "about-text": { ... } }
    const contentMap = {};
    contents.forEach(item => {
      contentMap[item.contentId] = item;
    });

    res.status(200).json({ success: true, data: contentMap });
  } catch (error) {
    console.error('Error fetching all content:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Save (Upsert) content by contentId
// @route   PUT /api/content/:id
// @access  Private (Assume admin middleware handles auth elsewhere)
exports.saveContent = async (req, res) => {
  try {
    const contentId = req.params.id;
    const { type, content, contentAr, styles, customStyleEnabled } = req.body;

    const updatedContent = await Content.findOneAndUpdate(
      { contentId },
      { contentId, type, content, contentAr, styles, customStyleEnabled },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ success: true, data: updatedContent });
  } catch (error) {
    console.error('Error saving content:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
