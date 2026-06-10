const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const contactRoutes = require("./src/routes/contact.routes");
const authRoutes = require("./src/routes/auth.routes");
const bookingRoutes = require("./src/routes/booking.routes");
const contentRoutes = require("./src/routes/content.routes");
const settingsRoutes = require("./src/routes/settings.routes");
const cmsRoutes = require("./src/routes/contentRoutes");

const app = express();
const port = process.env.PORT || 5000;
const frontendOrigin = process.env.FRONTEND_ORIGIN
  ? process.env.FRONTEND_ORIGIN.split(",").map((origin) => origin.trim())
  : ["http://127.0.0.1:3000", "http://localhost:3000"];

app.use(cors({ origin: frontendOrigin }));
app.use(express.json({ limit: "1mb" }));

app.use("/api/contact", contactRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/cms", cmsRoutes);

app.get("/health", (_request, response) => {
  response.json({ ok: true });
});

app.use("/api", (_request, response) => {
  response.status(404).json({ error: "API route not found" });
});

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/philosophy")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB. Auth/Booking features will fail.", err.message);
  });

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
