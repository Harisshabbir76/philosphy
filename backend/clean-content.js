const mongoose = require("mongoose");
require("dotenv").config();
const Content = require("./src/models/Content");

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const contents = await Content.find({ 
      contentId: { $in: [
        "analysis.services.item0.html",
        "analysis.services.item1.html",
        "analysis.services.item2.html",
        "wardrobe.services.item0.html",
        "wardrobe.services.item1.html"
      ]}
    });

    for (const doc of contents) {
      let updated = false;
      
      if (doc.content && doc.content.includes("button")) {
        doc.content = doc.content.replace(/\n?<a href="\/booking" class="(analysis-service__button|wardrobe-analysis__button)">.*?<\/a>/g, '');
        updated = true;
      }
      
      if (doc.contentAr && doc.contentAr.includes("button")) {
        doc.contentAr = doc.contentAr.replace(/\n?<a href="\/booking" class="(analysis-service__button|wardrobe-analysis__button)">.*?<\/a>/g, '');
        updated = true;
      }

      if (updated) {
        await doc.save();
        console.log(`Cleaned button from ${doc.contentId}`);
      }
    }

    console.log("Done cleaning Content collection");
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

run();
