const mongoose = require("mongoose");
require("dotenv").config();
const PageContent = require("./src/models/PageContent");

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const analysis = await PageContent.findOne({ page: "analysis", component: "services" });
    if (analysis && analysis.data && analysis.data.items) {
      let updated = false;
      analysis.data.items.forEach((item, index) => {
        if (item.html.includes("analysis-service__button")) {
          item.html = item.html.replace(/\n?<a href="\/booking" class="analysis-service__button">.*?<\/a>/g, '');
          updated = true;
          console.log(`Removed button from analysis item ${index}`);
        }
      });
      if (updated) {
        analysis.markModified("data");
        await analysis.save();
        console.log("Saved analysis updates");
      }
    }

    const wardrobe = await PageContent.findOne({ page: "wardrobe", component: "services" });
    if (wardrobe && wardrobe.data && wardrobe.data.items) {
      let updated = false;
      wardrobe.data.items.forEach((item, index) => {
        if (item.html.includes("wardrobe-analysis__button")) {
          // Check for variations in spacing
          item.html = item.html.replace(/\n?<a href="\/booking" class="wardrobe-analysis__button">.*?<\/a>/g, '');
          updated = true;
          console.log(`Removed button from wardrobe item ${index}`);
        }
      });
      if (updated) {
        wardrobe.markModified("data");
        await wardrobe.save();
        console.log("Saved wardrobe updates");
      }
    }

    console.log("Done");
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

run();
