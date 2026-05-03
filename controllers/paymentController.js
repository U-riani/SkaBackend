// controllers/paymentController.js
import asyncHandler from "../middlewares/asyncHandler.js";
import QRCode from "qrcode";
import Ticket from "../models/Ticket.js";
import Event from "../models/Event.js";
import User from "../models/User.js";
import { sendTicketEmail } from "../services/emailService.js";

export const unipayCallback = asyncHandler(async (req, res) => {
  try {
    const { OrderID, Status } = req.body;

    if (Status !== "success") {
      console.log("❌ UniPAY payment not completed:", req.body);
      return res.status(400).send("Payment not successful");
    }

    const parts = OrderID.split("-");
    const eventId = parts[1];
    const userId = parts[2];

    const user = await User.findById(userId);
    const event = await Event.findById(eventId);

    const qrData = `TICKET-${eventId}-${userId}-${Date.now()}`;
    const qrCodeUrl = await QRCode.toDataURL(qrData);

    // ✅ Create a new confirmed ticket
    const ticket = await Ticket.create({
      user: userId,
      event: eventId,
      qrCodeUrl,
      qrCodeData: qrData,
      paymentMethod: "unipay",
      paymentStatus: "paid",
    });

    await sendTicketEmail(user, event, qrCodeUrl);

    res.redirect(`${process.env.FRONTEND_URL}/payment-success`);
  } catch (err) {
    console.error("UniPAY callback error:", err);
    res.redirect(`${process.env.FRONTEND_URL}/payment-cancel`);
  }
});
