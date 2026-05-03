import asyncHandler from "../middlewares/asyncHandler.js";
import QRCode from "qrcode";
import Ticket from "../models/Ticket.js";
import Event from "../models/Event.js";
import { sendTicketEmail } from "../services/emailService.js";
import { createUniPayPayment } from "../services/paymentService.unipay.js";

const purchaseCooldown = new Map();

// 🎟 Buy Ticket
export const buyTicket = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { eventId, paymentMethod } = req.body;

  // Check event
  const event = await Event.findById(eventId);
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  // Prevent duplicates
  const existing = await Ticket.findOne({ user: userId, event: eventId });
  if (existing) {
    res.status(400);
    throw new Error("You already bought a ticket for this event");
  }

  // Cooldown
  const lastPurchase = purchaseCooldown.get(userId);
  const now = Date.now();
  if (lastPurchase && now - lastPurchase < 5000) {
    res.status(429);
    throw new Error("Please wait a few seconds before purchasing again");
  }
  purchaseCooldown.set(userId, now);

  // Approval check
  if (req.user.status !== "approved") {
    res.status(403);
    throw new Error("Only approved users can buy tickets");
  }

  // UniPAY
  if (paymentMethod === "unipay") {
    // await Ticket.create({
    //   user: userId,
    //   event: eventId,
    //   qrCodeData: "",
    //   qrCodeUrl: "",
    //   paymentMethod: "unipay",
    //   paymentStatus: "pending",
    // });

    const paymentUrl = await createUniPayPayment(req.user, event);
    return res.json({
      success: true,
      message: "Redirect to UniPAY payment",
      paymentUrl,
    });
  }

  // // Direct (free)
  // const qrData = `TICKET-${eventId}-${userId}-${Date.now()}`;
  // const qrCodeUrl = await QRCode.toDataURL(qrData);

  // const ticket = await Ticket.create({
  //   user: userId,
  //   event: eventId,
  //   qrCodeUrl,
  //   qrCodeData: qrData,
  //   paymentMethod,
  //   paymentStatus: "paid",
  // });

  // try {
  //   await sendTicketEmail(req.user, event, qrCodeUrl);
  // } catch (err) {
  //   console.error("Email sending failed:", err);
  // }

  // res.status(201).json({
  //   success: true,
  //   message: "Ticket purchased successfully. QR code sent to your email.",
  //   ticket,
  // });
  res.status(201).json({
    success: true,
    message: "Ticket purchased successfully. QR code sent to your email.",
  });
});

// ✅ Validate Ticket
export const validateTicket = asyncHandler(async (req, res) => {
  const { code } = req.body;

  const ticket = await Ticket.findOne({ qrCodeData: code })
    .populate("user", "firstName lastName email imageUrl status facebookUrl instagramUrl")
    .populate("event", "title bannerUrl date location");

  if (!ticket) {
    res.status(404);
    throw new Error("Invalid or fake ticket");
  }

  if (ticket.used) {
    return res.status(200).json({
      success: false,
      message: "This ticket has already been used.",
      usedAt: ticket.usedAt,
      event: ticket.event,
      user: ticket.user,
    });
  }

  ticket.used = true;
  ticket.usedAt = new Date();
  await ticket.save();

  res.json({
    success: true,
    message: "Ticket verified successfully",
    event: ticket.event,
    user: ticket.user,
  });
});

// 🧾 My Tickets
export const getMyTickets = asyncHandler(async (req, res) => {
  const tickets = await Ticket.find({ user: req.user._id })
    .populate("event", "title date location bannerUrl")
    .sort({ createdAt: -1 });

  res.json({ tickets });
});
