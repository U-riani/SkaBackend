import Event from "../models/Event.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { v2 as cloudinary } from "cloudinary";

// CREATE EVENT
export const createEvent = asyncHandler(async (req, res) => {
  const { title, description, date, location, price } = req.body;

  if (!title || !date || !price) {
    res.status(400);
    throw new Error("Title, date and price are required.");
  }

  const bannerUrl = req.file?.path || null;

  const event = await Event.create({
    title,
    description,
    date,
    location,
    price,
    bannerUrl,
  });

  res.status(201).json({
    success: true,
    message: "Event created successfully",
    event,
  });
});

// UPDATE EVENT
export const updateEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const event = await Event.findById(id);

  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  const { title, description, date, location, price } = req.body;

  event.title = title || event.title;
  event.description = description || event.description;
  event.date = date || event.date;
  event.location = location || event.location;
  event.price = price || event.price;

  // Replace banner if new one uploaded
  if (req.file?.path) {
    event.bannerUrl = req.file.path;
  }

  await event.save();

  res.json({
    success: true,
    message: "Event updated successfully",
    event,
  });
});

// DELETE EVENT
export const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

//   // 🧹 Delete from Cloudinary if exists
//   if (event.bannerUrl) {
//     try {
//       const publicId = event.bannerUrl.split("/").pop().split(".")[0]; // crude but effective
//       await cloudinary.uploader.destroy(`ska_uploads/${publicId}`);
//       console.log("✅ Deleted banner from Cloudinary:", publicId);
//     } catch (err) {
//       console.warn("⚠️ Failed to delete Cloudinary image:", err.message);
//     }
//   }

//   await event.deleteOne();
//   res.json({ success: true, message: "Event deleted successfully" });
event.status = "archived";
await event.save();
res.json({ success: true, message: "Event archived successfully" });
});

// GET ALL EVENTS
export const getEvents = asyncHandler(async (req, res) => {
  const { type, archived } = req.query; // 'upcoming' | 'past' | 'all' | archived=true
  const query = {};

  // only show archived when explicitly asked
  if (archived === "true") {
    query.status = "archived";
  } else {
    query.status = "active";
  }

  if (type === "upcoming") {
    query.date = { $gte: new Date() };
  } else if (type === "past") {
    query.date = { $lt: new Date() };
  }

  const events = await Event.find(query).sort({ date: 1 });
  res.json({ success: true, count: events.length, events });
});



// GET SINGLE EVENT
export const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }
  res.json({ success: true, event });
});
