// controllers/ticketController.js
import asyncHandler from "../middlewares/asyncHandler.js";
import QRCode from "qrcode";
import Ticket from "../models/Ticket.js";
import Event from "../models/Event.js";

const purchaseCooldown = new Map(); // userId -> timestamp

// 🎟 Buy Ticket
export const buyTicket = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { eventId } = req.body;

  // 🕒 Cooldown (5 seconds)
  const lastPurchase = purchaseCooldown.get(userId);
  const now = Date.now();
  if (lastPurchase && now - lastPurchase < 5000) {
    res.status(429);
    throw new Error("Please wait a few seconds before purchasing again");
  }
  purchaseCooldown.set(userId, now);

  // 🧾 Check event
  const event = await Event.findById(eventId);
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  // 🧾 Prevent duplicates
  const existing = await Ticket.findOne({ user: userId, event: eventId });
  if (existing) {
    res.status(400);
    throw new Error("You already bought a ticket for this event");
  }

  // 🧩 Status check
  if (req.user.status !== "approved") {
    res.status(403);
    throw new Error("Only approved users can buy tickets");
  }

  // 🎨 Generate QR data & image
  const qrData = `TICKET-${eventId}-${userId}-${Date.now()}`;
  const qrCodeUrl = await QRCode.toDataURL(qrData);

  // 💾 Save ticket
  const ticket = await Ticket.create({
    user: userId,
    event: eventId,
    qrCodeUrl,
    qrCodeData: qrData, // 👈 you missed this field earlier
  });

  res.status(201).json({
    message: "Ticket purchased successfully",
    ticket,
  });
});

// ✅ Validate Ticket (for QR scanners)
export const validateTicket = asyncHandler(async (req, res) => {
  const { code } = req.body;

  const ticket = await Ticket.findOne({ qrCodeData: code })
    .populate(
      "user",
      "firstName lastName email imageUrl status facebookUrl instagramUrl"
    )
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
      event: {
        title: ticket.event.title,
        date: ticket.event.date,
        location: ticket.event.location,
        bannerUrl: ticket.event.bannerUrl,
      },
      user: {
        firstName: ticket.user.firstName,
        lastName: ticket.user.lastName,
        email: ticket.user.email,
        imageUrl: ticket.user.imageUrl,
        status: ticket.user.status,
        facebookUrl: ticket.user.facebookUrl,
        instagramUrl: ticket.user.instagramUrl,
      },
    });
  }

  ticket.used = true;
  ticket.usedAt = new Date();
  await ticket.save();

  res.json({
    success: true,
    message: "Ticket verified successfully",
    event: {
      title: ticket.event.title,
      date: ticket.event.date,
      location: ticket.event.location,
      bannerUrl: ticket.event.bannerUrl,
    },
    user: {
      firstName: ticket.user.firstName,
      lastName: ticket.user.lastName,
      email: ticket.user.email,
      imageUrl: ticket.user.imageUrl,
      status: ticket.user.status,
      facebookUrl: ticket.user.facebookUrl,
      instagramUrl: ticket.user.instagramUrl,
    },
  });
});

// 🧾 Get My Tickets
export const getMyTickets = asyncHandler(async (req, res) => {
  const tickets = await Ticket.find({ user: req.user._id })
    .populate("event", "title date location bannerUrl")
    .sort({ createdAt: -1 });

  res.json({ tickets });
});
