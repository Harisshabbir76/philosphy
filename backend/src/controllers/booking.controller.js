const Booking = require("../models/Booking");
const OffDay = require("../models/OffDay");
const nodemailer = require("nodemailer");

// Local "YYYY-MM-DD" key for an off-day lookup. The booking form sends `date`
// as a date-input string ("2026-07-15"); fall back to the calendar day of a
// full timestamp if anything else comes through.
function toDayKey(dateVal) {
  if (typeof dateVal === "string" && /^\d{4}-\d{2}-\d{2}/.test(dateVal)) {
    return dateVal.slice(0, 10);
  }
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function clean(value) {
  return String(value || "").trim();
}

function escapeHtml(value) {
  return clean(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatTime(time24) {
  if (!time24) return "";
  const parts = time24.split(":");
  if (parts.length < 2) return time24;
  let hour = parseInt(parts[0], 10);
  const minute = parts[1];
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${ampm}`;
}

function formatDate(dateVal) {
  if (!dateVal) return "";
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return String(dateVal);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + (minutes || 0);
}


function buildTransporter() {
  const adminEmail = process.env.EMAIL_USER || process.env.ADMIN_EMAIL || process.env.admin_email;
  const adminPassword = process.env.EMAIL_PASS || process.env.ADMIN_PASSWORD || process.env.password;
  const smtpService = process.env.SMTP_SERVICE || "gmail";
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpSecure = String(process.env.SMTP_SECURE || "false") === "true";

  if (!adminEmail || !adminPassword) {
    throw new Error("Email credentials (EMAIL_USER and EMAIL_PASS) are required");
  }

  // Timeouts so a slow/blocked SMTP server can never hang the request indefinitely.
  const timeouts = {
    connectionTimeout: 10000, // 10s to establish the TCP connection
    greetingTimeout: 10000, // 10s to receive the SMTP greeting
    socketTimeout: 15000, // 15s of inactivity on the socket
  };

  if (smtpHost) {
    return nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: adminEmail,
        pass: adminPassword,
      },
      ...timeouts,
    });
  }

  return nodemailer.createTransport({
    service: smtpService,
    auth: {
      user: adminEmail,
      pass: adminPassword,
    },
    ...timeouts,
  });
}

// Fire-and-forget: send confirmation emails without blocking the booking response.
async function sendBookingEmails(booking) {
  const adminEmail = process.env.EMAIL_USER || process.env.ADMIN_EMAIL || process.env.admin_email;
  const toEmail = process.env.ADMIN_TO_EMAIL || adminEmail;

  if (!adminEmail) return;

  const formattedDateVal = formatDate(booking.date);
  const formattedTimeVal = booking.startTime && booking.endTime
    ? `${formatTime(booking.startTime)} - ${formatTime(booking.endTime)}`
    : formatTime(booking.time);

  const emailData = {
    fullName: booking.fullName,
    email: booking.email,
    phone: booking.phone,
    service: booking.service,
    formattedDate: formattedDateVal,
    formattedTime: formattedTimeVal,
  };

  try {
    const transporter = buildTransporter();

    // 1. Send email to admin
    await transporter.sendMail({
      from: `"Philosophy Booking" <${adminEmail}>`,
      to: toEmail,
      replyTo: booking.email,
      subject: `New Booking Alert: ${booking.fullName} - ${booking.service}`,
      html: buildBookingEmailHtml(emailData, true),
      text: [
        `New Booking Alert`,
        `Client: ${booking.fullName}`,
        `Email: ${booking.email}`,
        `Phone: ${booking.phone}`,
        `Service: ${booking.service}`,
        `Date: ${formattedDateVal}`,
        `Time: ${formattedTimeVal}`,
      ].join("\n"),
    });

    // 2. Send email to user (client)
    await transporter.sendMail({
      from: `"Philosophy Booking" <${adminEmail}>`,
      to: booking.email,
      subject: `Booking Confirmed: ${booking.service}`,
      html: buildBookingEmailHtml(emailData, false),
      text: [
        `Booking Confirmed`,
        `Thank you for booking with us.`,
        `Details:`,
        `Service: ${booking.service}`,
        `Date: ${formattedDateVal}`,
        `Time: ${formattedTimeVal}`,
      ].join("\n"),
    });
  } catch (mailError) {
    console.error("Booking confirmation emails failed to send:", mailError);
  }
}

function buildBookingEmailHtml(data, isForAdmin) {
  const details = [
    ["Full Name", data.fullName],
    ["Email Address", data.email],
    ["Phone Number", data.phone],
    ["Service Booked", data.service],
    ["Booking Date", data.formattedDate],
    ["Booking Time", data.formattedTime],
  ];

  const detailRows = details
    .map(
      ([label, value]) => `
        <tr>
          <td style="width:38%;padding:12px 14px;border:1px solid #e7ded6;font-family:Arial,sans-serif;font-size:12px;color:#3a2d26;text-transform:uppercase;letter-spacing:1px;word-break:break-word;overflow-wrap:break-word;vertical-align:top;">${escapeHtml(label)}</td>
          <td style="padding:12px 14px;border:1px solid #e7ded6;font-family:Arial,sans-serif;font-size:13px;color:#3a2d26;word-break:break-word;overflow-wrap:break-word;vertical-align:top;">${escapeHtml(value)}</td>
        </tr>
      `
    )
    .join("");

  const title = isForAdmin ? "New Booking Alert" : "Booking Confirmed";
  const intro = isForAdmin
    ? "A new styling appointment has been booked. The details are below."
    : "Thank you for booking with us. We have received your booking request and look forward to styling you. Your details are below.";

  return `
    <div style="margin:0;padding:16px;background:#fffdf7;color:#3a2d26;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #eadfd6;">
        <div style="padding:32px 20px;text-align:center;background:#2b170f;color:#fffdf7;">
          <div style="font-family:Georgia,serif;font-size:26px;line-height:1.15;">${title}</div>
          <div style="margin-top:12px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Philosophy Appointment</div>
        </div>
        <div style="padding:24px 20px;">
          <p style="margin:0 0 24px;font-family:Arial,sans-serif;font-size:13px;line-height:1.6;color:#3a2d26;">
            ${intro}
          </p>
          <table cellspacing="0" cellpadding="0" style="width:100%;table-layout:fixed;border-collapse:collapse;">
            ${detailRows}
          </table>
        </div>
      </div>
    </div>
  `;
}

const createBooking = async (req, res) => {
  const { fullName, email, phone, service, date, time, startTime, endTime } = req.body;

  try {
    // 1. Fallback logic for backward compatibility
    let finalStartTime = startTime;
    let finalEndTime = endTime;

    if (!finalStartTime && time) {
      finalStartTime = time;
    }
    if (!finalEndTime) {
      finalEndTime = finalStartTime;
    }

    if (!finalStartTime || !finalEndTime) {
      return res.status(400).json({ error: "Start time and end time are required" });
    }

    // 2. Validate start & end time order
    const reqStart = timeToMinutes(finalStartTime);
    const reqEnd = timeToMinutes(finalEndTime);

    if (reqStart >= reqEnd) {
      return res.status(400).json({ error: "End time must be after start time" });
    }

    // 3. Query bookings for the same calendar day
    const bookingDate = new Date(date);
    if (isNaN(bookingDate.getTime())) {
      return res.status(400).json({ error: "Invalid date provided" });
    }

    // 3b. Block dates the admin has marked as off — either the whole day or a
    // specific window that overlaps the requested time.
    const offDay = await OffDay.findOne({ date: toDayKey(date) });
    if (offDay) {
      if (offDay.fullDay) {
        return res.status(400).json({
          code: "OFF_DAY",
          error: "The selected date is unavailable for booking.",
        });
      }
      const offStart = timeToMinutes(offDay.startTime);
      const offEnd = timeToMinutes(offDay.endTime);
      if (reqStart < offEnd && offStart < reqEnd) {
        return res.status(400).json({
          code: "OFF_DAY_TIME",
          error: "The selected time is unavailable for booking.",
          offStart: offDay.startTime,
          offEnd: offDay.endTime,
        });
      }
    }

    const startOfDay = new Date(bookingDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(bookingDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingBookings = await Booking.find({
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    // 4. One booking per day: if any booking already exists on this date, reject.
    if (existingBookings.length > 0) {
      return res.status(400).json({
        code: "DAY_BOOKED",
        error: "This date already has a booking. Only one booking per day is allowed.",
      });
    }

    // 5. Create new booking
    const newBooking = await Booking.create({
      userId: req.user ? req.user._id.toString() : null,
      fullName,
      email,
      phone,
      service,
      date: bookingDate,
      time: finalStartTime, // backward compatibility
      startTime: finalStartTime,
      endTime: finalEndTime,
    });

    // Auto-mark this date as a booking off-day so the calendar and booking page
    // reflect it instantly. Only inserts when no off-day exists for the date;
    // admin-marked days are left completely unchanged.
    OffDay.findOneAndUpdate(
      { date: toDayKey(date) },
      { $setOnInsert: { date: toDayKey(date), fullDay: true, startTime: "", endTime: "", source: "booking" } },
      { upsert: true }
    ).catch((err) => console.error("Failed to auto-mark booking date as off day:", err));

    // Respond immediately — the booking is saved. Emails are a side effect and must
    // never block (or fail) the user's confirmation. Send them in the background.
    res.status(201).json(newBooking);

    sendBookingEmails(newBooking).catch((err) =>
      console.error("Booking confirmation emails failed to send:", err)
    );
    return;
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

const deleteBooking = async (req, res) => {
  try {
    const deleted = await Booking.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Derive the same "YYYY-MM-DD" key used when the off-day was auto-created.
    // Bookings are stored as midnight UTC (new Date("YYYY-MM-DD")), so slicing
    // the ISO string always gives the correct calendar date regardless of timezone.
    const dateKey = new Date(deleted.date).toISOString().slice(0, 10);
    const dayStart = new Date(dateKey + "T00:00:00.000Z");
    const dayEnd   = new Date(dateKey + "T23:59:59.999Z");

    const remaining = await Booking.countDocuments({ date: { $gte: dayStart, $lte: dayEnd } });

    if (remaining === 0) {
      await OffDay.deleteOne({ date: dateKey });
    }

    res.status(200).json({ success: true, id: req.params.id });
  } catch (error) {
    console.error("[deleteBooking] error:", error);
    res.status(500).json({ error: error.message });
  }
};

const getBookedDates = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookings = await Booking.find({ date: { $gte: today } }, { date: 1 });
    const bookedDates = [...new Set(bookings.map((b) => toDayKey(b.date)))];
    res.status(200).json(bookedDates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createBooking, getAdminBookings, deleteBooking, getBookedDates };
