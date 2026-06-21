const mongoose = require("mongoose");
require("dotenv").config();
const Content = require("./src/models/Content");

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const doc = await Content.findOne({ contentId: "wardrobe.services.item0.html" });
    if (doc) {
      console.log("Found wardrobe.services.item0.html");
      console.log("--- content ---");
      console.log(doc.content);
      console.log("--- contentAr ---");
      console.log(doc.contentAr);

      // Let's aggressively strip any anchor tag with the button class
      let updated = false;
      
      const regex = /<a[^>]*class="[^"]*(analysis-service__button|wardrobe-analysis__button)[^"]*"[^>]*>[\s\S]*?<\/a>/gi;

      if (doc.content && regex.test(doc.content)) {
        doc.content = doc.content.replace(regex, '');
        updated = true;
        console.log("Cleaned content");
      }
      
      if (doc.contentAr && regex.test(doc.contentAr)) {
        doc.contentAr = doc.contentAr.replace(regex, '');
        updated = true;
        console.log("Cleaned contentAr");
      }

      if (updated) {
        await doc.save();
        console.log("Saved aggressive cleanup.");
      } else {
        console.log("No match found for the button class in content or contentAr.");
      }
    } else {
      console.log("Document not found!");
    }

    console.log("Done");
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

run();
