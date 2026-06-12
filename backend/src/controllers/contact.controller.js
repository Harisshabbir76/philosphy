const nodemailer = require("nodemailer");

const requiredFields = ["fullName", "email", "phone", "serviceInterest", "stylingNeeds"];

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
  if (!time24) return "Not provided";
  const parts = time24.split(":");
  if (parts.length < 2) return time24;
  let hour = parseInt(parts[0], 10);
  const minute = parts[1];
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${ampm}`;
}

function formatDate(dateVal) {
  if (!dateVal) return "Not provided";
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

function buildEmailHtml(data) {
  const details = [
    ["Full Name", data.fullName],
    ["Email Address", data.email],
    ["Phone Number", data.phone],
    ["Service of Interest", data.serviceInterest],
    ["Preferred Date", data.formattedDate || "Not provided"],
    ["Preferred Time", data.formattedTime || "Not provided"],
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

  return `
    <div style="margin:0;padding:16px;background:#fffdf7;color:#3a2d26;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #eadfd6;">
        <div style="padding:32px 20px;text-align:center;background:#2b170f;color:#fffdf7;">
          <div style="font-family:Georgia,serif;font-size:26px;line-height:1.15;">New Styling Inquiry</div>
          <div style="margin-top:12px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Philosophy Contact Form</div>
        </div>
        <div style="padding:24px 20px;">
          <p style="margin:0 0 24px;font-family:Arial,sans-serif;font-size:13px;line-height:1.6;color:#3a2d26;">
            A new client has submitted the contact form. Their information is below.
          </p>
          <table cellspacing="0" cellpadding="0" style="width:100%;table-layout:fixed;border-collapse:collapse;">
            ${detailRows}
          </table>
          <div style="margin-top:26px;padding:20px;background:#fffdf7;border:1px solid #e7ded6;">
            <div style="margin-bottom:12px;font-family:Arial,sans-serif;font-size:12px;color:#3a2d26;text-transform:uppercase;letter-spacing:1px;">Styling Needs</div>
            <div style="font-family:Arial,sans-serif;font-size:13px;line-height:1.7;color:#3a2d26;word-break:break-word;overflow-wrap:break-word;">${escapeHtml(data.stylingNeeds).replace(/\n/g, "<br />")}</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

exports.submitContact = async (request, response) => {
  const data = {
    fullName: clean(request.body.fullName),
    email: clean(request.body.email),
    phone: clean(request.body.phone),
    serviceInterest: clean(request.body.serviceInterest),
    stylingNeeds: clean(request.body.stylingNeeds),
    preferredDate: clean(request.body.preferredDate),
    preferredTime: clean(request.body.preferredTime),
    formattedDate: formatDate(clean(request.body.preferredDate)),
    formattedTime: formatTime(clean(request.body.preferredTime)),
  };

  const missingField = requiredFields.find((field) => !data[field]);

  if (missingField) {
    return response.status(400).json({ error: `${missingField} is required` });
  }

  try {
    const adminEmail = process.env.EMAIL_USER || process.env.ADMIN_EMAIL || process.env.admin_email;
    const toEmail = process.env.ADMIN_TO_EMAIL || adminEmail;
    const transporter = buildTransporter();

    await transporter.sendMail({
      from: `"Philosophy Contact" <${adminEmail}>`,
      to: toEmail,
      replyTo: data.email,
      subject: `New styling inquiry from ${data.fullName}`,
      html: buildEmailHtml(data),
      text: [
        `Full Name: ${data.fullName}`,
        `Email Address: ${data.email}`,
        `Phone Number: ${data.phone}`,
        `Service of Interest: ${data.serviceInterest}`,
        `Preferred Date: ${data.formattedDate || "Not provided"}`,
        `Preferred Time: ${data.formattedTime || "Not provided"}`,
        "",
        "Styling Needs:",
        data.stylingNeeds,
      ].join("\n"),
    });

    return response.json({ ok: true });
  } catch (error) {
    console.error("Contact email failed:", error);
    return response.status(500).json({ error: "Unable to send contact email" });
  }
};
