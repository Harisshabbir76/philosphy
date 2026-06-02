const PageContent = require("../models/PageContent");

const getPageContent = async (req, res) => {
  try {
    const page = String(req.params.page || "").toLowerCase();
    const records = await PageContent.find({ page }).lean();

    const content = records.reduce((acc, record) => {
      acc[record.component] = record.data;
      return acc;
    }, {});

    res.status(200).json(content);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to load page content" });
  }
};

const updateComponentContent = async (req, res) => {
  try {
    const page = String(req.params.page || "").toLowerCase();
    const component = String(req.params.component || "");
    const data = req.body?.data;

    if (!page || !component || !data || typeof data !== "object" || Array.isArray(data)) {
      return res.status(400).json({ error: "Valid page, component, and data object are required" });
    }

    const record = await PageContent.findOneAndUpdate(
      { page, component },
      { page, component, data },
      { new: true, upsert: true, runValidators: true }
    ).lean();

    res.status(200).json(record.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to save page content" });
  }
};

module.exports = { getPageContent, updateComponentContent };
