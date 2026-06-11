const Booking = require("../models/Booking");
const nodemailer = require("nodemailer");

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

  if (smtpHost) {
    return nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: adminEmail,
        pass: adminPassword,
      },
    });
  }

  return nodemailer.createTransport({
    service: smtpService,
    auth: {
      user: adminEmail,
      pass: adminPassword,
    },
  });
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
          <td style="padding:12px 16px;border:1px solid #e7ded6;font-family:Arial,sans-serif;font-size:12px;color:#3a2d26;text-transform:uppercase;letter-spacing:1px;">${escapeHtml(label)}</td>
          <td style="padding:12px 16px;border:1px solid #e7ded6;font-family:Arial,sans-serif;font-size:13px;color:#3a2d26;">${escapeHtml(value)}</td>
        </tr>
      `
    )
    .join("");

  const title = isForAdmin ? "New Booking Alert" : "Booking Confirmed";
  const intro = isForAdmin 
    ? "A new styling appointment has been booked. The details are below."
    : "Thank you for booking with us. We have received your booking request and look forward to styling you. Your details are below.";

  return `
    <div style="margin:0;padding:34px;background:#fffdf7;color:#3a2d26;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #eadfd6;">
        <div style="padding:42px 34px;text-align:center;background:#2b170f;color:#fffdf7;">
          <div style="font-family:Georgia,serif;font-size:30px;line-height:1.1;">${title}</div>
          <div style="margin-top:12px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Philosophy Appointment</div>
        </div>
        <div style="padding:32px 34px;">
          <p style="margin:0 0 24px;font-family:Arial,sans-serif;font-size:13px;line-height:1.6;color:#3a2d26;">
            ${intro}
          </p>
          <table cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;">
            ${detailRows}
          </table>
        </div>
      </div>
    </div>
  `;
}

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

    // Send emails asynchronously
    const adminEmail = process.env.EMAIL_USER || process.env.ADMIN_EMAIL || process.env.admin_email;
    const toEmail = process.env.ADMIN_TO_EMAIL || adminEmail;

    if (adminEmail) {
      const formattedDateVal = formatDate(newBooking.date);
      const formattedTimeVal = formatTime(newBooking.time);

      const emailData = {
        fullName: newBooking.fullName,
        email: newBooking.email,
        phone: newBooking.phone,
        service: newBooking.service,
        formattedDate: formattedDateVal,
        formattedTime: formattedTimeVal,
      };

      try {
        const transporter = buildTransporter();

        // 1. Send email to admin
        await transporter.sendMail({
          from: `"Philosophy Booking" <${adminEmail}>`,
          to: toEmail,
          replyTo: newBooking.email,
          subject: `New Booking Alert: ${newBooking.fullName} - ${newBooking.service}`,
          html: buildBookingEmailHtml(emailData, true),
          text: [
            `New Booking Alert`,
            `Client: ${newBooking.fullName}`,
            `Email: ${newBooking.email}`,
            `Phone: ${newBooking.phone}`,
            `Service: ${newBooking.service}`,
            `Date: ${formattedDateVal}`,
            `Time: ${formattedTimeVal}`,
          ].join("\n"),
        });

        // 2. Send email to user (client)
        await transporter.sendMail({
          from: `"Philosophy Booking" <${adminEmail}>`,
          to: newBooking.email,
          subject: `Booking Confirmed: ${newBooking.service}`,
          html: buildBookingEmailHtml(emailData, false),
          text: [
            `Booking Confirmed`,
            `Thank you for booking with us.`,
            `Details:`,
            `Service: ${newBooking.service}`,
            `Date: ${formattedDateVal}`,
            `Time: ${formattedTimeVal}`,
          ].join("\n"),
        });
      } catch (mailError) {
        console.error("Booking confirmation emails failed to send:", mailError);
      }
    }

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

const deleteBooking = async (req, res) => {
  try {
    const deleted = await Booking.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.status(200).json({ success: true, id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createBooking, getAdminBookings, deleteBooking };
