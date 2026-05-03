import nodemailer from "nodemailer";

/**
 * Send a QR ticket email to the user.
 * @param {Object} user - The user object (with email, firstName, etc.)
 * @param {Object} event - The event object (with title, date, location)
 * @param {string} qrCodeUrl - Data URL of the QR image
 */
export const sendTicketEmail = async (user, event, qrCodeUrl) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const htmlContent = `
    <div style="font-family:sans-serif;padding:20px;line-height:1.5">
      <h2>🎟 Your Ticket for ${event.title}</h2>
      <p>Hello ${user.firstName},</p>
      <p>Thank you for your purchase! Below is your event ticket.</p>

      <p><strong>Event:</strong> ${event.title}</p>
      <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
      <p><strong>Location:</strong> ${event.location}</p>

      <p style="margin-top:20px;">Scan this QR code at the entrance:</p>
      <img src="cid:ticketqr" alt="Ticket QR" style="max-width:200px;border:1px solid #ddd;padding:5px;border-radius:8px;"/>

      <p style="margin-top:25px;color:gray;">If you didn’t make this purchase, please ignore this email.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Ska Tickets" <${process.env.SMTP_USER}>`,
    to: user.email,
    subject: `Your Ticket for ${event.title}`,
    html: htmlContent,
    attachments: [
      {
        filename: "ticket.png",
        path: qrCodeUrl, // this works with base64
        cid: "ticketqr", // matches the cid above
      },
    ],
  });
};

export const sendResetEmail = async (email, link) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  const html = `
    <div style="font-family:sans-serif;padding:20px">
      <h3>Password Reset Request</h3>
      <p>We received a request to reset your password. Click below to reset it:</p>
      <a href="${link}" 
         style="background:#007bff;color:#fff;padding:10px 15px;text-decoration:none;border-radius:5px;">
         Reset Password
      </a>
      <p style="margin-top:15px;">If you didn’t request this, ignore the email.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Ska Tickets" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Reset Your Password",
    html,
  });
};
