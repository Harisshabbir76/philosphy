const Booking = require("../models/Booking");

const createBooking = async (req, res) => {
  const { fullName, email, phone, service, date, time } = req.body;

  try {
    const newBooking = await Booking.create({
      userId: req.user ? req.user._id.toString() : null,
      fullName,
      email,
      phone,
      service,
      date: new Date(date),
      time,
    });

    return res.status(201).json(newBooking);
  } catch (error) {
    console.error("Booking creation error:", error);
    res.status(500).json({ error: error.message });
  }
};

const getAdminBookings = async (req, res) => {
  try {
    // We can add filtering logic here if query params are provided
    const { filter, date } = req.query;
    
    let query = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (filter === "today") {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      query.createdAt = { $gte: today, $lt: tomorrow };
    } else if (filter === "yesterday") {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      query.createdAt = { $gte: yesterday, $lt: today };
    } else if (filter === "last3days") {
      const last3days = new Date(today);
      last3days.setDate(last3days.getDate() - 3);
      query.createdAt = { $gte: last3days };
    } else if (date) {
      const selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(selectedDate);
      nextDay.setDate(nextDay.getDate() + 1);
      query.date = { $gte: selectedDate, $lt: nextDay };
    }

    const bookings = await Booking.find(query).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createBooking, getAdminBookings };
