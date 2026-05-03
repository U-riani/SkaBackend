import asyncHandler from "../middlewares/asyncHandler.js";
import QRCode from "qrcode";
import Event from "../models/Event.js";
import Invite from "../models/Invite.js";

// 🎟 Create Invite (Admin only)
export const createInvite = asyncHandler(async (req, res) => {
  const { eventId, guest } = req.body;

  const event = await Event.findById(eventId);
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  // Generate QR
  const qrData = `INVITE-${eventId}-${Date.now()}`;
  const qrCodeUrl = await QRCode.toDataURL(qrData);

  const invite = await Invite.create({
    event: eventId,
    qrCodeUrl,
    qrCodeData: qrData,
    guest: guest || null,
  });

  res.status(201).json({
    success: true,
    message: "Invite created successfully",
    invite,
  });
});

// ✅ Validate Invite
export const validateInvite = asyncHandler(async (req, res) => {
  const { code } = req.body;

  const invite = await Invite.findOne({ qrCodeData: code }).populate(
    "event",
    "title date location bannerUrl"
  );

  if (!invite) {
    res.status(404);
    throw new Error("Invalid or fake invite");
  }

  const guestData = {
    firstName: invite.guest?.firstName || "",
    lastName: invite.guest?.lastName || "",
    facebookUrl: invite.guest?.facebookUrl || "",
    instagramUrl: invite.guest?.instagramUrl || "",
  };

  if (invite.used) {
    return res.status(200).json({
      success: false,
      message: "This invite has already been used.",
      usedAt: invite.usedAt,
      event: invite.event,
      status: "guest",
      user: guestData, // 👈 match key name with tickets
    });
  }

  invite.used = true;
  invite.usedAt = new Date();
  await invite.save();

  res.json({
    success: true,
    message: "Invite verified successfully",
    event: invite.event,
    status: "guest",
    user: guestData, // 👈 same shape
  });
});

// 📋 Get all invites for an event
export const getInvitesByEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const invites = await Invite.find({ event: eventId }).sort({ createdAt: -1 });
  res.json({ count: invites.length, invites });
});
