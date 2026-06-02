const Booking = require("../models/Booking");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY || "sk_test_fallback_so_server_doesnt_crash");

const createCheckoutSession = async (req, res) => {
  const { fullName, email, phone, service, date, time } = req.body;

  try {
    // Map services to prices (example static pricing or same price)
    // You can adjust these prices based on the service
    const priceAmount = 5000; // $50.00 example

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${service} Booking`,
              description: `Appointment on ${new Date(date).toLocaleDateString()} at ${time}`,
            },
            unit_amount: priceAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_ORIGIN}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_ORIGIN}/booking`,
      customer_email: email,
      metadata: {
        fullName,
        phone,
        service,
        date,
        time,
        userId: req.user ? req.user._id.toString() : null,
      },
    });

    res.status(200).json({ id: session.id, url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: error.message });
  }
};

const saveBookingSuccess = async (req, res) => {
  const { session_id } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      const existingBooking = await Booking.findOne({ stripeSessionId: session_id });

      if (existingBooking) {
        return res.status(200).json(existingBooking);
      }

      const newBooking = await Booking.create({
        userId: session.metadata.userId || null,
        fullName: session.metadata.fullName,
        email: session.customer_email,
        phone: session.metadata.phone,
        service: session.metadata.service,
        date: new Date(session.metadata.date),
        time: session.metadata.time,
        paymentStatus: "paid",
        stripeSessionId: session_id,
      });

      return res.status(201).json(newBooking);
    } else {
      res.status(400).json({ error: "Payment not completed" });
    }
  } catch (error) {
    console.error(error);
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

module.exports = { createCheckoutSession, saveBookingSuccess, getAdminBookings };
